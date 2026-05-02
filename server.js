import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ Use Render's port
const PORT = process.env.PORT || 3000;

// ✅ Allow your GitHub Pages domain (replace with yours later)
app.use(cors({
  origin: "https://vyhar.github.io",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ❗️ NEVER hardcode API keys — use environment variables
const API_KEY = process.env.EASYPOST_API_KEY;

app.post("/track", async (req, res) => {
  try {
    const { tracking_code } = req.body;

    if (!tracking_code) {
      return res.status(400).json({ error: "Tracking code required" });
    }

    const response = await fetch("https://api.easypost.com/v2/trackers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tracking_code,
        carrier: "usps"
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Listen correctly for Render
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
