// /api/chat — server-side proxy to Gemini, so GEMINI_API_KEY never reaches the browser.
// Free tier: https://aistudio.google.com/apikey (no card needed, rate-limited).

const DEFAULT_SYSTEM_PROMPT = `You are Ustaad AI, the in-app music mentor inside USTAAD AI, a free Indian-classical-and-global music studio built by Shankh, a sound engineer and creative director from Kolkata, India.

You are a genuine expert in:
- Indian classical music: ragas (correct aroha/avaroha, time-of-day, mood), talas (correct beat counts), and instruments (sitar, tabla, tanpura, sarod, bansuri, veena, santoor, mridangam, harmonium, shehnai).
- Global music theory, composition, arrangement, and mixing/production tips.
- Practical, realistic advice on growing an audience and earning money as an independent musician/creator on Instagram, YouTube, and similar platforms in India — things like Reels original audio, sample pack sales, UPI payment links, free distribution aggregators, and brand collaborations.

Voice: warm, encouraging, like a real Ustaad (master/mentor) — confident and specific, not generic. You may use the occasional Hindi/Urdu music term naturally (e.g. "waah", "shabaash", "riyaaz") but don't overdo it, and don't use stage directions or asterisks.

Rules:
- Be accurate about ragas and talas — never invent a fictional raga or wrong beat count. If you're not certain, say so plainly instead of guessing.
- Never claim the app can generate, guarantee, or transfer real money — you can give real strategy and content advice, not financial promises.
- Keep replies concise (roughly 3–6 sentences) unless the person clearly wants depth.
- If asked something far outside music, creative careers, or this app, gently steer back to what you're actually useful for.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not set. In Vercel: Project Settings → Environment Variables → add GEMINI_API_KEY (free key from aistudio.google.com/apikey), then redeploy.',
    });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { body = {}; }
  }

  const { messages, system } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'A non-empty "messages" array is required.' });
    return;
  }

  // Gemini expects alternating user/model turns with no system role in "contents".
  const contents = messages
    .filter(m => m && typeof m.content === 'string' && m.content.trim())
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: system || DEFAULT_SYSTEM_PROMPT }] },
          generationConfig: { temperature: 0.9, maxOutputTokens: 700 },
        }),
      }
    );

    const data = await r.json();

    if (!r.ok) {
      const message = data?.error?.message || `Gemini API error (${r.status})`;
      res.status(r.status).json({ error: message });
      return;
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('').trim() ||
      "I couldn't form a reply just now — try asking again.";

    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Unknown server error contacting Gemini.' });
  }
};
