'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeExampleProps {
  code: string
  language: string
}

export default function CodeExample({ code, language }: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlightCode = (codeStr: string, lang: string) => {
    if (lang === 'html') {
      return codeStr
        .replace(/(&lt;!DOCTYPE[^&]*&gt;)/g, '<span style="color: #9929EA;">$1</span>')
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span style="color: #CC66DA;">$2</span>')
        .replace(/(&gt;)/g, '<span style="color: #CC66DA;">$1</span>')
    }
    return codeStr
  }

  return (
    <div className="relative bg-gray-50 border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
        <span className="text-sm font-medium text-gray-600">
          {language.toUpperCase()} Example
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code
          dangerouslySetInnerHTML={{
            __html: highlightCode(
              code
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;'),
              language
            )
          }}
        />
      </pre>
    </div>
  )
}


