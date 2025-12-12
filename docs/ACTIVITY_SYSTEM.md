# Activity System Documentation

## Overview
The Activity System provides interactive coding challenges that validate both HTML structure and output results.

## Components

### ActivityContainer
A comprehensive activity interface that includes:
- **Instructions**: Step-by-step guidance
- **Code Editor**: Interactive coding environment with line numbers
- **Live Preview**: Real-time output rendering
- **Validation**: Automatic checking of code correctness
- **Hints System**: Progressive hints after failed attempts
- **Completion Tracking**: Success indicators and attempt counting

## Usage

```tsx
import ActivityContainer from '@/components/activity-container'

const activity = {
  id: 'html-hello-world',
  title: 'HTML Hello World',
  description: 'Create your first HTML page',
  instructions: [
    'Start with HTML5 DOCTYPE',
    'Add basic structure',
    'Include title and content'
  ],
  initialCode: '<!-- Starting code -->',
  expectedCode: '<!-- Expected solution -->',
  expectedOutput: 'Expected text in output',
  hints: ['Hint 1', 'Hint 2']
}

<ActivityContainer 
  activity={activity}
  onComplete={(id) => console.log('Completed:', id)}
/>
```

## Activity Definition

### Required Fields
- **id**: Unique identifier
- **title**: Activity name
- **description**: Brief description
- **instructions**: Array of step-by-step instructions
- **initialCode**: Starting HTML code
- **expectedCode**: Correct solution code
- **expectedOutput**: Text that should appear in output
- **hints**: Array of progressive hints

## Validation Logic

The system validates:
1. **HTML Structure**: Checks for required HTML elements
2. **Output Content**: Verifies expected text appears in rendered output
3. **Code Normalization**: Handles whitespace and case differences

## Features

### Progressive Hints
- Hints appear after 2+ failed attempts
- Users can cycle through available hints
- Encourages learning through guided discovery

### Visual Feedback
- Color-coded interface (purple/pink gradient)
- Completion badges and indicators
- Attempt counter for progress tracking

### Code Editor
- Line numbers with consistent alignment
- Syntax highlighting area
- Reset functionality
- Auto-save during editing

## Integration with Existing Components

### CodeExecutor Changes
- Removed "Try it Yourself" button
- Kept only "Run" functionality
- Streamlined interface for lesson examples

### Page Integration
Add both components to lesson pages:

```tsx
{/* Lesson Example */}
<CodeExecutor initialCode={example} language="html" />

{/* Interactive Activity */}
<ActivityContainer activity={activity} onComplete={handleComplete} />
```

## Styling
Uses consistent design system:
- Purple/pink gradients for activity theme
- Monospace fonts for code
- Professional line number alignment
- Responsive layout for mobile devices
