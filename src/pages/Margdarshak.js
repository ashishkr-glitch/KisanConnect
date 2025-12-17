import React, { useState, useEffect, useRef } from "react";
import useUserProfile from "../hooks/useUserProfile";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./Margdarshak.css";

// Simple chat UI for Margdarshak (Gemini-powered). Configure API via environment variables:
// REACT_APP_GEMINI_API_URL and REACT_APP_GEMINI_API_KEY

function Margdarshak() {
  const [messages, setMessages] = useState([
    { id: 0, from: "ai", text: "Namaste! Main Margdarshak hoon. Aap kaise madad chahte hain?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const STORAGE_KEY = "margdarshak_messages_v1";
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setLoading(true);
    try {
      // Build a Gemini-compatible request body (Google Generative Language API style)
      const payload = {
        contents: [
          {
            parts: [
              {
                text: input
              }
            ]
          }
        ]
      };

      // Use backend proxy for secure API communication
      const proxyUrl = `${API_URL}/api/ai/generate`;
      const headers = { "Content-Type": "application/json" };

      const resp = await axios.post(proxyUrl, payload, { headers });

      // Try various response shapes. Google GL returns: { candidates: [ { content: { parts: [ { text } ] } } ] }
      const aiTextRaw =
        resp.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        resp.data?.candidates?.[0]?.content?.[0]?.text ||
        resp.data?.outputs?.[0]?.content ||
        resp.data?.text ||
        resp.data?.output ||
        JSON.stringify(resp.data);
      // Use full Markdown rendering + sanitization for rich output
      const rendered = DOMPurify.sanitize(marked.parse(String(aiTextRaw)));
        setMessages((m) => [...m, { id: Date.now() + 2, from: "ai", text: rendered, raw: aiTextRaw, ts: Date.now() }]);
      } catch (err) {
        console.error("[Margdarshak] Error calling Gemini API:", err);
        const extra = err.response ? ` (${err.response.status}: ${JSON.stringify(err.response.data)})` : "";
        setMessages((m) => [...m, { id: Date.now()+3, from: "ai", text: `Error contacting Margdarshak: ${err.message || "unknown"}${extra}`, ts: Date.now() }]);
      } finally {
        setLoading(false);
      }
  };
  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load persisted messages
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch (e) {
      console.warn('[Margdarshak] Could not load persisted messages', e);
    }
  }, []);

  // Persist messages on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('[Margdarshak] Could not persist messages', e);
    }
  }, [messages]);

  // format handled by marked + DOMPurify

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Copy chat handler
  const handleCopyChat = () => {
    const chatText = messages.map(m => `${m.from === 'ai' ? '🤖' : '👤'} [${m.ts ? formatTimestamp(m.ts) : ''}]: ${m.raw || m.text.replace(/<[^>]+>/g, '')}`).join('\n');
    navigator.clipboard.writeText(chatText)
      .then(() => alert('Chat copied to clipboard!'))
      .catch(() => alert('Failed to copy chat.'));
  };

  // Clear chat handler
  const handleClearChat = () => {
    if (window.confirm('Clear all chat messages?')) {
      setMessages([
        { id: 0, from: "ai", text: "Namaste! Main Margdarshak hoon. Aap kaise madad chahte hain?" }
      ]);
    }
  };

  // Timestamp formatting
  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const { profile } = useUserProfile();
  const greetName = profile?.fullName || profile?.name || profile?.displayName || localStorage.getItem("full_name") || "User";

  return (
    <div className="margdarshak-page">
      <div className="greeting-message">
        <span className="greeting-label">Welcome,</span>
        <span className="greeting-name"> {greetName}!</span>
      </div>
      <div className="margdarshak-header">
        <h2>Margdarshak AI</h2>
        <div className="header-actions">
          <button onClick={handleCopyChat} className="copy-chat">Copy Chat</button>
          <button onClick={handleClearChat} className="clear-chat">Clear Chat</button>
          <button onClick={() => navigate(-1)} className="back">Back</button>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.from}`}>
              <div className="avatar">{m.from === 'ai' ? '🤖' : '👤'}</div>
              <div>
                <div className="bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                <div className="msg-meta">{m.ts ? formatTimestamp(m.ts) : ''}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="composer">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Type your question to Margdarshak..." />
          <button onClick={sendMessage} disabled={loading}>{loading ? "Thinking..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
}

export default Margdarshak;
