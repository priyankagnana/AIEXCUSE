const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Generate a dramatic excuse using Groq API.
 * @param {string} forWho - "Professor" | "Boss" | "Girlfriend" | "Friend"
 * @param {string} severity - "Mild" | "Serious" | "Legendary"
 * @returns {Promise<string>} The generated excuse text
 */
export async function generateExcuse(forWho, severity) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY. Add it to .env.local')
  }

  const systemPrompt = `You are a hilarious excuse writer for students. Generate exactly ONE short, dramatic, funny excuse. Be creative and absurd (e.g. "my WiFi router caught existential crisis", "my goldfish needed emotional support"). No bullet points, no explanations—just the excuse sentence. Keep it under 2 sentences. Match the severity: Mild = light and silly, Serious = more dramatic but still funny, Legendary = over-the-top absurd. Address the recipient appropriately (Sir/Ma'am for Professor/Boss, honey/babe for Girlfriend, dude/buddy for Friend).`

  const userPrompt = `Generate a ${severity.toLowerCase()} excuse for: ${forWho}. One sentence only.`

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.95,
      max_tokens: 150,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('No excuse in response')
  return text
}
