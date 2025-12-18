'use client'
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const WAFFERLI_INFO = `
Wafferli Website Project - Full Scope of Work Document
Project Objective: Build a dynamic, full-featured web platform that connects customers and businesses through exclusive offers, powerful marketing tools, and a multi-purpose discovery ecosystem. The platform will serve as a local business guide, advertising engine, digital marketplace, and mobile app promotion funnel, while also integrating smart AI interaction and expansion-ready architecture.

1. WEBSITE STRUCTURE (NAVIGATION MENU)
Main Menu Pages:
1. Home (ads and sliders focused) - Route: /
2. Offers - Route: /offers
3. Explore Kuwait - Route: /explore-kuwait
4. Services - Route: /services
5. Products - Route: /products
6. Flash Deals - Route: /flash-deals
7. Marketplace - Route: /marketplace
8. Weddings & Events - Route: /weddings-events
10. Blog / News - Route: /blog
11. About Wafferli - Route: /about
12. FAQs - Route: /faq
13. Contact Us - Route: /contact
14. Download App - Route: /download-app
15. Login / Sign-Up - Route: /login

2. HOME PAGE (MARKETING-DRIVEN)
Purpose: Visual ad-based homepage for showcasing offers, sponsored content, and categories
Sections:
· Hero Banner (dynamic, sponsored)
· Category Sliders (restaurants, hotels, cafes, salons, etc.)
· Promotional Offer Sliders
· Explore Kuwait Preview
· Flash Deals Teaser
· Product of the Day / Partner Spotlights
· Download App CTA
· Newsletter signup
Admin Control: All content dynamically managed from CMS with start/end date settings

3. ABOUT WAFFERLI
· Company story
· Mission & Vision
· How it helps customers
· How it supports businesses
· Team or press mentions (optional)

4. OFFERS PAGE
· Filtered by category, location, type (new, popular, expiring)
· Offer cards with image, summary, tags
· Individual offer page: business info, map, offer list, claim button

5. EXPLORE KUWAIT
· Landmarks, malls, attractions, parks, family spots
· Filter by location & type
· Google Maps + direction links
· Sponsored or free listings

6. SERVICES PAGE
· Consumer services: cleaning, car repair, AC, tutoring
· Filterable by category & area
· Individual pages with description, contact, optional offer

7. PRODUCTS PAGE
· Products from partners: fashion, electronics, home
· Filters: category, store, price
· Product cards: image, title, external shop link or WhatsApp
· Sponsored listings option

8. FLASH DEALS
· 24h or 48h limited-time offers
· Countdown timer
· Admin-controlled content & timing

9. MARKETPLACE (FORSALE / OPENSOUK STYLE)
· Individuals/companies post products or services
· Categories: housing, electronics, cars, services
· Filters by category, price, location
· Posts with images, description, contact (phone, WhatsApp)
· Admin approval & moderation
· Sponsored ads option

10. WEDDINGS & EVENTS
· Venues, decorators, DJs, planners, photographers
· Filters: event type, location, budget
· Dedicated detail pages
· Subcategory under Explore or separate main section

12. BLOG / NEWS
· SEO articles, updates, top 10 lists
· Sponsored blog post option for partners

13. FAQS
· Organized for Customers, Businesses, Tourists
· Tabs or collapsible Q&A

14. CONTACT US
· Inquiry forms for general/business
· WhatsApp button
· Map embed (optional)

15. DOWNLOAD APP
· App benefits
· Store links + QR code
· Screenshots / mini demo video

16. LOGIN / SIGN-UP
· Customer account
· Saved offers, wishlists
· Offer claim history
· Optional loyalty system

17. CORE FEATURES (SHARED SITEWIDE)
· Admin panel to control everything (offers, banners, blogs, flash deals)
· Filter and search system
· Google Maps integration on listings
· Newsletter collection & email export
· Offer impressions, clicks, and analytics tracking

18. MARKETING & ADVERTISING SYSTEM
· Sponsored homepage banners
· Sponsored offer and service cards
· Blog post sponsorship
· Newsletter ad slots
· Seasonal categories (Ramadan, Eid, Summer Sales)
· Event sponsorship (e.g. food festivals)
· Flash deals (sponsored urgency ads)

19. GAMIFICATION & ENGAGEMENT
· Scratch card discounts
· Spin-to-win reward games
· Referral system with trackable links
· Loyalty program (Wafferli Points)

20. AI CHAT ASSISTANT
· Website chatbot powered by AI
· Natural language understanding
· Responds to queries like:
· "Best hotel in Salmiya"
· "I want haircut deals in Hawally"
· Returns internal links and helpful recommendations
· 24/7 virtual guide for offers, places, services, and blog content

21. ADD ONS 
· Gift Cards Center
· Wafferli Weekly Picks Section
· "Coming Soon" Businesses Page
· Activities & Experiences (Desert safari, diving, tours)
· Professional Services (Lawyers, Agencies, Recruiters)
· Multilingual Support (Arabic/English Toggle)
· Public Events Calendar
`;

