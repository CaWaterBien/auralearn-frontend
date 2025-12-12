"use client";

import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: number | string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language = 'html', 
  height = 400,
  readOnly = false 
}) => {
  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
      <div style={{ 
        padding: '8px 12px', 
        background: '#f5f5f5', 
        borderBottom: '1px solid #d9d9d9',
        fontSize: 12,
        color: '#666'
      }}>
        {language.toUpperCase()} Editor
      </div>
      <TextArea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ 
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: 14,
          border: 'none',
          borderRadius: 0,
          resize: 'vertical'
        }}
        rows={typeof height === 'number' ? Math.floor(height / 24) : 15}
        readOnly={readOnly}
        placeholder={`Enter ${language} code here...`}
      />
    </div>
  );
};

export default CodeEditor;
