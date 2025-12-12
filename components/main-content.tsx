
import { Card as AntCard, Progress, Badge } from 'antd'
import { BookOpen, Trophy, Code, Clock } from 'lucide-react'

export default function MainContent() {
  return (
    <main className="flex-1 space-y-6">
      {/* Enhanced Learning Journey Card */}
             <AntCard 
         className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-[#9929EA]"
         styles={{ body: { padding: '24px' } }}
       >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#9929EA] bg-opacity-10 rounded-lg">
              <BookOpen className="h-6 w-6 text-[#9929EA]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Learning Journey</h2>
          </div>
          <Badge 
            count={3} 
            style={{ 
              backgroundColor: '#00AA6C',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </div>

        {/* Overall Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-900">Overall Progress</span>
            <span className="text-2xl font-bold text-[#9929EA]">45%</span>
          </div>
                     <Progress 
             percent={45} 
             strokeColor={{
               '0%': '#9929EA',
               '100%': '#CC66DA',
             }}
             trailColor="#f0f0f0"
             size={8}
             className="mb-2"
           />
          <div className="text-sm text-gray-700 font-medium">Keep going! You&apos;re doing great.</div>
        </div>

        {/* Learning Path */}
        <div className="space-y-4">
          {/* HTML Fundamentals - Completed */}
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-[#00AA6C] rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-1 bg-[#00AA6C] text-white text-xs font-semibold rounded-full">
                    Completed
                  </span>
                  <span className="font-semibold text-gray-900">HTML Fundamentals</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Learn the structure of web pages</p>
              </div>
            </div>
            <Trophy className="h-5 w-5 text-[#00AA6C]" />
          </div>

          {/* CSS Styling - In Progress */}
          <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-8 h-8 bg-[#9929EA] rounded-full flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-1 bg-[#9929EA] text-white text-xs font-semibold rounded-full">
                    In Progress
                  </span>
                  <span className="font-semibold text-gray-900">CSS Styling</span>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">Make your pages beautiful</p>
                <div className="flex items-center space-x-2">
                  <Progress 
                    percent={60} 
                    size="small" 
                    strokeColor="#9929EA"
                    className="flex-1 max-w-xs"
                  />
                  <span className="text-sm font-medium text-[#9929EA]">60%</span>
                </div>
              </div>
            </div>
            <Code className="h-5 w-5 text-[#9929EA]" />
          </div>

          {/* Responsive Design - Locked */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                    Locked
                  </span>
                  <span className="font-semibold text-gray-600">Responsive Design</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Create mobile-friendly layouts</p>
              </div>
            </div>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </AntCard>


    </main>
  )
}


