/**
 * ChatWidget.tsx
 * Simple local chat widget used as an assistant for the portfolio.
 * Responsibilities:
 * - Maintain a small local knowledge base and map queries to canned
 *   responses using `findBestMatch`.
 * - Manage message state and UI for a chat panel (open/close, send,
 *   typing indicator).
 * NOTE: This is a frontend-only mock assistant. Replace the lookup
 * logic with calls to a real backend/LLM when integrating.
 */
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, X, MessageCircle, Minimize2 } from 'lucide-react';
import { hero, contact, skills, projects, experiences, education } from '../data';

// Simple message shape used in component state
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/**
 * `knowledgeBase` - a small in-file map of topic -> response used by
 * `findBestMatch`. Keep it here for offline/demo usage; moving to a
 * JSON or a service is recommended for production.
 */
function buildKnowledgeBase() {
  const kb: Record<string, string> = {};

  kb.skills = skills && skills.length
    ? `Top skills: ${skills.slice(0,8).map((s: any) => `${s.name} (${s.level}%)`).join(', ')}.`
    : 'Skills information is not available.';

  kb.experience = experiences && experiences.length
    ? (experiences as any[]).map(e => `${e.role} at ${e.company} (${e.period})`).join('; ')
    : 'Experience information is not available.';

  kb.projects = projects && projects.length
    ? `Projects: ${(projects as any[]).slice(0,6).map(p => p.title).join('; ')}.`
    : 'Project information is not available.';

  kb.education = education && education.length
    ? (education as any[]).map(ed => `${ed.degree} — ${ed.institution} (${ed.year || ''})`).join('; ')
    : 'Education information is not available.';

  kb.contact = (contact && (contact.email || contact.phone))
    ? `Contact: ${contact.email ? contact.email + (contact.phone ? ' | ' + contact.phone : '') : contact.phone}. Location: ${contact.location || hero.location || 'N/A'}`
    : 'Contact information is not available.';

  kb.location = contact?.location || hero?.location || 'Location not set.';

  kb.technologies = skills && skills.length
    ? (skills as any[]).map(s => s.name).join(', ')
    : 'Technologies not listed.';

  kb.availability = contact?.email ? `Reach out via ${contact.email} for opportunities.` : 'Availability information not available.';

  kb.strengths = skills && skills.length ? `Strengths include ${(skills as any[]).slice(0,4).map(s => s.name).join(', ')}.` : 'Strengths not available.';

  kb.interests = 'Passionate about automation, AI, and building reliable systems.';

  return kb;
}

// knowledge base will be memoized inside the component to avoid re-computation

/**
 * `findBestMatch` - basic keyword matching to select an appropriate
 * response from `knowledgeBase`.
 * - Lower-cases the user query and checks for presence of topic
 *   keywords. Returns a canned response when matched, otherwise a
 *   helpful fallback prompt.
 */
function findBestMatch(query: string, kb: Record<string, string>): string {
  const lowerQuery = query.toLowerCase();
  
  const keywords: Record<string, string[]> = {
    'skills': ['skill', 'technology', 'tech', 'know', 'proficient', 'good at', 'expertise'],
    'experience': ['work', 'job', 'experience', 'company', 'worked', 'career', 'employment'],
    'projects': ['project', 'built', 'created', 'portfolio', 'work', 'developed'],
    'education': ['education', 'degree', 'study', 'university', 'learn', 'course'],
    'contact': ['contact', 'reach', 'email', 'connect', 'get in touch', 'hire'],
    'location': ['location', 'where', 'based', 'live', 'city'],
    'availability': ['available', 'hire', 'hiring', 'looking', 'job'],
    'technologies': ['use', 'stack', 'tools', 'framework', 'library'],
    'strengths': ['strength', 'good', 'best', 'achievement'],
    'interests': ['interest', 'hobby', 'passion', 'like', 'enjoy'],
  };

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some(word => lowerQuery.includes(word))) {
      return kb[topic];
    }
  }

  return "I'd be happy to tell you more! You can ask me about my skills, experience, projects, education, contact information, or availability. What would you like to know?";
}

/**
 * `ChatWidget` - main component responsible for:
 * - Toggling open/closed state for the chat panel (`isOpen`).
 * - Holding `messages` array with `Message` entries for display.
 * - Handling user input and dispatching responses via `findBestMatch`.
 */
