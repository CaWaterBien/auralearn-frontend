'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Code, Play, Palette, TrendingUp, Minus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { auraBotAPI, type AuraBotResponse, type SessionStatus } from '@/lib/aurabot-api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'code' | 'explanation' | 'suggestion'
  topic?: string
}

interface UserProgress {
  htmlTopics: string[]
  cssTopics: string[]
  questionsAsked: string[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  lastActivity: Date
  strugglingWith: string[]
  completedConcepts: string[]
}

interface LearningPath {
  title: string
  description: string
  topics: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    htmlTopics: [],
    cssTopics: [],
    questionsAsked: [],
    skillLevel: 'beginner',
    lastActivity: new Date(),
    strugglingWith: [],
    completedConcepts: []
  })
  const [showLearningPath, setShowLearningPath] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)

  // Initialize session and load conversation history
  useEffect(() => {
    const initializeSession = async () => {
      // Get user ID for user-specific sessions
      let userId: string | undefined;
      try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
          const user = JSON.parse(userData);
          userId = user.id?.toString();
        }
      } catch (e) {
        console.warn('Could not get user ID for AuraBot session');
      }

      const newSessionId = auraBotAPI.getSessionId(undefined, userId)
      setSessionId(newSessionId)

      // Load session status
      const status = await auraBotAPI.getSessionStatus(newSessionId)
      setSessionStatus(status)

      // Load conversation history
      const history = await auraBotAPI.getConversationHistory(newSessionId)
      if (history.length > 0) {
        const formattedMessages: Message[] = history.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          type: msg.role === 'assistant' ? 'explanation' : undefined
        }))
        setMessages(formattedMessages)
      } else {
        // Add welcome message for new sessions
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: "Hi! I'm AuraBot, your HTML & CSS learning assistant! 🤖 I can help you understand concepts and solve problems. I'll provide hints and guidance to help you learn - not direct answers! You have 3 questions per session. What would you like to learn about?",
          timestamp: new Date()
        }])
      }

      setIsInitialized(true)
    }

    initializeSession()
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Get user-specific progress key
    let userId: string | undefined;
    try {
      const userData = localStorage.getItem('auralearn_user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id?.toString();
      }
    } catch (e) {
      console.warn('Could not get user ID for progress');
    }

    const progressKey = userId ? `userProgress_${userId}` : 'userProgress';
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, [])

  useEffect(() => {
    // Get user-specific progress key
    let userId: string | undefined;
    try {
      const userData = localStorage.getItem('auralearn_user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id?.toString();
      }
    } catch (e) {
      console.warn('Could not get user ID for progress');
    }

    const progressKey = userId ? `userProgress_${userId}` : 'userProgress';
    localStorage.setItem(progressKey, JSON.stringify(userProgress));
  }, [userProgress])

  // Handle click outside to close chatbot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsMinimized(false)
      }
    }

    if (isOpen && !isMinimized) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isMinimized])

  const learningPaths: LearningPath[] = [
    {
      title: "HTML Fundamentals",
      description: "Master the building blocks of web pages",
      topics: ["HTML Structure", "Elements & Tags", "Attributes", "Text Formatting", "Links & Images"],
      difficulty: "beginner",
      estimatedTime: "2-3 weeks"
    },
    {
      title: "CSS Styling Basics",
      description: "Learn to make beautiful web pages",
      topics: ["CSS Syntax", "Selectors", "Colors & Fonts", "Box Model", "Backgrounds & Borders"],
      difficulty: "beginner",
      estimatedTime: "3-4 weeks"
    },
    {
      title: "Modern Layouts",
      description: "Master Flexbox and Grid layouts",
      topics: ["Flexbox Fundamentals", "CSS Grid", "Responsive Design", "Mobile-First Approach"],
      difficulty: "intermediate",
      estimatedTime: "4-5 weeks"
    },
    {
      title: "Advanced CSS",
      description: "Animations, transforms, and advanced techniques",
      topics: ["CSS Animations", "Transforms", "Custom Properties", "Advanced Selectors"],
      difficulty: "advanced",
      estimatedTime: "5-6 weeks"
    }
  ]

  const quickActions = [
    {
      icon: <Code className="h-4 w-4" />,
      label: "HTML Help",
      action: () => handleQuickAction("Help me with HTML structure and elements")
    },
    {
      icon: <Palette className="h-4 w-4" />,
      label: "CSS Styling",
      action: () => handleQuickAction("Help me style this with CSS")
    },
    {
      icon: <Play className="h-4 w-4" />,
      label: "Debug Code",
      action: () => handleQuickAction("Help me fix this HTML/CSS code")
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Learning Path",
      action: () => setShowLearningPath(true)
    }
  ]

  const analyzeUserQuestion = (question: string): { topics: string[], difficulty: string, struggling?: string } => {
    const lowerQuestion = question.toLowerCase()
    const topics: string[] = []
    let difficulty = 'beginner'
    let struggling: string | undefined

    if (lowerQuestion.includes('html') || lowerQuestion.includes('element') || lowerQuestion.includes('tag')) {
      topics.push('HTML')
      if (lowerQuestion.includes('semantic') || lowerQuestion.includes('accessibility')) {
        difficulty = 'intermediate'
      }
    }

    if (lowerQuestion.includes('css') || lowerQuestion.includes('style') || lowerQuestion.includes('color')) {
      topics.push('CSS')
    }

    if (lowerQuestion.includes('flexbox') || lowerQuestion.includes('grid')) {
      topics.push('Layout')
      difficulty = 'intermediate'
    }

    if (lowerQuestion.includes('responsive') || lowerQuestion.includes('mobile')) {
      topics.push('Responsive Design')
      difficulty = 'intermediate'
    }

    if (lowerQuestion.includes('animation') || lowerQuestion.includes('transform')) {
      topics.push('Advanced CSS')
      difficulty = 'advanced'
    }

    if (lowerQuestion.includes('help') || lowerQuestion.includes('fix') || lowerQuestion.includes('error') || lowerQuestion.includes('problem')) {
      struggling = topics[0] || 'General'
    }

    return { topics, difficulty, struggling }
  }

  const updateUserProgress = (question: string, analysis: { topics: string[], difficulty: string, struggling?: string }) => {
    setUserProgress(prev => {
      const newProgress = { ...prev }
      newProgress.questionsAsked.push(question)

      analysis.topics.forEach(topic => {
        if (topic === 'HTML' && !newProgress.htmlTopics.includes(topic)) {
          newProgress.htmlTopics.push(topic)
        } else if (topic !== 'HTML' && !newProgress.cssTopics.includes(topic)) {
          newProgress.cssTopics.push(topic)
        }
      })

      const totalQuestions = newProgress.questionsAsked.length
      if (totalQuestions > 20 && analysis.difficulty === 'advanced') {
        newProgress.skillLevel = 'advanced'
      } else if (totalQuestions > 10 && analysis.difficulty === 'intermediate') {
        newProgress.skillLevel = 'intermediate'
      }

      if (analysis.struggling && !newProgress.strugglingWith.includes(analysis.struggling)) {
        newProgress.strugglingWith.push(analysis.struggling)
      }

      newProgress.lastActivity = new Date()
      return newProgress
    })
  }

  const getPersonalizedResponse = (question: string, analysis: { topics: string[], difficulty: string, struggling?: string }): string => {
    const { questionsAsked, skillLevel, strugglingWith, htmlTopics, cssTopics } = userProgress

    let personalizedIntro = ""
    if (questionsAsked.length > 5) {
      personalizedIntro = `Great to see you back! I notice you've been learning ${htmlTopics.length > 0 ? 'HTML' : ''}${htmlTopics.length > 0 && cssTopics.length > 0 ? ' and ' : ''}${cssTopics.length > 0 ? 'CSS' : ''}. `
    }

    const baseResponse = getAIResponse(question)

    let suggestions = ""
    if (analysis.struggling && strugglingWith.includes(analysis.struggling)) {
      suggestions += `\n\nPersonalized Note: I notice you've asked about ${analysis.struggling} before. Let's break this down step by step to make sure you master it!`
    }

    if (skillLevel === 'beginner' && analysis.difficulty === 'intermediate') {
      suggestions += `\n\nLearning Path Suggestion: This is an intermediate topic. Consider reviewing the basics first if you haven't already.`
    }

    if (questionsAsked.length > 0 && questionsAsked.length % 5 === 0) {
      suggestions += `\n\nProgress Update: You've asked ${questionsAsked.length} questions so far! You're making great progress. Would you like me to suggest your next learning path?`
    }

    return personalizedIntro + baseResponse + suggestions
  }

  const getRecommendedPath = (): LearningPath | null => {
    const { htmlTopics, cssTopics, skillLevel } = userProgress
    if (htmlTopics.length === 0) {
      return learningPaths.find(path => path.title === "HTML Fundamentals") || null
    }
    if (cssTopics.length === 0 && htmlTopics.length > 0) {
      return learningPaths.find(path => path.title === "CSS Styling Basics") || null
    }
    if (skillLevel === 'intermediate') {
      return learningPaths.find(path => path.title === "Modern Layouts") || null
    }
    if (skillLevel === 'advanced') {
      return learningPaths.find(path => path.title === "Advanced CSS") || null
    }
    return null
  }

  const handleQuickAction = (prompt: string) => {
    if (prompt === "Learning Path") {
      setShowLearningPath(true)
      return
    }
    
    // Check if user can ask questions before setting input
    if (sessionStatus && !sessionStatus.can_ask) {
      setError(`You've reached your question limit. ${sessionStatus.blocked_until ? `Please wait until ${sessionStatus.blocked_until}` : 'Please try again later.'}`)
      return
    }
    
    setInput(prompt)
    // Trigger form submission programmatically
    setTimeout(() => {
      const form = document.querySelector('form[data-chatbot-form]') as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('html') && lowerMessage.includes('structure')) {
      return `Great question about HTML structure!\n\nHTML documents follow a basic structure:\n\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>Main Heading</h1>\n  <p>Paragraph content</p>\n</body>\n</html>\n\`\`\`\n\nKey elements:\n• DOCTYPE - Declares HTML5\n• html - Root element\n• head - Contains metadata\n• body - Contains visible content\n\nWould you like me to explain any specific HTML elements?`
    }

    if (lowerMessage.includes('css') && lowerMessage.includes('style')) {
      return `Perfect! Let's talk about CSS styling!\n\nCSS controls how HTML elements look:\n\n\`\`\`css\n/* Basic CSS syntax */\nselector {\n  property: value;\n}\n\n/* Example */\nh1 {\n  color: #9929EA;\n  font-size: 2em;\n  text-align: center;\n}\n\`\`\`\n\nCSS can style:\n• Colors - text and background colors\n• Fonts - family, size, weight\n• Layout - positioning and spacing\n• Responsive - different screen sizes\n\nWhat specific styling would you like to learn about?`
    }

    if (lowerMessage.includes('debug') || lowerMessage.includes('fix') || lowerMessage.includes('error')) {
      return `I'd be happy to help debug your code!\n\nCommon HTML/CSS issues:\n• Missing closing tags - Every opening tag needs a closing tag\n• Typos in selectors - Check class names and IDs match\n• CSS specificity - More specific selectors override general ones\n• Missing semicolons - CSS properties need semicolons\n\nPlease share your code and I'll help you identify the issue!`
    }

    if (lowerMessage.includes('best practice')) {
      return `Excellent! Here are key HTML/CSS best practices:\n\nHTML Best Practices:\n• Use semantic elements (<header>, <main>, <footer>)\n• Always include alt text for images\n• Use proper heading hierarchy (h1 → h2 → h3)\n• Validate your HTML\n\nCSS Best Practices:\n• Use external stylesheets\n• Follow naming conventions (BEM methodology)\n• Mobile-first responsive design\n• Minimize CSS and avoid !important\n\nWould you like me to elaborate on any of these practices?`
    }

    if (lowerMessage.includes('flexbox') || lowerMessage.includes('flex')) {
      return `Flexbox is amazing for layouts!\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n}\n\n.item {\n  flex: 1;\n}\n\`\`\`\n\nKey Flexbox properties:\n• justify-content - horizontal alignment\n• align-items - vertical alignment  \n• flex-direction - row or column\n• flex-wrap - wrap items to new lines\n\nTry creating a flex container and experiment with these properties!`
    }

    if (lowerMessage.includes('responsive') || lowerMessage.includes('mobile')) {
      return `Responsive design is essential!\n\n\`\`\`css\n/* Mobile-first approach */\n.container {\n  width: 100%;\n  padding: 10px;\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 750px;\n    margin: 0 auto;\n  }\n}\n\`\`\`\n\nKey concepts:\n• Mobile-first - Start with mobile styles\n• Media queries - Different styles for different screens\n• Flexible units - Use %, em, rem instead of px\n\nWant to practice creating a responsive layout?`
    }

    const responses = [
      "That's a great question! Could you be more specific about what you'd like to learn?",
      "I'm here to help with HTML and CSS! Try asking about specific elements or properties.",
      "Let's dive into that topic! What specific concept would you like to explore?",
      "Perfect! What HTML or CSS concept can I help you with today?"
    ]
    // Use message count as deterministic index to avoid hydration issues
    return responses[messages.length % responses.length]
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !sessionId) return

    // Check if user can ask questions
    if (sessionStatus && !sessionStatus.can_ask) {
      setError(`You've reached your question limit. ${sessionStatus.blocked_until ? `Please wait until ${sessionStatus.blocked_until}` : 'Please try again later.'}`)
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Extract context from the current page
      const htmlContext = auraBotAPI.extractHtmlContext()
      const instructionsContext = auraBotAPI.extractInstructionsContext()

      // Send question to AuraBot RAG API
      const response = await auraBotAPI.askQuestion(
        sessionId,
        currentInput,
        htmlContext || undefined,
        instructionsContext || undefined
      )

      if (response.success && response.response) {
        const aiResponse: Message = {
          id: response.message_id || `ai-${Date.now()}`,
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          type: 'explanation'
        }

        setMessages(prev => [...prev, aiResponse])

        // Update session status
        if (response.session_info) {
          setSessionStatus(prev => prev ? {
            ...prev,
            can_ask: response.remaining_attempts! > 0,
            remaining_attempts: response.remaining_attempts!,
            attempt_count: response.session_info!.attempt_count,
            is_blocked: response.session_info!.is_blocked
          } : {
            exists: true,
            can_ask: response.remaining_attempts! > 0,
            remaining_attempts: response.remaining_attempts!,
            attempt_count: response.session_info!.attempt_count,
            is_blocked: response.session_info!.is_blocked
          })
        }

        // Update progress tracking
        updateUserProgress(currentInput, { topics: [], difficulty: 'beginner' })

      } else {
        // Handle API error
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: response.error || 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date(),
          type: 'explanation'
        }
        setMessages(prev => [...prev, errorMessage])
        setError(response.error || 'An error occurred')
      }

    } catch (error) {
      console.error('Chat submission error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered a connection error. Please check your internet connection and try again.',
        timestamp: new Date(),
        type: 'explanation'
      }
      setMessages(prev => [...prev, errorMessage])
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getMessageIcon = (role: string) => {
    return role === 'user' ? (
      <User className="h-5 w-5 text-[#9929EA]" />
    ) : (
      <Bot className="h-5 w-5 text-[#00AA6C]" />
    )
  }

  const formatMessage = (content: string) => {
    const codeBlockRegex = /\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g
    const inlineCodeRegex = /`([^`]+)`/g
    const boldRegex = /\*\*(.*?)\*\*/g
    const bulletRegex = /^• (.*$)/gm
    
    const formattedContent = content
      // Format code blocks
              .replace(codeBlockRegex, '<pre class="bg-gradient-to-br from-purple-800 to-[#9929EA] text-green-400 p-4 rounded-lg my-3 overflow-x-auto text-sm font-mono shadow-inner"><code>$2</code></pre>')
      // Format inline code
      .replace(inlineCodeRegex, '<code class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono font-semibold">$1</code>')
      // Format bold text
      .replace(boldRegex, '<strong class="font-bold text-gray-900">$1</strong>')
      // Format bullet points
      .replace(bulletRegex, '<div class="flex items-start my-2"><span class="text-[#9929EA] mr-2 font-bold text-base">•</span><span class="flex-1">$1</span></div>')
      // Format line breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
    
    return formattedContent
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50" ref={chatbotRef}>
        {/* Show notification when session is ready or blocked */}
        {sessionStatus && sessionStatus.attempt_count > 0 && sessionStatus.remaining_attempts === 0 && (
          <div className="mb-3 bg-red-500 text-white p-3 rounded-xl text-sm max-w-56 shadow-lg">
            ⏰ Question limit reached! 
            {sessionStatus.blocked_until && (
              <div className="text-xs mt-1">Wait until: {sessionStatus.blocked_until}</div>
            )}
          </div>
        )}
        {sessionStatus && sessionStatus.remaining_attempts === 1 && (
          <div className="mb-3 bg-orange-500 text-white p-3 rounded-xl text-sm max-w-56 animate-pulse shadow-lg">
            ⚠️ Last question remaining!
          </div>
        )}
        {sessionStatus && sessionStatus.remaining_attempts === 3 && sessionStatus.attempt_count === 0 && (
          <div className="mb-3 bg-[#9929EA] text-white p-3 rounded-xl text-sm max-w-56 animate-pulse shadow-lg">
            🤖 AuraBot is ready to help!
          </div>
        )}
        
        <Button
          onClick={() => setIsOpen(true)}
          className={`h-20 w-20 rounded-full ${
            sessionStatus?.can_ask === false 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-br from-[#9929EA] to-[#CC66DA] hover:from-[#CC66DA] hover:to-[#9929EA]'
          } text-white shadow-2xl relative transition-all duration-300 hover:scale-110 border-4 border-white`}
          size="lg"
          disabled={sessionStatus?.can_ask === false}
        >
          {sessionStatus?.can_ask === false ? (
            <AlertCircle className="h-8 w-8" />
          ) : (
            <MessageCircle className="h-8 w-8" />
          )}
          
          {/* Attempt counter */}
          {sessionStatus && sessionStatus.remaining_attempts !== undefined && (
            <div className={`absolute -top-2 -right-2 ${
              sessionStatus.remaining_attempts === 0 ? 'bg-red-500' :
              sessionStatus.remaining_attempts === 1 ? 'bg-orange-500' : 'bg-blue-500'
            } text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg`}>
              {sessionStatus.remaining_attempts}
            </div>
          )}
        </Button>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-600 font-medium">
            {sessionStatus?.can_ask === false ? 'AuraBot Resting' : 'AuraBot Ready'}
          </p>
          {sessionStatus && sessionStatus.remaining_attempts !== undefined && (
            <p className="text-xs text-gray-500">
              {sessionStatus.remaining_attempts} questions left
            </p>
          )}
        </div>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <div ref={chatbotRef}>
        <Card className="fixed bottom-8 right-8 w-80 shadow-2xl z-50 cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => setIsMinimized(false)}>
          <CardHeader className="bg-[#9929EA] text-white rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <CardTitle className="text-sm">AI Learning Assistant</CardTitle>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs opacity-75">{userProgress.questionsAsked.length} questions</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="text-white hover:bg-[#CC66DA] h-6 w-6 p-0"
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="text-xs opacity-90 mt-1">
              Click to expand • Ready to help with HTML & CSS
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (showLearningPath) {
    const recommendedPath = getRecommendedPath()
    return (
      <div ref={chatbotRef}>
        <Card className="fixed bottom-8 right-8 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-[#9929EA] text-white rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Learning Path</CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsMinimized(true)
                    setShowLearningPath(false)
                  }}
                  className="text-white hover:bg-[#CC66DA] h-8 w-8 p-0"
                  title="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLearningPath(false)}
                  className="text-white hover:bg-[#CC66DA] h-8 w-8 p-0"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Your Progress</h3>
                <div className="text-sm space-y-1">
                  <p>Questions Asked: {userProgress.questionsAsked.length}</p>
                  <p>Skill Level: {userProgress.skillLevel}</p>
                  <p>HTML Topics: {userProgress.htmlTopics.length}</p>
                  <p>CSS Topics: {userProgress.cssTopics.length}</p>
                  {userProgress.strugglingWith.length > 0 && (
                    <p>Focus Areas: {userProgress.strugglingWith.join(', ')}</p>
                  )}
                </div>
              </div>
              {recommendedPath && (
                <div className="bg-[#FAEB92] p-4 rounded-lg">
                                  <h3 className="font-semibold text-[#9929EA] mb-2">Recommended Next</h3>
                <div className="text-[#9929EA]">
                    <h4 className="font-medium">{recommendedPath.title}</h4>
                    <p className="text-sm mb-2">{recommendedPath.description}</p>
                    <p className="text-xs">Estimated Time: {recommendedPath.estimatedTime}</p>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <h3 className="font-semibold">All Learning Paths</h3>
                {learningPaths.map((path, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${
                      path === recommendedPath ? 'border-[#9929EA] bg-[#9929EA] bg-opacity-10' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{path.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        path.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                    <p className="text-xs text-gray-500">Estimated Time: {path.estimatedTime}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={chatbotRef}>
      <Card className="fixed bottom-8 right-8 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
        <CardHeader className="bg-[#9929EA] text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">AI Learning Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-[#CC66DA] h-8 w-8 p-0"
                title="Minimize"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-[#CC66DA] h-8 w-8 p-0"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
            <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <div className={`h-2 w-2 ${
                sessionStatus?.can_ask === false ? 'bg-red-400' : 'bg-green-400'
              } rounded-full ${sessionStatus?.can_ask !== false ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm opacity-90">
                {sessionStatus?.can_ask === false ? 'Session Blocked' : 'RAG-Powered AI'}
              </span>
            </div>
            <span className="text-xs opacity-75">
              {sessionStatus?.remaining_attempts !== undefined 
                ? `${sessionStatus.remaining_attempts} questions left`
                : 'Loading...'
              }
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="flex items-center space-x-1 text-xs h-8"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 p-5" ref={scrollAreaRef as React.RefObject<HTMLDivElement>}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      message.role === 'user' 
                        ? 'bg-[#9929EA] bg-opacity-10' 
                        : 'bg-[#00AA6C] bg-opacity-10'
                    }`}>
                      {getMessageIcon(message.role)}
                    </div>
                  </div>
                  <div
                    className={`max-w-[85%] p-4 rounded-xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#9929EA] to-[#CC66DA] text-white ml-auto'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content)
                      }}
                    />
                    <div className="text-xs opacity-70 mt-3 flex items-center justify-between">
                      <span className="font-medium">{message.timestamp.toLocaleTimeString()}</span>
                      {message.topic && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          message.role === 'user' 
                            ? 'bg-white bg-opacity-20 text-white'
                            : 'bg-[#9929EA] bg-opacity-10 text-[#9929EA]'
                        }`}>
                          {message.topic}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Bot className="h-5 w-5 text-[#00AA6C]" />
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            {/* Error display */}
            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-auto h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Session status display */}
            {sessionStatus && isInitialized && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                <div className="flex items-center justify-between">
                  <span>Questions remaining: {sessionStatus.remaining_attempts}</span>
                  {sessionStatus.is_blocked && (
                    <span className="text-red-600 font-medium">🚫 Blocked</span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} data-chatbot-form className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  sessionStatus?.can_ask === false 
                    ? "Question limit reached..." 
                    : "Ask me anything about HTML & CSS..."
                }
                className="flex-1"
                disabled={isLoading || !isInitialized || sessionStatus?.can_ask === false}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim() || !isInitialized || sessionStatus?.can_ask === false}
                className="bg-[#9929EA] hover:bg-[#CC66DA] text-white disabled:bg-gray-400"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
