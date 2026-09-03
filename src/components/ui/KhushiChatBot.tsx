"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ArrowUpRight, Sparkles, User, CheckCircle2 } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  whatsappAction?: boolean;
  actionUrl?: string;
  actionText?: string;
}

const FAQ_RESPONSES: Record<string, { answer: string; actionText?: string; actionUrl?: string }> = {
  admissions: {
    answer: "Admissions for the academic session 2026-27 are currently OPEN for Playgroup to Grade XI (Dual CBSE & IB PYP). You can submit an online application or schedule a personalized counseling visit.",
    actionText: "Apply for Admissions 2026-27",
    actionUrl: "/admissions",
  },
  fees: {
    answer: "Our transparent fee structure is tailored to the selected curriculum (CBSE / IB PYP) and grade level. Would you like our admissions officer to share the complete fee breakdown and scholarship details on WhatsApp?",
    actionText: "Get Fee Details on WhatsApp",
    actionUrl: "https://wa.me/919660551977?text=Hello%20CCIS,%20please%20share%20the%20complete%20fee%20structure%20and%20scholarship%20details.",
  },
  visit: {
    answer: "We would love to welcome you to our campus in Sector-3, Mansarovar, Jaipur! Campus tours are hosted Monday through Saturday between 9:00 AM and 3:00 PM.",
    actionText: "Schedule Campus Visit",
    actionUrl: "/admissions",
  },
  curriculum: {
    answer: "CCIS offers a unique dual advantage: the globally recognized inquiry-based International Baccalaureate Primary Years Programme (IB PYP candidate) alongside the rigorous National CBSE curriculum.",
    actionText: "Explore Academics",
    actionUrl: "/academics",
  },
  contact: {
    answer: "You can reach our official admissions team directly via Phone or WhatsApp at +91 9660551977, or email info@ccischool.org. Campus address: Sector-3, Mansarovar, Jaipur - 302020.",
    actionText: "Chat on WhatsApp (+91 9660551977)",
    actionUrl: "https://wa.me/919660551977?text=Hello%20CCIS,%20I%20would%20like%20to%20speak%20with%20an%20admissions%20counselor.",
  },
};

export default function KhushiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Namaste! 🙏 I am Khushi, your CCIS Admissions & Campus Assistant. How can I help you today?",
      time: "Just now",
      whatsappAction: true,
      actionText: "Chat on WhatsApp (+91 9660551977)",
      actionUrl: "https://wa.me/919660551977?text=Hello%20CCIS,%20I%20am%20chatting%20with%20Khushi%20and%20would%20like%20admissions%20assistance.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const getBotResponse = (query: string): { answer: string; actionText?: string; actionUrl?: string } => {
    const q = query.toLowerCase();
    if (q.includes("admiss") || q.includes("apply") || q.includes("form") || q.includes("seat") || q.includes("regist")) {
      return FAQ_RESPONSES.admissions;
    }
    if (q.includes("fee") || q.includes("cost") || q.includes("charge") || q.includes("scholarship") || q.includes("price")) {
      return FAQ_RESPONSES.fees;
    }
    if (q.includes("visit") || q.includes("tour") || q.includes("location") || q.includes("map") || q.includes("address") || q.includes("where")) {
      return FAQ_RESPONSES.visit;
    }
    if (q.includes("ib") || q.includes("cbse") || q.includes("curriculum") || q.includes("board") || q.includes("pyp") || q.includes("program")) {
      return FAQ_RESPONSES.curriculum;
    }
    if (q.includes("contact") || q.includes("number") || q.includes("phone") || q.includes("whatsapp") || q.includes("call") || q.includes("email")) {
      return FAQ_RESPONSES.contact;
    }

    return {
      answer: `Thank you for your question! For detailed assistance on "${query}", you can connect with our admissions officer directly on WhatsApp (+91 9660551977) or call us right away.`,
      actionText: "Continue on WhatsApp (+91 9660551977)",
      actionUrl: `https://wa.me/919660551977?text=${encodeURIComponent(`Hello CCIS Admissions, I have a query from your website: "${query}". Please guide me.`)}`,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Realistic typing delay simulation (800ms - 1200ms)
    const delay = Math.floor(Math.random() * 400) + 800;

    setTimeout(() => {
      const resp = getBotResponse(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: resp.answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        whatsappAction: true,
        actionText: resp.actionText,
        actionUrl: resp.actionUrl,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, delay);
  };

  const quickChips = [
    { label: "Admissions 2026-27", query: "Tell me about admissions 2026-27" },
    { label: "Fee Structure", query: "What is the fee structure?" },
    { label: "Book Campus Visit", query: "How do I book a campus visit?" },
    { label: "IB vs CBSE", query: "What is the difference between IB and CBSE?" },
    { label: "WhatsApp Helpline", query: "Give me the official WhatsApp and contact numbers" },
  ];

  return (
    <>
      {/* Floating Trigger Button aligned with bottom-4 right-4 md:bottom-6 md:right-6 */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-3 sm:p-3.5 bg-gradient-to-tr from-navy-dark via-navy to-[#1f3a7a] hover:from-gold-dark hover:to-gold text-white rounded-full shadow-2xl border-2 border-gold/40 hover:border-white transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label="Chat with Khushi"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-gold group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-navy text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[390px] sm:h-[410px] max-h-[78vh] bg-white rounded-3xl shadow-2xl border border-cream-line flex flex-col overflow-hidden z-50 animate-fadeIn">
          {/* Clean & Simple Header */}
          <div className="px-4 py-3 bg-white border-b border-cream-line flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h4 className="font-serif font-bold text-navy text-sm">Khushi</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-ink-muted hover:text-navy hover:bg-cream/40 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === "user"
                      ? "bg-navy text-white rounded-br-none"
                      : "bg-white text-ink border border-cream-line rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Action Link / WhatsApp Trigger Button */}
                  {msg.whatsappAction && msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target={msg.actionUrl.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {msg.actionText || "Contact on WhatsApp"}
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-ink-muted/60 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Khushi is typing... indicator */}
            {isTyping && (
              <div className="flex flex-col items-start animate-fadeIn">
                <div className="bg-white border border-cream-line rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-2">
                  <span className="text-[11px] font-medium text-navy/80 italic">Khushi is typing</span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-white border-t border-cream-line flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 bg-cream/30 hover:bg-gold hover:text-navy text-navy/80 rounded-full text-[10px] font-semibold border border-cream-line transition-colors shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-cream-line flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask Khushi any query..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3.5 py-2 bg-cream/20 border border-cream-line rounded-xl text-xs text-ink placeholder:text-ink-muted/50 focus:border-gold outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="p-2 bg-gold hover:bg-gold-dark text-navy disabled:opacity-40 rounded-xl transition-all shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
