import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize Gemini client on server-side only
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper function to call Gemini
async function getGeminiResponse(systemInstruction: string, prompt: string, isJson = false, responseSchema?: any) {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing on the server.");
    }

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (isJson) {
      config.responseMimeType = "application/json";
      if (responseSchema) {
        config.responseSchema = responseSchema;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from the AI model.");
    }
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to communicate with AI");
  }
}

// Ensure server is online
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 1. AI Summary Generator
app.post("/api/generate-summary", async (req, res) => {
  const { yearsOfExperience, targetRole, skills, backgroundInfo } = req.body;
  
  const systemInstruction = 
    "You are an elite, ATS-certified career coach and resume specialist. Your goal is to write a highly compelling, professional summary. Write an ATS-friendly professional summary based on the user's experience and target role. Keep it concise, impactful, and focused on measurable value.";

  const prompt = `
    Target Role: ${targetRole || "Professional"}
    Years of Experience: ${yearsOfExperience || "N/A"}
    Primary Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "N/A"}
    Background/Achievements: ${backgroundInfo || "N/A"}

    Generate a single, polished professional summary of 60-100 words. Use strong active verbs, quantify achievements where possible (e.g., millions saved, percentage efficiency boosts, scale of projects), and speak with corporate authority. Ensure it bypasses automated filter blocks (ATS-friendly).
  `;

  try {
    const summary = await getGeminiResponse(systemInstruction, prompt);
    res.json({ success: true, summary: summary.trim() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Improve Bullet Points
app.post("/api/improve-bullet", async (req, res) => {
  const { bulletPoint, targetRole } = req.body;

  const systemInstruction =
    "You are an expert ATS optimization engine. Rewrite each responsibility as a strong achievement using action verbs and measurable outcomes where appropriate. Keep statements concise and realistic.";

  const prompt = `
    Target Role/Industry: ${targetRole || "Standard Work Environment"}
    Original resume bullet point or responsibility item: "${bulletPoint}"

    Please rewrite this bullet point to make it stellar, professional, and ATS-friendly. Emphasise concrete outcomes, use strong power-verbs (e.g. 'Led', 'Optimised', 'Engineered', 'Overhauled'), and logically inject hypothetical or realistic quantifiable metrics (e.g., "by 25%", "saving 12 hours weekly", "facilitating a $100k budget surplus") to demonstrate real-world impact. Write exactly one perfect, improved bullet point line without surrounding quotation marks.
  `;

  try {
    const improved = await getGeminiResponse(systemInstruction, prompt);
    res.json({ success: true, improvedBullet: improved.trim() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Skills Recommendations
app.post("/api/recommend-skills", async (req, res) => {
  const { targetRole, currentSkills } = req.body;

  const systemInstruction =
    "You are a talent acquisition strategist. Identify key hard and soft skills that recruiters look for in the given role. You must provide your output as a clean, compliant JSON array of strings.";

  const prompt = `
    Target Role: ${targetRole}
    Existing registered skills: ${Array.isArray(currentSkills) ? currentSkills.join(", ") : currentSkills || "None yet"}

    Find 8-12 highly relevant hard/technical and soft skills specifically tailored for this target role that are NOT already listed in the existing skills. Output ONLY a valid JSON array of strings. Do not wrap in markdown codeblocks. Example: ["React", "Typescript", "Strategic Planning"].
  `;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.STRING,
    },
    description: "List of recommended skill terms.",
  };

  try {
    const resultJson = await getGeminiResponse(systemInstruction, prompt, true, responseSchema);
    const recommendedSkills = JSON.parse(resultJson);
    res.json({ success: true, recommendedSkills });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Optimize Resume (Full Audit & Scoring)
app.post("/api/optimize-resume", async (req, res) => {
  const { resumeData } = req.body;

  const systemInstruction =
    "You are an ATS parser and professional CV grader. Analyse the resume content deeply. Grade the alignment, detect weak wording, improve grammar, increase ATS compatibility, add measurable achievements, remove repetition, and recommend strategic improvements. Output strictly as JSON.";

  const prompt = `
    Analyze the following complete resume structure:
    ${JSON.stringify(resumeData, null, 2)}

    Grade this resume across four key areas (scores from 0-100):
    1. Base Resume Score (Overall completeness and formatting)
    2. ATS Score (Filtering compliance and key placement)
    3. Grammar Score (Tone, passive language, vocabulary)
    4. Impact Score (Action words, quantifiable metrics, and authority)

    Provide actionable recommendations in 4 distinct categories:
    - weakWordingSuggestions
    - grammarSuggestions
    - atsSuggestions
    - keyWordSuggestions

    You must output a single valid JSON object containing exactly these fields:
    {
      "resumeScore": number,
      "atsScore": number,
      "grammarScore": number,
      "impactScore": number,
      "weakWordingSuggestions": string[],
      "grammarSuggestions": string[],
      "atsSuggestions": string[],
      "keyWordSuggestions": string[]
    }
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      resumeScore: { type: Type.INTEGER },
      atsScore: { type: Type.INTEGER },
      grammarScore: { type: Type.INTEGER },
      impactScore: { type: Type.INTEGER },
      weakWordingSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      grammarSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      atsSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      keyWordSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: [
      "resumeScore",
      "atsScore",
      "grammarScore",
      "impactScore",
      "weakWordingSuggestions",
      "grammarSuggestions",
      "atsSuggestions",
      "keyWordSuggestions",
    ],
  };

  try {
    const resultJson = await getGeminiResponse(systemInstruction, prompt, true, responseSchema);
    const analysis = JSON.parse(resultJson);
    res.json({ success: true, analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Job Description Matching
app.post("/api/match-job", async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  const systemInstruction =
    "You are a recruitment screening system. Compare the provided CV info against the pasted Job Description. Identify matches, extract essential keywords, and evaluate overall compatibility, returning the results strictly in JSON format.";

  const prompt = `
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Target Job Description:
    ${jobDescription}

    Evaluate the fit. You must compute:
    1. matchPercentage (0 - 100)
    2. extractedKeywords (top keywords extracted from the JD)
    3. missingSkills (skills in the JD but not found or weak in the resume)
    4. suggestedAdditions (specific sentences/bullet insertions or shifts to make the resume match perfectly)
    5. strengthAnalysis (a beautiful summary of why the user is a strong or weak candidate)

    Output strictly a JSON object conforming exactly to this structure:
    {
      "matchPercentage": number,
      "extractedKeywords": string[],
      "missingSkills": string[],
      "suggestedAdditions": string[],
      "strengthAnalysis": string
    }
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      matchPercentage: { type: Type.INTEGER },
      extractedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggestedAdditions: { type: Type.ARRAY, items: { type: Type.STRING } },
      strengthAnalysis: { type: Type.STRING },
    },
    required: ["matchPercentage", "extractedKeywords", "missingSkills", "suggestedAdditions", "strengthAnalysis"],
  };

  try {
    const resultJson = await getGeminiResponse(systemInstruction, prompt, true, responseSchema);
    const matchResult = JSON.parse(resultJson);
    res.json({ success: true, matchResult });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Cover Letter Generator
app.post("/api/generate-cover-letter", async (req, res) => {
  const { resumeData, companyName, hiringManager, jobDescription, tone } = req.body;

  const systemInstruction =
    "You are a master copywriter specialized in elegant corporate applications. Generate a personalized, professional cover letter tailored to the provided resume information and job description. Emphasize relevant qualifications and maintain a confident but natural tone.";

  const prompt = `
    User Resume context:
    Name: ${resumeData?.personalInfo?.name || "Professional Applicant"}
    Role Title: ${resumeData?.personalInfo?.title || "Applicant"}
    Email: ${resumeData?.personalInfo?.email || "N/A"}
    Phone: ${resumeData?.personalInfo?.phone || "N/A"}
    Summary: ${resumeData?.summary || "N/A"}
    Experience highlights: ${JSON.stringify(resumeData?.experience || [])}
    Skills: ${resumeData?.skills?.join(", ") || "N/A"}

    Application Target Context:
    Company Name: ${companyName || "Target Company"}
    Hiring Manager Name: ${hiringManager || "Hiring Team"}
    Target Job Description: ${jobDescription || "N/A"}
    Tone Selected: ${tone || "Professional"} (could be Professional, Friendly, or Confident)

    Please draft a stunning, complete one-page cover letter consisting of:
    - Formal Header Block (Simulated placeholders for sender and recipient details)
    - Date of application
    - Salutation
    - Introduction (Declaring application for the role and immediate value hook)
    - Core Interest (Direct response to Company Name, showing brand familiarity)
    - Executive Relevance & Achievements (Aligning key experience and skills with the job description)
    - Forward-looking Closing paragraph (A clean call to action for an interview and gratitude)
    - Sign-off with the user's name.

    Maintain an exceptionally high standard of prose appropriate for the selected tone (${tone}). Keep paragraphs structured and neat.
  `;

  try {
    const coverLetter = await getGeminiResponse(systemInstruction, prompt);
    res.json({ success: true, coverLetter: coverLetter.trim() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode serving compiled static assets from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CVForge AI Server] Operating full-stack on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical Server Boot Failure:", err);
});
