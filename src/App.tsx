import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import ResumeWizard from "./components/ResumeWizard";
import AIOptimizer from "./components/AIOptimizer";
import CoverLetterBuilder from "./components/CoverLetterBuilder";
import AdminPanel from "./components/AdminPanel";
import { ResumeDocument, CoverLetterDocument, UserAccount, UserPlan, ActivityLog, FeedbackItem } from "./types";
import { Sparkles, Mail, Lock, LogIn, ArrowRight, CheckCircle } from "lucide-react";

// Firebase Modules
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

// High-Fidelity Default Sample Resume
const SAMPLE_RESUME_DATA = {
  personalInfo: {
    name: "Tariq Ali",
    title: "Lead Cloud Infrastructure Specialist",
    email: "abdul.muiz300614@gmail.com",
    phone: "+1 555-382-1928",
    address: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/tariqali",
    github: "https://github.com/tariqali",
    portfolio: "https://tariq.dev",
  },
  summary: "Lead Infrastructure Specialist with 5+ years building highly reliable container systems. Championed cloud operations migration on AWS Kubernetes architecture, delivering 45% deployment speed increases and cutting legacy server billing by 30%.",
  experience: [
    {
      id: "exp_1",
      company: "InnovateTech Cloud Solutions",
      position: "Lead Software & Devops Engineer",
      startDate: "June 2022",
      endDate: "Present",
      current: true,
      responsibilities: "• Orchestrated migration of 4 monolithic systems to secure Docker Kubernetes infrastructure, reducing platform downtime by 24%.\n• Designed low-latency asynchronous server-side queues, scaling background jobs to handle 1.8M transactions daily.",
    },
    {
      id: "exp_2",
      company: "GrowthLabs Technology Inc",
      position: "Systems Administrator",
      startDate: "March 2020",
      endDate: "May 2022",
      current: false,
      responsibilities: "• Maintained automated backups and script deployment processes on CentOS clusters, safeguarding sensitive client credentials.\n• Facilitated RESTful Webhook integrations for third-party billing networks, boosting checkout transaction synchronization speeds.",
    }
  ],
  education: [
    {
      id: "edu_1",
      institution: "Stanford University",
      degree: "B.S. Computer Science",
      graduationDate: "May 2020",
      gpa: "3.9 / 4.0",
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Express", "Docker", "Kubernetes", "AWS Cloud", "Git", "SQL (Postgres)", "System Architecture"],
  certifications: ["AWS Certified Solutions Architect (Associate)", "Certified Kubernetes Administrator (CKA)"],
  languages: ["English (Native)", "Spanish (Conversational)"],
  projects: [
    {
      id: "proj_1",
      title: "Quantum Container Orchestrator",
      description: "Developed custom lightweight container management system utilizing raw Linux processes, cutting average bootstrap cold starts under 80 milliseconds.",
      technologies: "Go, Docker, Linux Systems, Protobuf",
      link: "https://github.com/tariq/quantum-orchestrator",
    }
  ],
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedResume, setSelectedResume] = useState<ResumeDocument | null>(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetterDocument | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Start false, onAuthStateChanged checks sessions
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>("abdul.muiz300614@gmail.com");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("Tariq Ali");
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  // User Profile State
  const [user, setUser] = useState<UserAccount>({
    id: "usr_guest",
    email: "",
    displayName: "Guest",
    plan: "free",
  });

  // Global registries for lists
  const [users, setUsers] = useState<UserAccount[]>([
    { id: "usr_tariq", email: "abdul.muiz300614@gmail.com", displayName: "Tariq Ali", plan: "free" },
    { id: "usr_sofia", email: "sofia.martinez@growth.io", displayName: "Sophia Martinez", plan: "pro" },
    { id: "usr_jonathan", email: "j.vance@mba.lse.ac.uk", displayName: "Jonathan Vance", plan: "pro" },
  ]);

  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterDocument[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  // 1. Core Authentication Synchronization Bridge (onAuthStateChanged)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        const userRef = doc(db, "users", userId);
        try {
          const userSnap = await getDoc(userRef);
          let currentProfile: UserAccount;

          if (userSnap.exists()) {
            const data = userSnap.data();
            currentProfile = {
              id: userId,
              email: firebaseUser.email || "",
              displayName: data.displayName || firebaseUser.displayName || "User",
              plan: (data.plan as UserPlan) || "free",
            };
          } else {
            const initialProfile: UserAccount = {
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              plan: "free",
            };
            await setDoc(userRef, {
              email: initialProfile.email,
              displayName: initialProfile.displayName,
              plan: initialProfile.plan,
            });
            currentProfile = {
              id: userId,
              ...initialProfile
            };
          }

          setUser(currentProfile);
          setIsLoggedIn(true);

          // Auto-migrate template fallback resume if they have zero resumes on initial session
          const resumesRef = collection(db, "resumes");
          const q = query(resumesRef, where("userId", "==", userId));
          const existingResumes = await getDocs(q);
          if (existingResumes.empty) {
            const initialId = "res_init_" + Date.now();
            const seedDoc: ResumeDocument = {
              id: initialId,
              title: "Senior Full-Stack Engineer Resume",
              templateType: "modern",
              userId: userId,
              data: SAMPLE_RESUME_DATA,
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "resumes", initialId), seedDoc);
          }

        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${userId}`);
        }
      } else {
        setIsLoggedIn(false);
        setUser({
          id: "usr_guest",
          email: "",
          displayName: "Guest",
          plan: "free",
        });
        setResumes([]);
        setCoverLetters([]);
        setActivities([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Subscription Pipelines (onSnapshot)
  useEffect(() => {
    if (!isLoggedIn || !user?.id || user.id === "usr_guest") {
      return;
    }

    const userId = user.id;

    // Resumes Snapshot Subscription
    const resumesQuery = query(collection(db, "resumes"), where("userId", "==", userId));
    const unsubResumes = onSnapshot(resumesQuery, (snapshot) => {
      const items: ResumeDocument[] = [];
      snapshot.forEach((snapDoc) => {
        items.push({ id: snapDoc.id, ...snapDoc.data() } as ResumeDocument);
      });
      setResumes(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "resumes");
    });

    // Cover Letters Snapshot Subscription
    const lettersQuery = query(collection(db, "coverLetters"), where("userId", "==", userId));
    const unsubLetters = onSnapshot(lettersQuery, (snapshot) => {
      const items: CoverLetterDocument[] = [];
      snapshot.forEach((snapDoc) => {
        items.push({ id: snapDoc.id, ...snapDoc.data() } as CoverLetterDocument);
      });
      setCoverLetters(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "coverLetters");
    });

    // Activities Snapshot Subscription
    const activitiesQuery = query(collection(db, "activities"), where("userId", "==", userId));
    const unsubActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const items: ActivityLog[] = [];
      snapshot.forEach((snapDoc) => {
        items.push({ id: snapDoc.id, ...snapDoc.data() } as ActivityLog);
      });
      setActivities(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "activities");
    });

    // Feedbacks Subscription for live logs or admin dashboard view
    const feedbacksQuery = collection(db, "feedbacks");
    const unsubFeedbacks = onSnapshot(feedbacksQuery, (snapshot) => {
      const items: FeedbackItem[] = [];
      snapshot.forEach((snapDoc) => {
        items.push({ id: snapDoc.id, ...snapDoc.data() } as FeedbackItem);
      });
      setFeedbacks(items);
    }, (error) => {
      console.warn("Feedbacks list retrieval restricted to system admin role.", error);
    });

    // Users general list for admin mock analytics
    const usersQuery = collection(db, "users");
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const items: UserAccount[] = [];
      snapshot.forEach((snapDoc) => {
        items.push({ id: snapDoc.id, ...snapDoc.data() } as UserAccount);
      });
      setUsers(items);
    }, (error) => {
      console.warn("User directory listing restricted to administrative back-office roles.", error);
    });

    return () => {
      unsubResumes();
      unsubLetters();
      unsubActivities();
      unsubFeedbacks();
      unsubUsers();
    };
  }, [isLoggedIn, user?.id]);

  // Global activity logger helper
  const addLog = async (details: string, type: "create_resume" | "optimize_resume" | "generate_cover" | "improve_bullet" | "download") => {
    const actId = "act_" + Date.now();
    const act: ActivityLog = {
      id: actId,
      type,
      details,
      timestamp: new Date().toISOString(),
    };

    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await setDoc(doc(db, "activities", actId), {
          ...act,
          userId: user.id
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `activities/${actId}`);
      }
    } else {
      setActivities((prev) => [act, ...prev]);
    }
  };

  // Upgradation triggered
  const handleUpgradeToPro = async () => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, { plan: "pro" });
        setUser((prev) => ({ ...prev, plan: "pro" }));
        await addLog("Upgraded account plan to CVForge Pro Lifetime membership!", "download");
        alert("Congratulations! You have upgraded to CVForge Pro. You now enjoy unlimited resume versions, 6 premium templates, and deep ATS keyword matching.");
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
      }
    } else {
      setUser((prev) => ({ ...prev, plan: "pro" }));
      addLog("Upgraded account plan to CVForge Pro Lifetime membership!", "download");
      alert("Congratulations! You have upgraded to CVForge Pro. You now enjoy unlimited resume versions, 6 premium templates, and deep ATS keyword matching.");
    }
  };

  // Auth processing via email submission (Simulating with beautiful fallback)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;

    const mockId = "usr_" + authEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const loggedUser: UserAccount = {
      id: mockId,
      email: authEmail,
      displayName: authTab === "signup" ? authName : authEmail.split("@")[0],
      plan: "free",
    };

    try {
      await setDoc(doc(db, "users", mockId), {
        email: loggedUser.email,
        displayName: loggedUser.displayName,
        plan: loggedUser.plan,
      });
      setUser(loggedUser);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      await addLog(`Signed into workspace as ${loggedUser.displayName}`, "create_resume");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${mockId}`);
    }
  };

  // Trigger Native Google Provider Authentication Flow (signInWithPopup)
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
      await addLog("Authorized session successfully using Google Sign-In", "create_resume");
    } catch (error) {
      console.error("Google Auth direct failure: ", error);
      alert("Google Sign-In failed or was canceled. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out failure:", e);
    }
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  // --- RESUME STATE MUTATORS ---
  const handleCreateResume = async () => {
    if (user.plan === "free" && resumes.length >= 2) {
      alert("You have reached the free plan limit of 2 resumes. Please upgrade to Pro for unlimited resume folders!");
      return;
    }
    const newId = "res_" + Date.now();
    const newDoc: ResumeDocument = {
      id: newId,
      title: `Resume Draft #${resumes.length + 1}`,
      templateType: "modern",
      userId: user.id || "usr_guest",
      data: {
        personalInfo: {
          name: user.displayName,
          title: "",
          email: user.email,
          phone: "",
          address: "",
          linkedin: "",
          github: "",
          portfolio: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
      },
      updatedAt: new Date().toISOString(),
    };

    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await setDoc(doc(db, "resumes", newId), newDoc);
        setSelectedResume(newDoc);
        setCurrentPage("wizard");
        await addLog(`Created new CV layout '${newDoc.title}'`, "create_resume");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `resumes/${newId}`);
      }
    } else {
      setResumes((prev) => [newDoc, ...prev]);
      setSelectedResume(newDoc);
      setCurrentPage("wizard");
      addLog(`Created new CV layout '${newDoc.title}'`, "create_resume");
    }
  };

  const handleCreateCoverLetter = () => {
    if (user.plan === "free" && coverLetters.length >= 2) {
      alert("You have reached the free plan limit of 2 cover letters. Please upgrade to Pro for unlimited cover letters!");
      return;
    }
    setSelectedCoverLetter(null); // Triggers empty configurations
    setCurrentPage("cover_letter");
  };

  const handleSaveResume = async (updatedDoc: ResumeDocument) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await setDoc(doc(db, "resumes", updatedDoc.id), {
          ...updatedDoc,
          userId: user.id
        });
        await addLog(`Saved resume updates for '${updatedDoc.title}'`, "create_resume");
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `resumes/${updatedDoc.id}`);
      }
    } else {
      setResumes((prev) =>
        prev.map((item) => (item.id === updatedDoc.id ? updatedDoc : item))
      );
      addLog(`Saved resume updates for '${updatedDoc.title}'`, "create_resume");
    }
  };

  const handleSaveCoverLetter = async (updatedLetter: CoverLetterDocument) => {
    const boundLetter = {
      ...updatedLetter,
      userId: user.id || "usr_guest"
    };

    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await setDoc(doc(db, "coverLetters", updatedLetter.id), boundLetter);
        await addLog(`Saved cover letter draft for ${updatedLetter.companyName}`, "generate_cover");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `coverLetters/${updatedLetter.id}`);
      }
    } else {
      setCoverLetters((prev) => {
        const exists = prev.some((l) => l.id === boundLetter.id);
        if (exists) {
          return prev.map((l) => (l.id === boundLetter.id ? boundLetter : l));
        } else {
          return [boundLetter, ...prev];
        }
      });
      addLog(`Saved cover letter draft for ${boundLetter.companyName}`, "generate_cover");
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await deleteDoc(doc(db, "resumes", id));
        await addLog("Deleted resume record from workspace", "create_resume");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `resumes/${id}`);
      }
    } else {
      setResumes((prev) => prev.filter((item) => item.id !== id));
      addLog("Deleted resume record from workspace", "create_resume");
    }
  };

  const handleDeleteCoverLetter = async (id: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await deleteDoc(doc(db, "coverLetters", id));
        await addLog("Deleted cover letter record from workspace", "generate_cover");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `coverLetters/${id}`);
      }
    } else {
      setCoverLetters((prev) => prev.filter((item) => item.id !== id));
      addLog("Deleted cover letter record from workspace", "generate_cover");
    }
  };

  const handleDuplicateResume = async (docObj: ResumeDocument) => {
    if (user.plan === "free" && resumes.length >= 2) {
      alert("Upgrade to Pro to duplicate this document (Free limit is 2 resumes maximum).");
      return;
    }
    const duplicatedId = "res_" + Date.now();
    const duplicated: ResumeDocument = {
      ...docObj,
      id: duplicatedId,
      title: `${docObj.title} (Copy)`,
      updatedAt: new Date().toISOString(),
      userId: user.id || "usr_guest"
    };

    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await setDoc(doc(db, "resumes", duplicatedId), duplicated);
        await addLog(`Duplicated resume '${docObj.title}'`, "create_resume");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `resumes/${duplicatedId}`);
      }
    } else {
      setResumes((prev) => [duplicated, ...prev]);
      addLog(`Duplicated resume '${docObj.title}'`, "create_resume");
    }
  };

  const handleRenameResume = async (id: string, newTitle: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await updateDoc(doc(db, "resumes", id), {
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        await addLog(`Renamed resume to '${newTitle}'`, "create_resume");
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `resumes/${id}`);
      }
    } else {
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: newTitle, updatedAt: new Date().toISOString() } : r))
      );
      addLog(`Renamed resume to '${newTitle}'`, "create_resume");
    }
  };

  const handleRenameCoverLetter = async (id: string, newTitle: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await updateDoc(doc(db, "coverLetters", id), {
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        await addLog(`Renamed letter draft to '${newTitle}'`, "generate_cover");
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `coverLetters/${id}`);
      }
    } else {
      setCoverLetters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
      );
      addLog(`Renamed letter draft to '${newTitle}'`, "generate_cover");
    }
  };

  // Feedback Submission Callback (Creates feedback in database)
  const handleFeedbackSubmit = async (category: "feature" | "bug" | "other", message: string) => {
    const feedbackId = "fb_" + Date.now();
    const feedback: FeedbackItem = {
      id: feedbackId,
      email: user.email || "anonymous@cvforge.ai",
      category,
      message,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await setDoc(doc(db, "feedbacks", feedbackId), feedback);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `feedbacks/${feedbackId}`);
      }
    } else {
      setFeedbacks((prev) => [feedback, ...prev]);
    }
  };

  // Admin Actions (Modifies collection records live)
  const handleToggleUserPlan = async (email: string) => {
    const matchUser = users.find((u) => u.email === email);
    if (!matchUser || !matchUser.id) return;
    const nextPlan = matchUser.plan === "pro" ? "free" : "pro";

    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await updateDoc(doc(db, "users", matchUser.id), { plan: nextPlan });
        if (matchUser.id === user.id) {
          setUser((prev) => ({ ...prev, plan: nextPlan }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${matchUser.id}`);
      }
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, plan: nextPlan } : u))
      );
      if (email === user.email) {
        setUser((prev) => ({ ...prev, plan: nextPlan }));
      }
    }
  };

  const handleResolveFeedback = async (id: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await updateDoc(doc(db, "feedbacks", id), { status: "resolved" });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `feedbacks/${id}`);
      }
    } else {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "resolved" } : f))
      );
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await deleteDoc(doc(db, "feedbacks", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `feedbacks/${id}`);
      }
    } else {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleUpdateUserDetails = async (name: string) => {
    if (isLoggedIn && user?.id && user.id !== "usr_guest") {
      try {
        await updateDoc(doc(db, "users", user.id), { displayName: name });
        setUser((prev) => ({ ...prev, displayName: name }));
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
      }
    } else {
      setUser((prev) => ({ ...prev, displayName: name }));
      setUsers((prev) =>
        prev.map((u) => (u.email === user.email ? { ...u, displayName: name } : u))
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-850">
      {/* GLOBAL HEADER BAR */}
      <Header
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onUpgrade={handleUpgradeToPro}
      />

      <main className="flex-grow">
        {/* VIEW 1: LANDING HOMEPAGE */}
        {currentPage === "landing" && (
          <Hero
            onStartBuilding={() => {
              if (isLoggedIn) {
                setCurrentPage("dashboard");
              } else {
                setShowAuthModal(true);
              }
            }}
            onUpgrade={handleUpgradeToPro}
          />
        )}

        {/* VIEW 2: LOGGED WORKSPACE DASHBOARD */}
        {isLoggedIn && currentPage === "dashboard" && (
          <Dashboard
            user={user}
            resumes={resumes}
            coverLetters={coverLetters}
            activities={activities}
            onSelectResume={(resume) => {
              setSelectedResume(resume);
              setCurrentPage("wizard");
            }}
            onSelectCoverLetter={(letter) => {
              setSelectedCoverLetter(letter);
              setCurrentPage("cover_letter");
            }}
            onCreateResume={handleCreateResume}
            onCreateCoverLetter={handleCreateCoverLetter}
            onDeleteResume={handleDeleteResume}
            onDeleteCoverLetter={handleDeleteCoverLetter}
            onDuplicateResume={handleDuplicateResume}
            onRenameResume={handleRenameResume}
            onRenameCoverLetter={handleRenameCoverLetter}
            onUpgrade={handleUpgradeToPro}
            onSubmitFeedback={handleFeedbackSubmit}
            onUpdateUserDetails={handleUpdateUserDetails}
          />
        )}

        {/* VIEW 3: MULTI-STEP RESUME BUILDER WIZARD */}
        {isLoggedIn && currentPage === "wizard" && selectedResume && (
          <ResumeWizard
            initialDoc={selectedResume}
            onSave={handleSaveResume}
            onExit={() => setCurrentPage("dashboard")}
          />
        )}

        {/* VIEW 4: ATS OPTIMIZATION DASHBOARD */}
        {isLoggedIn && currentPage === "optimizer" && (
          <AIOptimizer
            document={resumes[0] || selectedResume}
            onActivityLog={addLog}
            onExit={() => setCurrentPage("dashboard")}
          />
        )}

        {/* VIEW 5: COVER LETTER STUDIO WRITER */}
        {isLoggedIn && currentPage === "cover_letter" && (
          <CoverLetterBuilder
            initialLetter={selectedCoverLetter}
            resumeDoc={resumes[0]} // Always use first master resume as reference!
            onSave={handleSaveCoverLetter}
            onActivityLog={addLog}
            onExit={() => setCurrentPage("dashboard")}
          />
        )}

        {/* VIEW 6: GOVERNANCE BACKOFFICE SYSTEM ADMIN */}
        {isLoggedIn && currentPage === "admin" && (
          <AdminPanel
            users={users}
            feedbacks={feedbacks}
            onToggleUserPlan={handleToggleUserPlan}
            onResolveFeedback={handleResolveFeedback}
            onDeleteFeedback={handleDeleteFeedback}
            onExit={() => setCurrentPage("dashboard")}
          />
        )}
      </main>

      {/* GLOBAL FOOTER BAR */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* FULL AUTHENTIC SEAMLESS MODAL SCREEN OVERLAY */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-105 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              ×
            </button>

            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded tracking-wide text-[9px] font-black uppercase">
              SECURE CONNECT
            </span>

            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight mt-2 mb-1">
              {authTab === "login" ? "Login to CVForge AI" : "Create Professional Account"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">Gain full-fidelity access to modern layout frameworks instantly.</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === "signup" && (
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">YOUR DISPLAY NAME</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Tariq Ali"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                  placeholder="abdul.muiz300614@gmail.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">ACCOUNT PASSWORD</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/10 transition active:scale-95 flex items-center justify-center gap-1"
              >
                {authTab === "login" ? "Open Account Studio" : "Begin Your Career Optimization"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-400">
              <button
                onClick={() => setAuthTab(authTab === "login" ? "signup" : "login")}
                className="hover:text-blue-600"
              >
                {authTab === "login" ? "Need an account? Sign Up" : "Have an account? Login"}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-bold"
              >
                Google Sign-In Direct
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