// Environment variables (in real app, use process.env)
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `
You are Wafferli AI Assistant, a friendly and helpful 24/7 virtual guide for the Wafferli platform. Your knowledge is based solely on the provided Wafferli project information. Do not answer questions unrelated to Wafferli.

CRITICAL LINK FORMATTING:
- ALWAYS format internal links as: [Link Text](${FRONTEND_URL}/route)
- Example: [View Offers](${FRONTEND_URL}/offers)
- Example: [Contact Us](${FRONTEND_URL}/contact)
- Example: [Explore Kuwait](${FRONTEND_URL}/explore-kuwait)
- For contact queries, always provide: [Contact Page](${FRONTEND_URL}/contact)

Key instructions:
- Answer concisely, warmly, and directly in a conversational tone
- Use emojis sparingly (1-2 per response) to add personality: 🎉 ✨ 🎯 🌟 💫 🚀
- ALWAYS format page references as clickable markdown links with full URLs
- Use **bold** for key terms and important information
- Use *italics* for subtle emphasis
- Keep responses scannable with short paragraphs
- If information is not in scope, say: "I don't have that specific information. Please check our [Contact Page](${FRONTEND_URL}/contact) for more details."
- Always include relevant page links when suggesting features or pages

Wafferli Project Information:
${WAFFERLI_INFO}
`;

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const SUGGESTIONS = [
  "Show me the best offers",
  "What's in Flash Deals?",
  "Tell me about Explore Kuwait",
  "How can businesses join?",
  "What services are available?"
];

const STORAGE_KEY = 'wafferli_chat_history';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message if no history
      const welcomeMessage: Message = {
        role: 'bot',
        content: `👋 **Welcome to Wafferli!**\n\nI'm your AI assistant, here to help you discover amazing offers, services, and places in Kuwait. ✨\n\nYou can ask me about:\n- 🎁 [Exclusive Offers](${FRONTEND_URL}/offers)\n- 🏙️ [Explore Kuwait](${FRONTEND_URL}/explore-kuwait)\n- ⚡ [Flash Deals](${FRONTEND_URL}/flash-deals)\n- 🛍️ [Marketplace](${FRONTEND_URL}/marketplace)\n- And much more!\n\nHow can I help you today?`
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: SYSTEM_PROMPT },
                  ...messages.map((msg) => ({ text: `${msg.role}: ${msg.content}` })),
                  { text: `user: ${messageText}` },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';

      const botMessage: Message = { role: 'bot', content: botContent };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = { 
        role: 'bot', 
        content: 'Oops! Something went wrong. Please try again. 🔄' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    const welcomeMessage: Message = {
      role: 'bot',
      content: `👋 **Welcome back!**\n\nChat history cleared. How can I assist you today?`
    };
    setMessages([welcomeMessage]);
  };

  const renderMessage = (content: string) => {
    // Configure marked to open links in same tab and add primary color
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    let html = marked.parse(content) as string;
    
    // Add primary color to all links
    html = html.replace(/<a /g, '<a style="color: #762c85; font-weight: 600; text-decoration: underline;" ');
    
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} className="prose prose-sm max-w-none" />;
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(118,44,133,0.5)]  hover:scale-110 flex items-center justify-center"
          aria-label="Open Wafferli AI Chat"
        >
          <div className="absolute inset-0.5 bg-white rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              <circle cx="9" cy="9" r="1.5"/>
              <circle cx="15" cy="9" r="1.5"/>
              <path d="M12 17c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
        </button>
      )}
      
      {isOpen && (
        <div className="bg-white border-2 border-primary/20 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-96 h-[32rem] sm:h-[36rem] flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Wafferli AI</h3>
                <p className="text-xs opacity-90">Online 24/7</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={clearHistory}
                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Clear history"
                title="Clear chat history"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-grey-5/30 to-white scrollbar">
            {messages.length === 0 && (
              <div className="text-center text-grey-3 py-8">
                <p className="text-sm">No messages yet. Start chatting! 👋</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
              >
                <div
                  className={`max-w-[85%] p-2.5 sm:p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-sm shadow-md'
                      : 'bg-white border border-grey-5 text-grey-1 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {renderMessage(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-slideIn">
                <div className="bg-white border border-grey-5 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !isLoading && (
            <div className="px-3 sm:px-4 pb-2 space-y-2">
              <p className="text-xs text-grey-3 font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary rounded-full border border-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t-2 border-grey-5 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1 px-3 py-2 text-sm border-2 border-grey-5 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center min-w-[44px]"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-grey-4 mt-2 text-center">Powered by Wafferli AI ✨</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;