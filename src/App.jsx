import { useState, useCallback } from 'react'
import { generateExcuse } from './api/groq'
import './App.css'

const FOR_OPTIONS = ['Professor', 'Boss', 'Girlfriend', 'Friend']
const SEVERITY_OPTIONS = [
  { value: 'Mild', label: 'Mild', emoji: '😅' },
  { value: 'Serious', label: 'Serious', emoji: '😰' },
  { value: 'Legendary', label: 'Legendary', emoji: '🔥' },
]

export default function App() {
  const [forWho, setForWho] = useState('Professor')
  const [severity, setSeverity] = useState('Mild')
  const [excuse, setExcuse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(excuse).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [excuse])

  async function handleGenerate() {
    setError('')
    setExcuse('')
    setLoading(true)
    try {
      const text = await generateExcuse(forWho, severity)
      setExcuse(text)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <span className="logo">🪄</span>
        <h1>AI Excuse Generator</h1>
        <p className="tagline">Dramatic excuses for students. Use responsibly.</p>
      </header>

      <div className="controls">
        <div className="field">
          <label>For</label>
          <div className="options">
            {FOR_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`chip ${forWho === opt ? 'active' : ''}`}
                onClick={() => setForWho(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Severity</label>
          <div className="options">
            {SEVERITY_OPTIONS.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                className={`chip severity severity-${value.toLowerCase()} ${severity === value ? 'active' : ''}`}
                onClick={() => setSeverity(value)}
              >
                <span className="chip-emoji">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Generating…
            </>
          ) : (
            <>Generate excuse</>
          )}
        </button>
      </div>

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {excuse && (
        <div className="excuse-card">
          <div className="excuse-card-header">
            <div className="excuse-label">Your excuse</div>
            <button
              type="button"
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <p className="excuse-text">"{excuse}"</p>
        </div>
      )}
    </div>
  )
}
