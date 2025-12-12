'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Code, Play, Palette, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

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

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your HTML learning assistant! 🎨 I'm here to help you master web development. I'll track your progress and suggest personalized learning paths based on your questions. What would you like to learn today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
      suggestions += `\n\n🎯 **Personalized Note**: I notice you've asked about ${analysis.struggling} before. Let's break this down step by step to make sure you master it!`
    }

    if (skillLevel === 'beginner' && analysis.difficulty === 'intermediate') {
      suggestions += `\n\n📚 **Learning Path Suggestion**: This is an intermediate topic. Consider reviewing the basics first if you haven't already.`
    }

    if (questionsAsked.length > 0 && questionsAsked.length % 5 === 0) {
      suggestions += `\n\n🌟 **Progress Update**: You've asked ${questionsAsked.length} questions so far! You're making great progress. Would you like me to suggest your next learning path?`
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
    setInput(prompt)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
    }, 100)
  }

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('html') && lowerMessage.includes('structure')) {
      return `Great question about HTML structure! 🏗️\n\nHTML documents follow a basic structure:\n\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>Main Heading</h1>\n  <p>Paragraph content</p>\n</body>\n</html>\n\`\`\`\n\nKey elements:\n• **DOCTYPE** - Declares HTML5\n• **html** - Root element\n• **head** - Contains metadata\n• **body** - Contains visible content\n\nWould you like me to explain any specific HTML elements?`
    }

    if (lowerMessage.includes('css') && lowerMessage.includes('style')) {
      return `Perfect! Let's talk about CSS styling! 🎨\n\nCSS controls how HTML elements look:\n\n\`\`\`css\n/* Basic CSS syntax */\nselector {\n  property: value;\n}\n\n/* Example */\nh1 {\n  color: #9929EA;\n  font-size: 2em;\n  text-align: center;\n}\n\`\`\`\n\nCSS can style:\n• **Colors** - text and background colors\n• **Fonts** - family, size, weight\n• **Layout** - positioning and spacing\n• **Responsive** - different screen sizes\n\nWhat specific styling would you like to learn about?`
    }

    if (lowerMessage.includes('debug') || lowerMessage.includes('fix') || lowerMessage.includes('error')) {
      return `I'd be happy to help debug your code! 🔧\n\nCommon HTML/CSS issues:\n• **Missing closing tags** - Every opening tag needs a closing tag\n• **Typos in selectors** - Check class names and IDs match\n• **CSS specificity** - More specific selectors override general ones\n• **Missing semicolons** - CSS properties need semicolons\n\nPlease share your code and I'll help you identify the issue!`
    }

    if (lowerMessage.includes('best practice')) {
      return `Excellent! Here are key HTML/CSS best practices: ⭐\n\n**HTML Best Practices:**\n• Use semantic elements (\`<header>\`, \`<main>\`, \`<footer>\`)\n• Always include alt text for images\n• Use proper heading hierarchy (h1 → h2 → h3)\n• Validate your HTML\n\n**CSS Best Practices:**\n• Use external stylesheets\n• Follow naming conventions (BEM methodology)\n• Mobile-first responsive design\n• Minimize CSS and avoid !important\n\nWould you like me to elaborate on any of these practices?`
    }

    if (lowerMessage.includes('flexbox') || lowerMessage.includes('flex')) {
      return `Flexbox is amazing for layouts! 📐\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n}\n\n.item {\n  flex: 1;\n}\n\`\`\`\n\nKey Flexbox properties:\n• **justify-content** - horizontal alignment\n• **align-items** - vertical alignment  \n• **flex-direction** - row or column\n• **flex-wrap** - wrap items to new lines\n\nTry creating a flex container and experiment with these properties!`
    }

    if (lowerMessage.includes('responsive') || lowerMessage.includes('mobile')) {
      return `Responsive design is essential! 📱\n\n\`\`\`css\n/* Mobile-first approach */\n.container {\n  width: 100%;\n  padding: 10px;\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 750px;\n    margin: 0 auto;\n  }\n}\n\`\`\`\n\nKey concepts:\n• **Mobile-first** - Start with mobile styles\n• **Media queries** - Different styles for different screens\n• **Flexible units** - Use %, em, rem instead of px\n\nWant to practice creating a responsive layout?`
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
    if (!input.trim() || isLoading) return

    const analysis = analyzeUserQuestion(input)
    updateUserProgress(input, analysis)

    const userMessage: Message = {
      id: `user-${messages.length}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
      topic: analysis.topics[0]
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${messages.length}`,
        role: 'assistant',
        content: getPersonalizedResponse(input, analysis),
        timestamp: new Date(),
        type: 'explanation'
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
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
      .replace(codeBlockRegex, '<pre class="bg-gray-800 text-green-400 p-4 rounded-lg my-3 overflow-x-auto text-sm font-mono shadow-inner"><code>$2</code></pre>')
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
      <div className="fixed bottom-6 right-6 z-50">
        {userProgress.questionsAsked.length > 0 && userProgress.questionsAsked.length % 3 === 0 && (
          <div className="mb-2 bg-[#9929EA] text-white p-2 rounded-lg text-xs max-w-48 animate-pulse">
            💡 Ready for your next learning challenge?
          </div>
        )}
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-[#9929EA] hover:bg-[#CC66DA] text-white shadow-lg relative"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
          {userProgress.questionsAsked.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {userProgress.questionsAsked.length > 9 ? '9+' : userProgress.questionsAsked.length}
            </div>
          )}
        </Button>
      </div>
    )
  }

  if (showLearningPath) {
    const recommendedPath = getRecommendedPath()
    return (
      <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
        <CardHeader className="bg-[#9929EA] text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Learning Path</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLearningPath(false)}
              className="text-white hover:bg-[#CC66DA] h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Your Progress</h3>
              <div className="text-sm space-y-1">
                <p>📊 Questions Asked: {userProgress.questionsAsked.length}</p>
                <p>🎯 Skill Level: {userProgress.skillLevel}</p>
                <p>📚 HTML Topics: {userProgress.htmlTopics.length}</p>
                <p>🎨 CSS Topics: {userProgress.cssTopics.length}</p>
                {userProgress.strugglingWith.length > 0 && (
                  <p>⚠️ Focus Areas: {userProgress.strugglingWith.join(', ')}</p>
                )}
              </div>
            </div>
            {recommendedPath && (
              <div className="bg-[#FAEB92] p-4 rounded-lg">
                <h3 className="font-semibold text-black mb-2">🌟 Recommended Next</h3>
                <div className="text-black">
                  <h4 className="font-medium">{recommendedPath.title}</h4>
                  <p className="text-sm mb-2">{recommendedPath.description}</p>
                  <p className="text-xs">⏱️ {recommendedPath.estimatedTime}</p>
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
                  <p className="text-xs text-gray-500">⏱️ {path.estimatedTime}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="bg-[#9929EA] text-white rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">AI Learning Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-[#CC66DA] h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span className="text-sm opacity-90">Tracking Your Progress</span>
          </div>
          <span className="text-xs opacity-75">
            {userProgress.questionsAsked.length} questions asked
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
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about HTML & CSS..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#9929EA] hover:bg-[#CC66DA] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}


