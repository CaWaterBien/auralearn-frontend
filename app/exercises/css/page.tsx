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

export default function CSSExercise() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const exercises = [
    {
      id: 1,
      title: "Basic CSS Selectors",
      description: "Learn to target HTML elements with CSS",
      task: "Style the h1 element to have blue color and center alignment",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    h1 {
      color: blue;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
      hints: [
        "Use the element selector (h1) to target the heading",
        "Set color property to 'blue'",
        "Set text-align property to 'center'"
      ]
    },
    {
      id: 2,
      title: "CSS Colors and Backgrounds",
      description: "Practice using colors and background properties",
      task: "Set the body background to light blue and make paragraphs have a white background with padding",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    
  </style>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph with styling.</p>
  <p>Another paragraph here.</p>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background-color: lightblue;
    }
    p {
      background-color: white;
      padding: 10px;
    }
  </style>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph with styling.</p>
  <p>Another paragraph here.</p>
</body>
</html>`,
      hints: [
        "Use body selector to style the entire page",
        "Set background-color to 'lightblue' for body",
        "Use p selector to style all paragraphs",
        "Add padding: 10px to paragraphs"
      ]
    },
    {
      id: 3,
      title: "CSS Box Model",
      description: "Understand margins, borders, and padding",
      task: "Add a border around the h1 element with 2px solid black border and 20px margin",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    h1 {
      color: blue;
    }
  </style>
</head>
<body>
  <h1>Styled Heading</h1>
  <p>Content below the heading.</p>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    h1 {
      color: blue;
      border: 2px solid black;
      margin: 20px;
    }
  </style>
</head>
<body>
  <h1>Styled Heading</h1>
  <p>Content below the heading.</p>
</body>
</html>`,
      hints: [
        "Use border property: '2px solid black'",
        "Add margin: 20px for spacing",
        "Keep the existing color property"
      ]
    },
    {
      id: 4,
      title: "CSS Flexbox Layout",
      description: "Create flexible layouts with flexbox",
      task: "Make the div container use flexbox to center its content both horizontally and vertically",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      height: 200px;
      background-color: lightgray;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Centered Content</h2>
    <p>This should be centered.</p>
  </div>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      height: 200px;
      background-color: lightgray;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Centered Content</h2>
    <p>This should be centered.</p>
  </div>
</body>
</html>`,
      hints: [
        "Use display: flex to enable flexbox",
        "Use justify-content: center for horizontal centering",
        "Use align-items: center for vertical centering",
        "Add flex-direction: column to stack items vertically"
      ]
    },
    {
      id: 5,
      title: "CSS Responsive Design",
      description: "Make your design work on different screen sizes",
      task: "Add a media query to make the text smaller on screens smaller than 600px",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-size: 16px;
    }
    h1 {
      font-size: 24px;
    }
  </style>
</head>
<body>
  <h1>Responsive Heading</h1>
  <p>This text should be responsive.</p>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-size: 16px;
    }
    h1 {
      font-size: 24px;
    }
    
    @media (max-width: 600px) {
      body {
        font-size: 14px;
      }
      h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <h1>Responsive Heading</h1>
  <p>This text should be responsive.</p>
</body>
</html>`,
      hints: [
        "Use @media (max-width: 600px) for the media query",
        "Reduce font-size for body to 14px on small screens",
        "Reduce font-size for h1 to 20px on small screens"
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
    if (code.includes('style') && code.includes('{')) {
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
                You've completed all CSS exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-[#00AA6C]">
                Final Score: {score}/{exercises.length}
              </div>
              <div className="text-gray-600">
                {score === exercises.length ? 
                  "Perfect! You've mastered CSS basics!" : 
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
        title="CSS Exercises"
        description="Practice your CSS skills with interactive exercises"
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