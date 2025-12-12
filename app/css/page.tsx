import Header from '@/components/header'
import TutorialLayout from '@/components/tutorial-layout'
import CodeExample from '@/components/code-example'
import CodeExecutor from '@/components/code-executor'
import HTMLCSSLearningCompanion from '@/components/html-css-learning-companion'
import FloatingChatbot from '@/components/floating-chatbot'
import { Button } from '@/components/ui/button'

export default function CSSTutorial() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <TutorialLayout
        title="CSS Tutorial"
        description="CSS is the language we use to style an HTML document."
        currentTopic="CSS Introduction"
        topics={[
          'CSS Introduction',
          'CSS Syntax',
          'CSS Selectors',
          'CSS Colors',
          'CSS Backgrounds',
          'CSS Borders',
          'CSS Margins',
          'CSS Padding',
          'CSS Height/Width',
          'CSS Box Model',
          'CSS Text',
          'CSS Fonts',
          'CSS Display',
          'CSS Position',
          'CSS Flexbox',
          'CSS Grid',
          'CSS Responsive'
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Middle Content Area - Tutorial Content */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-2xl font-bold text-[#9929EA] mb-4">What is CSS?</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• CSS stands for Cascading Style Sheets</li>
                <li>• CSS describes how HTML elements are displayed</li>
                <li>• CSS saves time - it can control multiple web pages at once</li>
                <li>• CSS controls colors, fonts, layouts, and spacing</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#9929EA] mb-4">Try CSS Styling - Interactive Editor</h2>
              <CodeExecutor
                initialCode={`/* CSS Styles */
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

h1 {
  color: #9929EA;
  text-align: center;
  font-size: 2em;
}

p {
  color: #333;
  font-size: 16px;
  line-height: 1.5;
}

.highlight {
  background-color: #FAEB92;
  padding: 10px;
  border-radius: 5px;
}`}
                language="css"
              />
              
              {/* Try it Yourself button below the code editor */}
              <div className="mt-6 text-center">
                <Button className="bg-[#00AA6C] hover:bg-[#008A5A] text-white text-lg px-8 py-3">
                  Try it Yourself »
                </Button>
              </div>
            </div>

            <div className="bg-[#FAEB92] p-4 rounded-lg">
              <h3 className="font-bold text-[#9929EA] mb-2">CSS Explained</h3>
              <ul className="space-y-1 text-[#9929EA] text-sm">
                <li>• <strong>Selectors</strong> target HTML elements (body, h1, p, .highlight)</li>
                <li>• <strong>Properties</strong> define what to style (color, font-size, background)</li>
                <li>• <strong>Values</strong> specify how to style (colors, sizes, fonts)</li>
                <li>• <strong>Classes</strong> (.highlight) can be applied to any HTML element</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#9929EA] mb-4">HTML + CSS Example</h2>
              <CodeExample
                code={`<!DOCTYPE html>
<html>
<head>
<style>
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}
h1 {
  color: #9929EA;
  text-align: center;
}
p {
  color: #333;
  padding: 20px;
}
</style>
</head>
<body>

<h1>My Styled Page</h1>
<p>This paragraph is styled with CSS!</p>

</body>
</html>`}
                language="html"
              />
            </div>
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


