'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, Copy, Eye, Code, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeExecutorProps {
  initialCode?: string
  language: string
  onCodeChange?: (code: string) => void
}

export default function CodeExecutor({ 
  initialCode = '', 
  language,
  onCodeChange
}: CodeExecutorProps) {
  const [code, setCode] = useState(initialCode)
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor')
  const [splitView, setSplitView] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [codeErrors, setCodeErrors] = useState<Array<{
    line: number;
    column: number;
    length: number;
    message: string;
    severity: 'error' | 'warning';
    type: string;
  }>>([])
  const [showErrorPanel, setShowErrorPanel] = useState(false)
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const executeCode = async () => {
    setIsRunning(true)
    try {
      // For HTML, show the result immediately
      if (language === 'html') {
        // Basic HTML validation
        if (code.trim() === '') {
          alert('Please enter some HTML code to run.')
          setIsRunning(false)
          return
        }
        setTimeout(() => {
          setIsRunning(false)
          setActiveTab('output')
        }, 300)
      } else {
        // For other languages, simulate execution
        setTimeout(() => {
          setIsRunning(false)
          setActiveTab('output')
        }, 500)
      }
    } catch (error) {
      console.error('Error executing code:', error)
      alert('An error occurred while running the code. Please try again.')
      setIsRunning(false)
    }
  }



  const resetCode = () => {
    setCode(initialCode)
    onCodeChange?.(initialCode)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // Optional: Add visual feedback
      alert('Code copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy code:', error)
      alert('Failed to copy code. Please try again.')
    }
  }

  const handleCodeChange = (value: string) => {
    setCode(value)
    onCodeChange?.(value)
    // Check for errors in real-time
    if (language === 'html') {
      const errors = validateCodeForErrors(value)
      setCodeErrors(errors)
      setShowErrorPanel(errors.length > 0 && errors.some(e => e.type === 'syntax-error' || e.type === 'unclosed-tag'))
    }
  }

  // Real-time error checking when code changes
  useEffect(() => {
    if (code && language === 'html') {
      const errors = validateCodeForErrors(code)
      setCodeErrors(errors)
      setShowErrorPanel(errors.length > 0 && errors.some(e => e.type === 'syntax-error' || e.type === 'unclosed-tag'))
    }
  }, [code, language])

  // Comprehensive error validation function - ONLY for actual HTML syntax errors
  const validateCodeForErrors = (userCode: string) => {
    const errors: Array<{
      line: number;
      column: number;
      length: number;
      message: string;
      severity: 'error' | 'warning';
      type: string;
    }> = []

    const lines = userCode.split('\n')

    // Only check for ACTUAL syntax errors, not missing elements
    lines.forEach((line, lineIndex) => {
      // Check for malformed tags (missing closing >)
      const malformedTags = line.match(/<[^>]*$/g)
      if (malformedTags) {
        malformedTags.forEach(tag => {
          const column = line.indexOf(tag)
          errors.push({
            line: lineIndex + 1,
            column,
            length: tag.length,
            message: 'Malformed HTML tag - missing closing >',
            severity: 'error',
            type: 'syntax-error'
          })
        })
      }

      // Check for invalid nested < characters in tags
      const invalidTags = line.match(/<[^>]*<[^>]*>/g)
      if (invalidTags) {
        invalidTags.forEach(tag => {
          const column = line.indexOf(tag)
          errors.push({
            line: lineIndex + 1,
            column,
            length: tag.length,
            message: 'Invalid nested < character in HTML tag',
            severity: 'error',
            type: 'syntax-error'
          })
        })
      }

      // Check for unmatched quotes in attributes
      const tagMatches = line.match(/<[^>]+>/g) || []
      tagMatches.forEach(tag => {
        const singleQuotes = (tag.match(/'/g) || []).length
        const doubleQuotes = (tag.match(/"/g) || []).length
        
        if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
          const column = line.indexOf(tag)
          errors.push({
            line: lineIndex + 1,
            column,
            length: tag.length,
            message: 'Unmatched quotes in HTML attribute',
            severity: 'error',
            type: 'syntax-error'
          })
        }
      })

      // Check for obvious typos in common tags
      const commonTagTypos = [
        { wrong: '<htlm>', correct: '<html>' },
        { wrong: '<haed>', correct: '<head>' },
        { wrong: '<boyd>', correct: '<body>' },
        { wrong: '<titl>', correct: '<title>' },
        { wrong: '<mta>', correct: '<meta>' }
      ]

      commonTagTypos.forEach(typo => {
        if (line.toLowerCase().includes(typo.wrong)) {
          const column = line.toLowerCase().indexOf(typo.wrong)
          errors.push({
            line: lineIndex + 1,
            column,
            length: typo.wrong.length,
            message: `Possible typo: "${typo.wrong}" should be "${typo.correct}"`,
            severity: 'error',
            type: 'typo'
          })
        }
      })
    })

    // Check for basic unclosed tags (only obvious ones)
    const criticalTags = ['html', 'head', 'body', 'title']
    criticalTags.forEach(tagName => {
      const openTag = `<${tagName}`
      const closeTag = `</${tagName}>`
      const lowerCode = userCode.toLowerCase()
      
      if (lowerCode.includes(openTag) && !lowerCode.includes(closeTag)) {
        // Find the line with the opening tag
        const lineIndex = lines.findIndex(line => line.toLowerCase().includes(openTag))
        if (lineIndex !== -1) {
          const column = lines[lineIndex].toLowerCase().indexOf(openTag)
          errors.push({
            line: lineIndex + 1,
            column,
            length: openTag.length + 1,
            message: `Missing closing tag </${tagName}>`,
            severity: 'error',
            type: 'unclosed-tag'
          })
        }
      }
    })

    return errors
  }

  const jumpToLine = (line: number) => {
    setSelectedLine(line)
    const ta = textAreaRef.current
    if (!ta) return
    const lines = ta.value.split('\n')
    let pos = 0
    for (let i = 0; i < Math.max(0, line - 1); i++) pos += lines[i].length + 1
    ta.focus()
    ta.setSelectionRange(pos, pos)
  }

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollOffset(e.currentTarget.scrollTop)
  }

  return (
    <div className="w-full bg-[var(--surface)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden"> 
      {/* Header with macOS-style buttons and title */}
      <div className="bg-[var(--surface-hover)] border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Try it Yourself</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCode}
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Only show when not in split view */}
      {!splitView && (
        <div className="bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="flex">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'editor'
                  ? 'border-green-500 text-green-600 bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              Code Editor
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'output'
                  ? 'border-green-500 text-green-600 bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Result
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="relative">
        {splitView ? (
          /* Split View - Editor and Result side by side */
          <div className="flex">
            {/* Left Side - Code Editor */}
            <div className="w-1/2 bg-[var(--surface)] border-r border-[var(--border)]">
              <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                  {language.toUpperCase()} Editor
                </span>
              </div>
              <div className="relative code-editor-container">
                <textarea
                  ref={textAreaRef}
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  onScroll={handleScroll}
                  className="w-full h-96 font-mono text-sm bg-[var(--surface)] text-[var(--text-primary)] border-none outline-none resize-none code-textarea"
                  style={{
                    lineHeight: '1.5rem',
                    tabSize: 2,
                    paddingLeft: '3.5rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    paddingRight: '1rem'
                  }}
                  spellCheck={false}
                />
                {/* Line Numbers with error indicators */}
                <div className="absolute left-0 top-0 h-full w-12 bg-[var(--surface)] border-r border-[var(--border)] overflow-hidden">
                  <div 
                    className="font-mono text-sm text-[var(--text-tertiary)] line-numbers-container"
                    style={{
                      transform: `translateY(-${scrollOffset}px)`,
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.5rem'
                    }}
                  >
                    {code.split('\n').map((_, index) => {
                      const lineNum = index + 1
                      const hasError = codeErrors.some(e => e.line === lineNum)
                      const isSelected = selectedLine === lineNum
                      const errorForLine = codeErrors.find(e => e.line === lineNum)
                      const errorMessage = errorForLine?.message || ''
                      return (
                        <div 
                          key={index} 
                          className={`relative text-right select-none cursor-pointer line-number-item ${
                            hasError ? 'text-red-600 hover:font-semibold' : 'text-[var(--text-tertiary)]'
                          } ${isSelected ? 'bg-red-50 rounded-sm' : ''}`}
                          onClick={() => hasError && jumpToLine(lineNum)}
                          title={hasError ? errorMessage : ''}
                          style={{
                            height: '1.5rem',
                            lineHeight: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            position: 'relative'
                          }}
                        >
                          {hasError && (
                            <span className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {index + 1}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Result */}
            <div className="w-1/2 bg-[var(--surface)]">
              <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                  Output Result
                </span>
                <span className="text-xs text-[var(--text-secondary)]">Live Preview</span>
              </div>
              <div className="h-96 bg-[var(--surface)]">
                {language === 'html' ? (
                  <iframe
                    srcDoc={
                      code?.includes('<head>') 
                        ? code.replace('<head>', `<head>
                            <base href="about:blank" target="_self">
                            <script>
                              document.addEventListener('DOMContentLoaded', function() {
                                document.addEventListener('click', function(e) {
                                  const target = e.target.closest('a[href^="#"]');
                                  if (target) {
                                    e.preventDefault();
                                    const hash = target.getAttribute('href').substring(1);
                                    const element = document.getElementById(hash);
                                    if (element) {
                                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }
                                });
                              });
                            </script>`)
                        : code
                    }
                    className="w-full h-full border-none"
                    title="HTML Output"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 h-full">
                      <div className="text-sm text-[var(--text-secondary)] mb-2">Code Preview:</div>
                      <pre className="text-xs text-[var(--text-primary)] font-mono whitespace-pre-wrap overflow-auto">
                        {code || 'No code to display'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Single View - Tab based */
          activeTab === 'editor' ? (
            /* Code Editor Panel */
            <div className="bg-[var(--surface)]">
              <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                  {language.toUpperCase()} Editor
                </span>
              </div>
              {/* Error Banner */}
              {language === 'html' && codeErrors.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-200 bg-white">
                  <div className="flex items-start gap-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">
                        {codeErrors.filter(e=>e.severity==='error').length} errors, 
                        {codeErrors.filter(e=>e.severity==='warning').length} warnings
                      </div>
                      <div className="mt-1 max-h-20 overflow-auto pr-2 text-xs text-red-700">
                        {codeErrors.slice(0, 3).map((err, idx) => (
                          <div key={idx} className="cursor-pointer hover:underline" onClick={() => jumpToLine(err.line)}>
                            Line {err.line}: {err.message}
                          </div>
                        ))}
                        {codeErrors.length > 3 && (
                          <div className="text-red-500 mt-1">...and {codeErrors.length - 3} more errors</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="relative code-editor-container">
                <textarea
                  ref={textAreaRef}
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  onScroll={handleScroll}
                  className="w-full h-96 font-mono text-sm bg-[var(--surface)] text-[var(--text-primary)] border-none outline-none resize-none code-textarea"
                  style={{
                    lineHeight: '1.5rem',
                    tabSize: 2,
                    paddingLeft: '3.5rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    paddingRight: '1rem'
                  }}
                  spellCheck={false}
                />
                {/* Line Numbers with error indicators */}
                <div className="absolute left-0 top-0 h-full w-12 bg-[var(--surface)] border-r border-[var(--border)] overflow-hidden">
                  <div 
                    className="font-mono text-sm text-[var(--text-tertiary)] line-numbers-container"
                    style={{
                      transform: `translateY(-${scrollOffset}px)`,
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      lineHeight: '1.5rem'
                    }}
                  >
                    {code.split('\n').map((_, index) => {
                      const lineNum = index + 1
                      const hasError = codeErrors.some(e => e.line === lineNum)
                      const isSelected = selectedLine === lineNum
                      const errorForLine = codeErrors.find(e => e.line === lineNum)
                      const errorMessage = errorForLine?.message || ''
                      return (
                        <div 
                          key={index} 
                          className={`relative text-right select-none cursor-pointer line-number-item ${
                            hasError ? 'text-red-600 hover:font-semibold' : 'text-[var(--text-tertiary)]'
                          } ${isSelected ? 'bg-red-50 rounded-sm' : ''}`}
                          onClick={() => hasError && jumpToLine(lineNum)}
                          title={hasError ? errorMessage : ''}
                          style={{
                            height: '1.5rem',
                            lineHeight: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            position: 'relative'
                          }}
                        >
                          {hasError && (
                            <span className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {index + 1}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Output Panel */
            <div className="bg-[var(--surface)]">
              <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                  Output Result
                </span>
                <span className="text-xs text-[var(--text-secondary)]">Live Preview</span>
              </div>
              <div className="h-96 bg-[var(--surface)]">
                {language === 'html' ? (
                  <iframe
                    srcDoc={
                      code?.includes('<head>') 
                        ? code.replace('<head>', `<head>
                            <base href="about:blank" target="_self">
                            <script>
                              document.addEventListener('DOMContentLoaded', function() {
                                document.addEventListener('click', function(e) {
                                  const target = e.target.closest('a[href^="#"]');
                                  if (target) {
                                    e.preventDefault();
                                    const hash = target.getAttribute('href').substring(1);
                                    const element = document.getElementById(hash);
                                    if (element) {
                                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }
                                });
                              });
                            </script>`)
                        : code
                    }
                    className="w-full h-full border-none"
                    title="HTML Output"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock allow-presentation"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 h-full">
                      <div className="text-sm text-[var(--text-secondary)] mb-2">Code Preview:</div>
                      <pre className="text-xs text-[var(--text-primary)] font-mono whitespace-pre-wrap overflow-auto">
                        {code || 'No code to display'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Bottom Action Bar with Run button only */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center justify-end">
          <Button
            onClick={executeCode}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-8 py-2 font-medium rounded-md transition-colors shadow-sm"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2 fill-current" />
                Run »
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


