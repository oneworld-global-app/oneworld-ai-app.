const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "OneWorld" });
});

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();
  if (!message) {
    return res.status(400).json({ error: "Please enter a message." });
  }

  // AI connection can be added here later using a private API key.
  return res.json({
    reply: "OneWorld is ready for its AI connection. Your message was received: " + message
  });
});

app.listen(PORT, () => {
  console.log(`OneWorld running on port ${PORT}`);
});
