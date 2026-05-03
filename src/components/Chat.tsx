/* ============================================
   AI Chat Guide — Contextual Assistant
   ============================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import DOMPurify from 'dompurify';
import { useApp } from '../context';
import type { ChatMessage } from '../types';
import { CHAT_RESPONSES } from '../data';
import './Chat.css';

const QUICK_QUESTIONS = [
  { label: 'How do I register?', key: 'register' },
  { label: 'Where is my polling place?', key: 'find-booth' },
  { label: 'What ID do I need?', key: 'id-requirements' },
  { label: 'Can I vote by mail?', key: 'mail-voting' },
  { label: 'When is Election Day?', key: 'election-day' },
  { label: 'What\'s on my ballot?', key: 'ballot-info' },
];

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function Chat() {
  const { state, addChatMessage } = useApp();
  const { user, chatMessages } = state;
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const hasGreeted = useRef(false);

  // Send greeting on first load
  useEffect(() => {
    if (chatMessages.length === 0 && !hasGreeted.current) {
      hasGreeted.current = true;
      const greetings = CHAT_RESPONSES['greeting'];
      greetings.forEach((msg, i) => {
        setTimeout(() => {
          addChatMessage({
            id: generateId(),
            role: 'assistant',
            content: msg,
            timestamp: Date.now(),
          });
        }, i * 500);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAIResponse = useCallback((userMsg: string): string[] => {
    const msg = userMsg.toLowerCase();
    const status = user.voterStatus;

    // Match based on user context + message
    if (msg.includes('register') || msg.includes('registration')) {
      if (status === 'not-registered') {
        return CHAT_RESPONSES['not-registered-register'] || [];
      }
      return [
        "You're already registered! 🎉",
        "If you need to update your registration (name change, address change), visit your state's election website.",
        "**Next Step →** Would you like to verify your current registration details?",
      ];
    }

    if (msg.includes('booth') || msg.includes('polling') || msg.includes('where') || msg.includes('location')) {
      return CHAT_RESPONSES['registered-find-booth'] || [
        "To find your polling place, visit your state's election website or check vote.org/polling-place-locator.",
        "Enter your registered address to see your assigned location, hours, and accessibility information.",
      ];
    }

    if (msg.includes('id') || msg.includes('identification') || msg.includes('document')) {
      return [
        "ID requirements vary by state. Here's a general overview:",
        "**Strict Photo ID states:** Require government-issued photo ID",
        "**Non-strict Photo ID states:** Accept various forms of ID",
        "**No Photo ID required:** Some states have no photo ID requirement",
        "**Pro tip:** Check your state's specific requirements at vote.org/voter-id-laws",
        "**Next Step →** Look up your state's exact requirements before Election Day.",
      ];
    }

    if (msg.includes('mail') || msg.includes('absentee') || msg.includes('postal')) {
      return [
        "Mail-in / absentee voting options vary by state:",
        "• **No excuse needed:** Many states let any registered voter vote by mail",
        "• **Excuse required:** Some states require a valid reason for absentee voting",
        "• **All mail:** Some states (like Oregon) conduct all elections by mail",
        "**Key steps:** Request your ballot before the deadline → Fill it out carefully → Return it by the due date",
        "**Next Step →** Check your state's specific mail voting rules and request deadlines.",
      ];
    }

    if (msg.includes('election day') || msg.includes('when') || msg.includes('date')) {
      return [
        "📅 **Key Election Dates:**",
        "• Voter Registration Deadline: October 15, 2026",
        "• Early Voting: Starts October 20, 2026",
        "• Election Day: **November 3, 2026**",
        "Polls typically open between 6-7 AM and close between 7-8 PM local time.",
        "**Next Step →** Mark these dates on your calendar and set reminders!",
      ];
    }

    if (msg.includes('ballot') || msg.includes('candidate') || msg.includes('measure')) {
      return [
        "To research your ballot:",
        "**Step 1:** Find your sample ballot at your state's election website",
        "**Step 2:** Look up candidate platforms from official sources",
        "**Step 3:** Read ballot measure summaries (look for official voter guides)",
        "**Step 4:** Make notes — you can bring them to the polling place!",
        "⚠️ Remember: We provide process guidance only, never candidate recommendations.",
        "**Next Step →** Visit your state's sample ballot lookup tool.",
      ];
    }

    if (msg.includes('learn') || msg.includes('how') || msg.includes('process') || msg.includes('help')) {
      const key = `${status}-learn`;
      if (CHAT_RESPONSES[key]) return CHAT_RESPONSES[key];
      return CHAT_RESPONSES[`${status}-default`] || [
        "I'd be happy to help! Here are some things I can assist with:",
        "• 📝 Voter registration guidance",
        "• 📍 Finding your polling place",
        "• 🪪 ID requirements",
        "• 📮 Mail-in voting information",
        "• 📋 Ballot research tips",
        "• ⏰ Important deadlines",
        "What would you like to know more about?",
      ];
    }

    // Default response
    return [
      "Thanks for your question! Here are some things I can help with:",
      "• **\"How do I register?\"** — Registration guidance",
      "• **\"Where is my polling place?\"** — Find your booth",
      "• **\"What ID do I need?\"** — ID requirements",
      "• **\"Can I vote by mail?\"** — Absentee/mail voting",
      "• **\"When is Election Day?\"** — Key dates",
      "• **\"What's on my ballot?\"** — Ballot research",
      "Try asking one of these questions, or use the quick buttons below! 👇",
    ];
  }, [user.voterStatus]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    addChatMessage({
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    });

    setInputValue('');
    setIsTyping(true);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('No API key found');
      }

      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const prompt = `You are a helpful, non-partisan AI guide for an Indian Election Companion application.
      
Current User Context:
- State: ${user.state || 'India'}
- Voter Registration Status: ${user.voterStatus.replace('-', ' ')}
- Goal: Help them understand the Indian electoral process (Form 6, EVMs, NVSP, Voter ID, etc.).

Important rules:
1. Be extremely concise. Keep paragraphs very short and readable. Use bullet points when listing.
2. NEVER endorse or suggest any political candidate, party, or ideology. Remain strictly neutral.
3. Only provide verified Indian process information. Direct users to voters.eci.gov.in when necessary.

User Question: ${content}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              text: { 
                type: "STRING", 
                description: "The AI's response to the user's question, formatted in markdown."
              }
            },
            required: ["text"]
          }
        }
      });

      let aiText = "I'm having trouble retrieving information right now.";
      try {
        if (response.text) {
          const parsed = JSON.parse(response.text);
          aiText = parsed.text || aiText;
        }
      } catch (e) {
        console.warn("Failed to parse AI JSON response", e);
        aiText = response.text || aiText;
      }

      addChatMessage({
        id: generateId(),
        role: 'assistant',
        content: aiText,
        timestamp: Date.now(),
      });
      setIsTyping(false);

    } catch (e) {
      console.warn("Falling back to static response:", e);
      // Fallback to static responses if Gemini fails
      const responses = getAIResponse(content);

      // Simulate typing delay for static
      responses.forEach((response, i) => {
        setTimeout(() => {
          addChatMessage({
            id: generateId(),
            role: 'assistant',
            content: response,
            timestamp: Date.now(),
          });
          if (i === responses.length - 1) {
            setIsTyping(false);
          }
        }, (i + 1) * 600);
      });
    }

    // Attempt to scroll again after send
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 100);
  }, [addChatMessage, getAIResponse, user.state, user.voterStatus, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (key: string, label: string) => {
    sendMessage(label);
    void key; // referenced for future use
  };

  return (
    <main className="chat" role="main">
      <div className="chat__container">
        <header className="chat__header">
          <div className="chat__header-info">
            <div className="chat__avatar" aria-hidden="true">
              <span className="chat__avatar-emoji">🤖</span>
              <span className="chat__avatar-status" />
            </div>
            <div>
              <h1 className="chat__title">Election Guide AI</h1>
              <p className="chat__status-text">
                {isTyping ? 'Typing...' : 'Online • Ready to help'}
              </p>
            </div>
          </div>
          <div className="chat__user-context">
            <span className="chat__context-badge">{user.state || '—'}</span>
            <span className="chat__context-badge">{user.voterStatus.replace('-', ' ')}</span>
          </div>
        </header>

        {/* Messages */}
        <div className="chat__messages" role="log" aria-live="polite" aria-label="Chat messages">
          {chatMessages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={`chat__message ${msg.role === 'user' ? 'chat__message--user' : 'chat__message--assistant'}`}
            >
              {msg.role === 'assistant' && (
                <span className="chat__message-avatar" aria-hidden="true">🤖</span>
              )}
              <div className="chat__message-bubble">
                <div 
                  className="chat__message-text"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/•/g, '<span class="chat__bullet">•</span>'))
                  }}
                />
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat__message chat__message--assistant">
              <span className="chat__message-avatar" aria-hidden="true">🤖</span>
              <div className="chat__message-bubble chat__typing">
                <span className="chat__typing-dot" />
                <span className="chat__typing-dot" />
                <span className="chat__typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="chat__quick" aria-label="Quick questions">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q.key}
              className="chat__quick-btn"
              onClick={() => handleQuickQuestion(q.key, q.label)}
              id={`quick-q-${q.key}`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form className="chat__input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chat__input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask about the voting process..."
            maxLength={500}
            aria-label="Type your question"
            id="chat-input"
            autoComplete="off"
          />
          <button
            type="submit"
            className="chat__send-btn"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
            id="chat-send-btn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
}
