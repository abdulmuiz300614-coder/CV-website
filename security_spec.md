# Security Specification & Threat Model (TDD Specs)

This file details our security rules specifications, the threat vector payloads (the "Dirty Dozen"), and the validation test structure for securing CVForge's Firestore workspace.

## 1. Data Invariants

1. **User Identity Isolation**: A user can only access (`read`, `write`, `delete`) resources that are bound by their authenticated `userId` or are explicitly allocated to them.
2. **Access Control**: Relational structures like `resumes` and `coverLetters` must possess a `userId` field matching the active `request.auth.uid`.
3. **No Blanket Reads**: Collection listing rules must never be open to the public; they must require query boundaries specifying `resource.data.userId == request.auth.uid`.
4. **Administrative Exemption**: Admin users (whitelisted admins) have overarching view/management capability over feedbacks and accounts but cannot alter private user data folders without authorization (unless explicitly specified in the `admins` collection).
5. **No Spoofing Roles**: Non-admin users are strictly forbidden from self-elevating their account tiers (e.g., writing `plan = "pro"` to their user profile directly).
6. **Time Integrity**: Creation and update timestamps must be verified against server-time (`request.time`) instead of accepting client-side timestamps.

---

## 2. The "Dirty Dozen" Threat Payloads

Here are twelve highly dangerous payloads designed to exploit vulnerabilities and how we mitigate them:

### Payload 1: The Identity Hijack
* **Vector**: Attempt to write a resume draft with a hijacked foreign `userId`.
* **Payload**: `{"id": "res_evil", "title": "Injected Resume", "templateType": "modern", "data": {}, "userId": "usr_victim_tariq", "updatedAt": "request.time"}`
* **Expected Result**: `PERMISSION_DENIED` - Verified that incoming `userId` MUST match `request.auth.uid`.

### Payload 2: The Self-Proclaimed Admin/Pro elevation
* **Vector**: Attempt to patch a standard account's plan field to "pro" without payment.
* **Payload**: `{"email": "attacker@gmail.com", "displayName": "Attacker", "plan": "pro"}` on `/users/attackerId` update.
* **Expected Result**: `PERMISSION_DENIED` - Prevent non-admin users from altering their subscription status.

### Payload 3: The ID Poisoning Attack
* **Vector**: Injecting a 2MB binary string containing hex digits as an ID to create workspace clutter.
* **Payload**: Creation request using a document ID that violates string layout size.
* **Expected Result**: `PERMISSION_DENIED` - Enforced `isValidId(id)` pattern.

### Payload 4: PII Blanket Read Hunt
* **Vector**: An authenticated user attempts to execute a blanket `list` fetch on `/users` to scrape email addresses.
* **Payload**: Query: `getDocs(collection(db, "users"))`.
* **Expected Result**: `PERMISSION_DENIED` - Public collections with PII require explicit `resource.data.userId == request.auth.uid` or admin roles.

### Payload 5: Orphaned Review State Bypass
* **Vector**: Attempting to alter a feedback item's `status` to `resolved` as an unauthenticated or normal user.
* **Payload**: `{"status": "resolved"}` update to `/feedbacks/fb_1` from a victim's feedback database.
* **Expected Result**: `PERMISSION_DENIED` - Only whitelisted administrators can execute state updates for feedbacks.

### Payload 6: The Time-Traveler Hack
* **Vector**: Submitting client-generated timestamps in the past to gain artificial trial period extensions.
* **Payload**: `{"createdAt": "2020-01-01T00:00:00Z"}` instead of server timestamp constraint.
* **Expected Result**: `PERMISSION_DENIED` - Enforced exact equality to `request.time`.

### Payload 7: The Shadow Field Injection
* **Vector**: Adding an illegal field `isAdmin: true` inside a standard resume document map to verify if structural strictness was skipped.
* **Payload**: `{"id": "res_1", "userId": "usr_attacker", "isAdmin": true, "title": "Resume", "templateType": "modern", "updatedAt": "request.time", "data": {}}`
* **Expected Result**: `PERMISSION_DENIED` - Enforced exact structural schema key sizes on object creations.

### Payload 8: Ghost Feedback Spoofing
* **Vector**: Injecting fake feedbacks on behalf of premium users.
* **Payload**: `{"id": "fb_fake", "email": "innocent_victim@growth.io", "category": "bug", "message": "Spam message", "timestamp": "request.time", "status": "pending"}`
* **Expected Result**: `PERMISSION_DENIED` - The user's authenticated email must correspond exactly to the sender email.

### Payload 9: Unbounded Data Blast ("Denial of Wallet")
* **Vector**: Attempting to upload an array of 50,000 blank work experiences to blow up Firestore size metrics.
* **Payload**: A resume update containing `data.experience` with thousands of records.
* **Expected Result**: `PERMISSION_DENIED` - Size verification constraints.

### Payload 10: State Step-Jumping Shortcut
* **Vector**: Forcing status field overrides directly in transactions.
* **Expected Result**: `PERMISSION_DENIED` - Restricted status state transitions.

### Payload 11: Cross-Tenant Asset Theft
* **Vector**: Attacker attempts to list resumes belonging to victim `usr_tariq`.
* **Payload**: Target query without a proper client filter on `userId`.
* **Expected Result**: `PERMISSION_DENIED` - Rule enforces query evaluation limits at database boundaries.

### Payload 12: Improper Field Modification on Immutable Properties
* **Vector**: Trying to reassign a resource's `id` or `userId` as an update operation.
* **Payload**: `{"userId": "new_evil_usr"}` payload change.
* **Expected Result**: `PERMISSION_DENIED` - Immutability enforces `incoming().userId == existing().userId`.

---

## 3. Test Runner Structure (`firestore.rules.test.ts`)

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "platinum-xerocopy-0lrqd",
    firestore: {
      rules: require("fs").readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("CVForge Firestore Security Auditing Suite", () => {
  test("Payload 1: Should fail identity hijacks for other owners", async () => {
    const maliciousUserEnv = testEnv.authenticatedContext("usr_attacker", {
      email: "attacker@gmail.com",
      email_verified: true,
    });
    
    const db = maliciousUserEnv.firestore();
    await assertFails(
      setDoc(doc(db, "resumes", "res_test_1"), {
        id: "res_test_1",
        title: "Malicious Resume",
        templateType: "modern",
        updatedAt: new Date().toISOString(),
        userId: "usr_victim_tariq", // Fraudulent ownership attempt
        data: {}
      })
    );
  });

  test("Payload 2: Standard client cannot raise trial tier to Pro lifetime accounts", async () => {
    const standardUserEnv = testEnv.authenticatedContext("usr_tariq", {
      email: "abdul.muiz300614@gmail.com",
      email_verified: true,
    });

    const db = standardUserEnv.firestore();
    // Attempt update plan key
    await assertFails(
      setDoc(doc(db, "users", "usr_tariq"), {
        email: "abdul.muiz300614@gmail.com",
        displayName: "Tariq Ali",
        plan: "pro" // Client-side self elevation attempts
      })
    );
  });
});
```
