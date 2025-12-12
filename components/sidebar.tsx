'use client'

import { useState } from 'react'
import { Plus, Calendar, CheckSquare, BarChart3 } from 'lucide-react'

import AnalyticsWidget from './analytics-widget'
import { Calendar as AntCalendar, Card as AntCard, List, Input, Space, Badge, Divider, Avatar, Button as AntButton, Checkbox as AntCheckbox } from 'antd'
import type { CalendarProps } from 'antd'
import dayjs from 'dayjs'

export default function Sidebar() {
  const [todos, setTodos] = useState([
    { id: 1, text: '1 assessments due', completed: true }
  ])
  const [newTodo, setNewTodo] = useState('')


  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: todos.length + 1, text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const onPanelChange: CalendarProps<dayjs.Dayjs>['onPanelChange'] = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <aside className="w-full lg:w-64 space-y-4">
      {/* Enhanced Learning Analytics */}
      <AntCard
        title={
          <Space>
            <BarChart3 className="h-5 w-5 text-[#9929EA]" />
            <span className="font-semibold text-[#9929EA]">Learning Analytics</span>
          </Space>
        }
        className="shadow-sm hover:shadow-md transition-shadow duration-200"
        styles={{ body: { padding: '16px' } }}
      >
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-[#00AA6C]">7</div>
            <div className="text-xs text-gray-700 font-medium">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-[#9929EA]">1,250</div>
            <div className="text-xs text-gray-700 font-medium">XP Points</div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">Today&apos;s Progress</span>
            <span className="text-sm font-bold text-[#9929EA]">0m</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#9929EA] to-[#CC66DA] h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="text-center py-2">
          <div className="inline-flex items-center justify-center relative">
            <Avatar size={48} style={{ backgroundColor: '#9929EA', fontSize: '20px' }}>
              🏆
            </Avatar>
            <Badge 
              count="New!" 
              style={{ 
                backgroundColor: '#FAEB92', 
                color: '#000', 
                fontSize: '10px',
                fontWeight: 'bold'
              }}
              offset={[8, -8]}
            />
          </div>
          <div className="text-sm font-medium text-gray-800 mt-2">Achievement Unlocked!</div>
          <div className="text-xs text-gray-600 font-medium">HTML Basics Master</div>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* View Full Analytics Button */}
        <AntButton 
          type="primary" 
          block
          style={{
            backgroundColor: '#9929EA',
            borderColor: '#9929EA',
            height: '36px',
            fontWeight: '500'
          }}
          className="shadow-sm hover:shadow-md transition-all duration-200"
        >
          View Full Analytics
        </AntButton>
      </AntCard>

      {/* Original Analytics Widget for Modal */}
      <div style={{ display: 'none' }}>
        <AnalyticsWidget />
      </div>

      {/* Enhanced Calendar */}
      <AntCard
        title={
          <Space>
            <Calendar className="h-5 w-5 text-[#9929EA]" />
            <span className="font-semibold text-[#9929EA]">Calendar</span>
          </Space>
        }
        className="shadow-sm hover:shadow-md transition-shadow duration-200"
        styles={{ body: { padding: '12px' } }}
      >
        <AntCalendar
          fullscreen={false}
          onPanelChange={onPanelChange}
          style={{ 
            fontSize: '12px',
          }}
          className="compact-calendar"
        />
        <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
          <AntButton type="link" size="small" className="text-[#9929EA] p-0 h-auto">
            full calendar
          </AntButton>
          <AntButton type="link" size="small" className="text-gray-700 p-0 h-auto font-medium">
            hide
          </AntButton>
        </div>
      </AntCard>

      {/* Enhanced Todo List */}
      <AntCard
        title={
          <Space>
            <CheckSquare className="h-5 w-5 text-[#9929EA]" />
            <span className="font-semibold text-[#9929EA]">Todo List</span>
            <Badge 
              count={todos.filter(t => !t.completed).length} 
              size="small" 
              style={{ backgroundColor: '#00AA6C' }}
            />
          </Space>
        }
        className="shadow-sm hover:shadow-md transition-shadow duration-200"
        styles={{ body: { padding: '16px' } }}
      >
        <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
          <Input
            placeholder="Add new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onPressEnter={addTodo}
            style={{ 
              borderColor: '#d1d5db',
              borderRadius: '6px 0 0 6px'
            }}
          />
          <AntButton 
            type="primary" 
            onClick={addTodo} 
            style={{ 
              backgroundColor: '#9929EA',
              borderColor: '#9929EA',
              borderRadius: '0 6px 6px 0'
            }}
          >
            <Plus className="h-4 w-4" />
          </AntButton>
        </Space.Compact>
        
        <List
          size="small"
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item
              className="hover:bg-gray-50 rounded-lg transition-colors duration-200"
              style={{ 
                padding: '8px 12px',
                margin: '4px 0',
                border: '1px solid transparent',
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1
              }}
              actions={[
                <AntCheckbox
                  key="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ 
                    color: todo.completed ? '#00AA6C' : '#9929EA'
                  }}
                />
              ]}
            >
              <span className={`${todo.completed ? 'text-gray-600' : 'text-gray-900'} font-medium`}>
                {todo.text}
              </span>
            </List.Item>
          )}
        />
      </AntCard>




    </aside>
  )
}


