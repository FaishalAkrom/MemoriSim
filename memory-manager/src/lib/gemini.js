const SYSTEM_INSTRUCTION = `Kamu adalah Asisten AI MemoriSim, asisten belajar interaktif untuk aplikasi "Memory Manager" (proyek mata kuliah Sistem Operasi Kelompok 8).
Tugasmu adalah membantu pengguna memahami:
1. Manajemen memori komputer dan algoritma Page Replacement:
   - FIFO (First In First Out): mengganti page yang paling awal masuk ke memori (dapat mengalami Belady's Anomaly).
   - LRU (Least Recently Used): mengganti page yang paling lama tidak digunakan.
   - Optimal: mengganti page yang paling lama tidak akan digunakan di masa depan (acuan teoritis terbaik).
2. Istilah penting: RAM, Frame/Slot, Page, Page Fault, Hit, dan Page Replacement.
3. Fitur di aplikasi MemoriSim:
   - Mode Teknis (RAM slot & Tabel Matriks Jejak Alokasi Memori beserta ekspor CSV/PNG).
   - Mode Analogi (Meja Belajar / Study Desk: meja sebagai RAM dan rak sebagai storage).
   - Halaman Perbandingan algoritma dengan grafik Recharts.

Gunakan bahasa Indonesia yang ramah, jelas, lengkap, dan terstruktur. Selalu selesaikan penjelasan hingga tuntas dengan contoh singkat bila perlu.`

const MODELS = ['gemini-3.8-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash-lite']
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function streamModel(model, apiKey, contents, onChunk, useThinkingBudget = true) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`

  const generationConfig = {
    temperature: 0.7,
    maxOutputTokens: 2048
  }
  if (useThinkingBudget) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents,
      generationConfig
    })
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const errMsg = errData?.error?.message || `HTTP ${response.status}`
    const err = new Error(errMsg)
    err.status = response.status
    throw err
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const jsonStr = trimmed.slice(5).trim()
      if (!jsonStr || jsonStr === '[DONE]') continue

      try {
        const parsed = JSON.parse(jsonStr)
        const parts = parsed?.candidates?.[0]?.content?.parts || []
        for (const part of parts) {
          if (part.text) {
            fullText += part.text
            onChunk(fullText)
          }
        }
      } catch {
        // Abaikan potongan JSON parsial di tengah stream
      }
    }
  }

  if (!fullText) {
    throw new Error('Respons dari Gemini kosong.')
  }
  return fullText
}

/**
 * Mengirim percakapan ke Gemini API secara streaming (real-time) dengan auto-retry & fallback.
 * @param {Array<{role: 'user'|'model', text: string}>} messages
 * @param {(partialText: string) => void} onChunk
 * @returns {Promise<string>}
 */
export async function askGeminiStream(messages, onChunk) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('MISSING_API_KEY')
  }

  const contents = messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }))

  let lastError = null

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await streamModel(model, apiKey, contents, onChunk, true)
      } catch (err) {
        lastError = err
        // Jika model menolak thinkingConfig, coba sekali lagi tanpa thinkingConfig
        if (err.status === 400 && /thinking/i.test(err.message)) {
          try {
            return await streamModel(model, apiKey, contents, onChunk, false)
          } catch (retryErr) {
            lastError = retryErr
          }
        }
        const isTransient =
          err.status === 503 ||
          err.status === 429 ||
          /high demand|overloaded|try again/i.test(err.message)
        if (isTransient && attempt === 0) {
          await sleep(600)
          continue
        }
        break
      }
    }
  }

  if (lastError && (lastError.status === 503 || lastError.status === 429 || /high demand/i.test(lastError.message))) {
    throw new Error('Server AI sedang sangat sibuk saat ini (high demand). Silakan coba kirim ulang beberapa detik lagi.')
  }

  throw lastError || new Error('Gagal menghubungi layanan Gemini AI.')
}