export function ChatWidget() {
  // whether the chat panel is open
  const [isOpen, setIsOpen] = useState(false);
  // whether to show the initial transient hint near the chat icon
  const [showHint, setShowHint] = useState(false);
  // whether to render heavier animated ornaments (deferred to reduce lag)
  const [showOrnaments, setShowOrnaments] = useState(false);

  // memoize the knowledge base so it isn't rebuilt on every render/open
  const knowledgeBase = useMemo(() => buildKnowledgeBase(), [hero, contact, skills, projects, experiences, education]);
  // chat message list (bot + user)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
        text: `Hi! 👋 I'm ${hero?.name ?? "Ankush"}'s AI assistant. Ask me anything about skills, experience, projects, or contact details.`,
        sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  // current input box value
  const [inputValue, setInputValue] = useState('');
  // typing indicator shown while the bot response is being generated
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintTimerRef = useRef<number | null>(null);

  // show the hint for 5 seconds on initial mount
  useEffect(() => {
    // show only when widget is closed initially
    setShowHint(true);
    hintTimerRef.current = window.setTimeout(() => setShowHint(false), 5000);
    return () => {
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    };
  }, []);

  // defer heavy animations a short time after opening to avoid blocking
  useEffect(() => {
    let t: number | undefined;
    if (isOpen) {
      t = window.setTimeout(() => setShowOrnaments(true), 250);
    } else {
      setShowOrnaments(false);
    }
    return () => { if (t) window.clearTimeout(t); };
  }, [isOpen]);

  /**
   * `scrollToBottom` - helper that keeps the newest message visible by
   * scrolling the message container to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // keep view scrolled to the latest message when `messages` changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // focus on input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // if the user opens the chat, hide the transient hint immediately
    if (isOpen && showHint) {
      setShowHint(false);
      if (hintTimerRef.current) {
        window.clearTimeout(hintTimerRef.current);
        hintTimerRef.current = null;
      }
    }
  }, [isOpen]);

  /**
   * `handleSend` - assemble a user message, append it to state, then
   * synthesize a bot reply using `findBestMatch`. The bot reply is
   * delayed slightly to simulate thinking and toggles `isTyping`.
   */
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = findBestMatch(inputValue, knowledgeBase);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  /**
   * `handleKeyPress` - keyboard helper to send message on Enter (no Shift)
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[70vh] md:h-[60vh]"
          >
            {/* Glassmorphic container */}
            <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-t border-white/20 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="relative overflow-hidden">
                {/* Gradient background with blur */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-xl" />
                
                {/* Animated gradient orbs (deferred for performance) */}
                {showOrnaments && (
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
                    />
                    <motion.div
                      animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {showOrnaments ? (
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-14 h-14 bg-white/30 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/40 shadow-lg"
                      >
                        <Bot className="w-7 h-7 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center border border-white/40 shadow-lg">
                        <Bot className="w-7 h-7 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white text-xl">Ask About Me</h3>
                      <p className="text-sm text-white/90">AI-powered assistant</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full p-3 transition-colors backdrop-blur-xl border border-white/30"
                    aria-label="Close chat"
                  >
                    <Minimize2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25
                          }}
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                        >
                          <Bot className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`max-w-[70%] px-5 py-3 rounded-3xl backdrop-blur-xl border shadow-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white border-white/30 rounded-br-md'
                            : 'bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white border-white/40 rounded-bl-md'
                        }`}
                      >
                        <p className="text-base whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      </motion.div>

                      {message.sender === 'user' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25
                          }}
                          className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                        >
                          <User className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 items-end"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 px-6 py-4 rounded-3xl rounded-bl-md shadow-lg">
                        <div className="flex gap-2">
                          <motion.span
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2.5 h-2.5 bg-gray-400 rounded-full"
                          />
                          <motion.span
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2.5 h-2.5 bg-gray-400 rounded-full"
                          />
                          <motion.span
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2.5 h-2.5 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="px-6 py-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-t border-white/20">
                <div className="max-w-4xl mx-auto flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-lg text-base"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl"
                    aria-label="Send message"
                  >
                    <Send className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {/* Transient hint bubble (shows on first load for 5s) */}
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 right-6 z-50 max-w-xs"
            role="status"
            aria-live="polite"
          >
            <div className="bg-white/95 text-gray-900 px-4 py-3 rounded-lg shadow-lg border border-gray-200">
              <div className="text-sm">{`Want to know about ${hero?.name ?? 'me'}? Click here.`}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-shadow z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}