// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/api/jobs", async (req, res) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for IT fresher job seekers.",
          },
          {
            "role": "user",
            "content": "Return exactly 20 fresher job openings in valid JSON array format only.Each job must be located in Bengaluru and must be for Python & Java Full Stack Developer or AI Developer roles. Each JSON object must include: \"title\", \"company_name\", \"location\", \"url\", and \"company_description\". Ensure a variety of companies including startups, mid-sized companies, and top MNCs. Return ONLY a valid JSON array. No extra text."
          }
          ,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawContent = response?.data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      console.error("❌ Groq API returned no content.");
      return res.status(500).json({ error: "No content returned from Groq API" });
    }

    let jobs;
    try {
      jobs = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error("❌ Failed to parse Groq JSON:", parseErr.message);
      console.error("Returned content:", rawContent);
      return res.status(500).json({ error: "Invalid JSON format from Groq API" });
    }

    res.json({ jobs });
  } catch (err) {
    console.error("❌ Error fetching/parsing from Groq:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error message:", err.message);
    }
    res.status(500).json({ error: "Failed to fetch jobs from Groq API" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
