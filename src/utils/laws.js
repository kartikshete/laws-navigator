/* eslint-disable no-unused-vars */
/**
 * Laws Navigator AI Logic
 * Handles legal analysis using a dual-engine fallback strategy.
 * Primary: Gemini 1.5 Flash
 * Secondary: DeepSeek Chat
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export const analyzeCase = async (text, language = 'english') => {
    // Mapping language to human-readable text for the prompt
    const langMap = {
        english: 'English',
        hindi: 'Hindi (हिंदी)',
        marathi: 'Marathi (मराठी)',
        hinglish: 'Hinglish'
    };
    const langText = langMap[language] || 'English';

    const prompt = `
        Role: Expert Indian Legal AI Assistant.
        Task: Analyze the provided case text and identify relevant Indian Laws (IPC, BNS, CrPC, IT Act).
        CASE TEXT: "${text}"
        
        Output Language: ${langText}
        
        Strict Requirement: Output valid JSON ONLY. No markdown, no extra text.
        Structure:
        {
            "relevantLaws": [
                {
                    "law": "Legal Act (e.g. BNS/IPC)",
                    "section": "Section Number",
                    "title": "Short Title of Section",
                    "explanation": "Brief reason why it applies",
                    "punishment": "Expected Penalty"
                }
            ],
            "summary": "Concise 2-sentence summary of the legal situation in ${langText}.",
            "disclaimer": "Legal disclaimer in ${langText} stating this is AI-generated and not professional legal advice."
        }
    `;

    // Try Gemini first (Best performance/speed balance)
    try {
        console.log("[AI Engine] Initiating analysis with Gemini 1.5 Flash...");
        return await callGemini(prompt);
    } catch (geminiError) {
        console.warn("[AI Engine] Gemini failed, attempting DeepSeek fallback...", geminiError.message);

        // Fallback to DeepSeek if Gemini is down or throttled
        try {
            return await callDeepSeek(prompt);
        } catch (deepseekError) {
            console.error("[AI Engine] Critical failure: Both engines offline.", deepseekError);

            // Providing a user-friendly error state instead of crashing
            let friendlierMessage = "I'm having trouble connecting to my legal brain right now.";
            if (!GEMINI_API_KEY) {
                friendlierMessage = "Missing API configuration. Please set VITE_GEMINI_API_KEY in your environment.";
            }

            return {
                relevantLaws: [],
                summary: friendlierMessage,
                disclaimer: "System Diagnostic Error",
                error: true
            };
        }
    }
};

const callGemini = async (prompt) => {
    if (!GEMINI_API_KEY) {
        throw new Error("API Key missing");
    }

    // Using gemini-1.5-flash as it's the stable state-of-the-art for this task
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Gemini API Error: ${err.error?.message || response.status}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from Gemini");
    }

    const rawText = data.candidates[0].content.parts[0].text;
    // Helper to extract clean JSON from potential markdown wrappers
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
};

const callDeepSeek = async (prompt) => {
    if (!DEEPSEEK_API_KEY) throw new Error("DeepSeek API Key missing");

    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are an Indian Legal assistant. Always respond with valid JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.1 // Low temperature for consistent JSON
        })
    });

    if (!response.ok) throw new Error(`DeepSeek API Error: ${response.status}`);

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
};

export const generateFIRDraft = (inputText, analysisResult) => {
    const date = new Date().toLocaleDateString('en-IN');
    const sections = analysisResult.relevantLaws?.length > 0 
        ? analysisResult.relevantLaws.map(l => `${l.section} of ${l.law}`).join(', ') 
        : '[Sections to be added after legal review]';

    // Standardized FIR Template for India
    return `
=== प्रथम सूचना रिपोर्ट (F.I.R) / FIRST INFORMATION REPORT ===

To,
Station House Officer (SHO),
[Police Station Name],
[District/City]

Subject: Request to register FIR regarding the incident described below.

Respected Sir/Madam,

1. Informant/Complainant Details:
   Name: [Your Full Name]
   Address: [Your Full Address]
   Contact: [Your Mobile Number]

2. Incident Details:
   Date & Time: [Incident Date/Time]
   Location: [Incident Location]
   
3. Statement of Fact:
   ${inputText}

4. Legal Analysis (AI Suggested):
   Based on the initial assessment, the following sections may apply:
   ${sections}

Prayer:
It is requested that an FIR be registered under the relevant sections of the law and necessary investigation be initiated at the earliest.

Sincerely,

(Signature)
Name: [Your Name]
Date: ${date}
    `.trim();
};
