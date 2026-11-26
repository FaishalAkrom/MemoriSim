import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Sparkles, Trash2, X } from 'lucide-react'
import { askGeminiStream } from '../lib/gemini.js'

const INITIAL_MESSAGE = {
  role: 'model',
  text: 'Halo! Saya Asisten AI MemoriSim. Ada yang ingin ditanyakan seputar algoritma FIFO, LRU, Optimal, atau cara membaca simulasi memori?'
}

const QUICK_PROMPTS = [
  'Apa bedanya FIFO dan LRU?',
  'Jelaskan arti Page Fault & Hit',
  'Kenapa Optimal terbaik?',
  'Apa itu Belady’s Anomaly?'
]

/**
 * Merender markdown ringan (**tebal**, *miring*, `kode`) agar tampilan chat rapi.
 */
function renderFormattedText(text) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return <strong key={idx}>{token.slice(2, -2)}</strong>
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return <em key={idx}>{token.slice(1, -1)}</em>
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={idx}
          style={{
            background: 'rgba(59, 130, 246, 0.14)',
            padding: '1px 5px',
            borderRadius: '5px',
            fontSize: '0.84em'
          }}
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    return token
  })
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, open])

  const sendMessage = async (customText) => {
    const text = (customText ?? input).trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', text }]
    setMessages(nextMessages)
    if (!customText) setInput('')
    setLoading(true)

    let hasAddedBotBubble = false

    try {
      const historyForApi = nextMessages.slice(1)
      await askGeminiStream(historyForApi, (partialText) => {
        if (!hasAddedBotBubble) {
          hasAddedBotBubble = true
          setMessages((prev) => [...prev, { role: 'model', text: partialText }])
        } else {
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'model', text: partialText }
            return updated
          })
        }
      })
    } catch (err) {
      const errorText =
        err.message === 'MISSING_API_KEY'
          ? 'API Key Gemini belum dipasang. Tambahkan VITE_GEMINI_API_KEY di file memory-manager/.env lalu restart server.'
          : `Maaf, terjadi kendala saat menghubungi Gemini API: ${err.message}`
      setMessages((prev) => {
        if (hasAddedBotBubble) {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'model', text: errorText, isError: true }
          return updated
        }
        return [...prev, { role: 'model', text: errorText, isError: true }]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE])
  }

  const showTypingDots = loading && messages[messages.length - 1]?.role === 'user'

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-window" role="dialog" aria-label="Asisten AI MemoriSim">
          <div className="chatbot-header">
            <div className="chatbot-title-wrap">
              <div className="chatbot-avatar">
                <Bot size={18} />
              </div>
              <div>
                <strong>Asisten MemoriSim</strong>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-icon-btn"
                onClick={clearChat}
                title="Bersihkan percakapan"
                aria-label="Bersihkan percakapan"
              >
                <Trash2 size={15} />
              </button>
              <button
                type="button"
                className="chatbot-icon-btn"
                onClick={() => setOpen(false)}
                title="Tutup chat"
                aria-label="Tutup chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chatbot-msg ${m.role === 'user' ? 'user' : 'bot'}${m.isError ? ' error' : ''}`}
              >
                {m.role === 'model' && (
                  <span className="chatbot-msg-badge" aria-hidden="true">
                    <Sparkles size={12} />
                  </span>
                )}
                <div className="chatbot-bubble">
                  {m.role === 'model' ? renderFormattedText(m.text) : m.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="chatbot-chips">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="chatbot-chip"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {showTypingDots && (
              <div className="chatbot-msg bot">
                <span className="chatbot-msg-badge" aria-hidden="true">
                  <Sparkles size={12} />
                </span>
                <div className="chatbot-bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya tentang FIFO, LRU, Optimal..."
              disabled={loading}
            />
            <button
              type="button"
              className="chatbot-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Kirim pesan"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`chatbot-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        title={open ? 'Tutup Asisten AI' : 'Tanya Asisten AI MemoriSim'}
        aria-label={open ? 'Tutup Asisten AI' : 'Buka Asisten AI'}
      >
        <span className="chatbot-fab-icon">
          {open ? <X size={22} /> : <Bot size={22} />}
        </span>
        {!open && (
          <span className="chatbot-fab-spark" aria-hidden="true">
            <Sparkles size={12} />
          </span>
        )}
      </button>
    </div>
  )
}
