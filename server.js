import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import OpenAI from "openai";
dotenv.config();

const app = express();
app.use(express.static("public"));

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});
const TM_BASE = "https://api.tmsandbox.co.nz/v1";
const TM_KEY = process.env.TRADEME_KEY, TM_SECRET = process.env.TRADEME_SECRET;
const auth = () => "OAuth oauth_consumer_key=" + TM_KEY + ", oauth_signature_method=PLAINTEXT, oauth_signature=" + TM_SECRET + "&";

function safeJSON(str) {
  const match = str.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : {};
}

app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  const llm = await openai.chat.completions.create({
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: `Respond ONLY with JSON in this exact shape and no text before or after: { "mode":"residential","place":string,"property_type":[string],"price_max":number,"bedrooms_min":number } for "${q}"` }]
  });
  
  const p = safeJSON(llm.choices[0].message.content || "");
  
  const r = await fetch(`${TM_BASE}/Search/Property/Residential.json?rows=20&property_type=${p.property_type?.[0]||""}&price_max=${p.price_max||""}&bedrooms_min=${p.bedrooms_min||""}`, 
    { headers: { Authorization: auth() } });
  
  res.json(await r.json());
});

app.listen(3000, () => console.log("http://localhost:3000"));
