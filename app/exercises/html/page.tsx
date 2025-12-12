'use client'

import Header from '@/components/header'
import TutorialLayout from '@/components/tutorial-layout'
import CodeExecutor from '@/components/code-executor'
import HTMLCSSLearningCompanion from '@/components/html-css-learning-companion'
import FloatingChatbot from '@/components/floating-chatbot'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

export default function HTMLExercise() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const exercises = [
    {
      id: 1,
      title: "Basic HTML Structure",
      description: "Create a complete HTML document with proper structure",
      task: "Write HTML code to create a webpage with a title 'My First Page' and a heading 'Hello World'",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
  
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
      hints: [
        "Use the <title> tag inside <head> for the page title",
        "Use <h1> tag for the main heading",
        "Make sure all tags are properly closed"
      ]
    },
    {
      id: 2,
      title: "HTML Headings and Paragraphs",
      description: "Practice using different heading levels and paragraph tags",
      task: "Create a webpage with a main heading 'Welcome to My Website', a subheading 'About Us', and a paragraph describing your website",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <h2>About Us</h2>
  <p>This is my personal website where I share my thoughts and projects.</p>
</body>
</html>`,
      hints: [
        "Use <h1> for the main heading",
        "Use <h2> for the subheading",
        "Use <p> for paragraphs"
      ]
    },
    {
      id: 3,
      title: "HTML Lists",
      description: "Learn to create ordered and unordered lists",
      task: "Create a webpage with a heading 'My Favorite Foods' and an unordered list with at least 3 food items",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>Favorite Foods</title>
</head>
<body>
  
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <title>Favorite Foods</title>
</head>
<body>
  <h1>My Favorite Foods</h1>
  <ul>
    <li>Pizza</li>
    <li>Burger</li>
    <li>Ice Cream</li>
  </ul>
</body>
</html>`,
      hints: [
        "Use <ul> for unordered lists",
        "Use <li> for list items",
        "Each food item should be in its own <li> tag"
      ]
    },
    {
      id: 4,
      title: "HTML Links and Images",
      description: "Practice adding links and images to your webpage",
      task: "Create a webpage with a heading 'My Links', a link to Google, and an image placeholder",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>Links and Images</title>
</head>
<body>
  
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <title>Links and Images</title>
</head>
<body>
  <h1>My Links</h1>
  <a href="https://www.google.com">Visit Google</a>
  <br>
  <img src="https://via.placeholder.com/300x200" alt="Placeholder Image">
</body>
</html>`,
      hints: [
        "Use <a> tag with href attribute for links",
        "Use <img> tag with src and alt attributes",
        "The <br> tag creates a line break"
      ]
    },
    {
      id: 5,
      title: "HTML Forms",
      description: "Create a simple contact form",
      task: "Create a contact form with fields for name, email, and message",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>Contact Form</title>
</head>
<body>
  
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <title>Contact Form</title>
</head>
<body>
  <h1>Contact Us</h1>
  <form>
    <label for="name">Name:</label><br>
    <input type="text" id="name" name="name"><br>
    
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email"><br>
    
    <label for="message">Message:</label><br>
    <textarea id="message" name="message"></textarea><br>
    
    <input type="submit" value="Submit">
  </form>
</body>
</html>`,
      hints: [
        "Use <form> tag to wrap the form",
        "Use <label> tags for field descriptions",
        "Use <input> tags for text and email fields",
        "Use <textarea> for the message field"
      ]
    }
  ]

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
    }
  }

  const handleSubmit = (code: string) => {
    // Simple validation - you can enhance this
    const currentEx = exercises[currentExercise]
    if (code.includes(currentEx.solution.split('\n')[3]) && 
        code.includes(currentEx.solution.split('\n')[4])) {
      setScore(score + 1)
    }
  }

  const progress = (currentExercise / exercises.length) * 100

  if (completed) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-[#9929EA]">🎉 Exercise Complete!</CardTitle>
              <CardDescription className="text-xl">
                You've completed all HTML exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-[#00AA6C]">
                Final Score: {score}/{exercises.length}
              </div>
              <div className="text-gray-600">
                {score === exercises.length ? 
                  "Perfect! You've mastered HTML basics!" : 
                  "Great job! Keep practicing to improve your skills."
                }
              </div>
              <Button 
                onClick={() => {
                  setCurrentExercise(0)
                  setScore(0)
                  setCompleted(false)
                }}
                className="bg-[#00AA6C] hover:bg-[#008A5A] text-white"
              >
                Restart Exercises
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <TutorialLayout
        title="HTML Exercises"
        description="Practice your HTML skills with interactive exercises"
        currentTopic={`Exercise ${currentExercise + 1}: ${exercises[currentExercise].title}`}
        topics={exercises.map((ex, index) => `Exercise ${index + 1}: ${ex.title}`)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Middle Content Area - Exercise Content */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Exercise Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#9929EA]">
                  {exercises[currentExercise].title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {exercises[currentExercise].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Your Task:</h3>
                  <p className="text-blue-700">{exercises[currentExercise].task}</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Hints:</h3>
                  <ul className="space-y-1 text-yellow-700">
                    {exercises[currentExercise].hints.map((hint, index) => (
                      <li key={index}>• {hint}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#9929EA] mb-4">Code Editor</h3>
                  <CodeExecutor
                    initialCode={exercises[currentExercise].initialCode}
                    language="html"
                    onCodeChange={handleSubmit}
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentExercise === 0}
                    variant="outline"
                    className="border-[#9929EA] text-[#9929EA] hover:bg-[#9929EA] hover:text-white"
                  >
                    ← Previous
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    className="bg-[#00AA6C] hover:bg-[#008A5A] text-white"
                  >
                    {currentExercise === exercises.length - 1 ? 'Finish' : 'Next →'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Sidebar - AI-Powered Learning Widget */}
          <div className="lg:col-span-1 overflow-y-auto">
            <div className="sticky top-0">
              <HTMLCSSLearningCompanion />
            </div>
          </div>
        </div>
      </TutorialLayout>
      <FloatingChatbot />
    </div>
  )
}
