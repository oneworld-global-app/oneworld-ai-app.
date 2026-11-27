export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, "Content-Type": "application/json" }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ status: "ok", app: "OneWorld" });
    }

    if (request.method !== "POST" || url.pathname !== "/api/chat") {
      return json({ error: "Not found" }, 404);
    }

    try {
      const body = await request.json();
      const message = String(body.message || "").trim();

      if (!message) return json({ error: "Pesan masih kosong." }, 400);
      if (!env.GEMINI_API_KEY) {
        return json({ error: "API key belum terpasang." }, 500);
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }]
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
  return json({
    error: "Gemini API Error",
    details: result
  }, 502);
}

      const reply = result.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "").join("");

      return json({ reply: reply || "Belum ada jawaban dari AI." });
    } catch (error) {
      return json({ error: "Terjadi kesalahan pada server." }, 500);
    }
  }
};
