
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function testGemini() {
    console.log("Testing Gemini API...");
    console.log("API Key present:", !!API_KEY);

    if (!API_KEY) {
        console.error("❌ API Key is missing!");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, this is a test." }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ API Error:", JSON.stringify(data, null, 2));
        } else {
            console.log("✅ Success! Response:", data.candidates[0].content.parts[0].text);
        }

    } catch (error) {
        console.error("❌ Network/Script Error:", error);
    }
}

testGemini();
