'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Alert, Switch, Tabs, Space, Typography } from 'antd';
import { FullscreenOutlined, ReloadOutlined, EyeOutlined, CodeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HtmlOutputComparisonProps {
  expectedHtml?: string;
  actualHtml: string;
  expectedOutput?: string;
  submissionId: string;
  showDifferences?: boolean;
}

export default function HtmlOutputComparison({ 
  expectedHtml = '', 
  actualHtml, 
  expectedOutput = '',
  submissionId,
  showDifferences = true 
}: HtmlOutputComparisonProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'diff'>('side-by-side');
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const expectedRef = useRef<HTMLIFrameElement>(null);
  const actualRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sanitizeHtml = (html: string) => {
    // Basic HTML sanitization for security
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  };

  const renderHtmlInIframe = (html: string, ref: React.RefObject<HTMLIFrameElement | null>) => {
    if (ref.current) {
      const doc = ref.current.contentDocument || ref.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(sanitizeHtml(html));
        doc.close();
      }
    }
  };

  const refreshPreviews = () => {
    renderHtmlInIframe(expectedHtml || expectedOutput, expectedRef);
    renderHtmlInIframe(actualHtml, actualRef);
  };

  useEffect(() => {
    // Small delay to ensure iframes are ready
    const timer = setTimeout(refreshPreviews, 100);
    return () => clearTimeout(timer);
  }, [expectedHtml, actualHtml, expectedOutput]);

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const calculateSimilarity = (html1: string, html2: string) => {
    // Simple text-based similarity calculation
    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
    const norm1 = normalize(html1);
    const norm2 = normalize(html2);
    
    if (norm1 === norm2) return 100;
    if (!norm1 || !norm2) return 0;
    
    const longer = norm1.length > norm2.length ? norm1 : norm2;
    const shorter = norm1.length > norm2.length ? norm2 : norm1;
    const editDistance = levenshteinDistance(longer, shorter);
    
    return Math.round(((longer.length - editDistance) / longer.length) * 100);
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array.from({ length: str2.length + 1 }, (_, i) => [i]);
    Array.from({ length: str1.length + 1 }, (_, i) => (matrix[0][i] = i));

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const highlightDifferences = (html1: string, html2: string) => {
    // Simple diff highlighting (for demonstration)
    const lines1 = html1.split('\n');
    const lines2 = html2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        diff.push({
          lineNumber: i + 1,
          expected: line1,
          actual: line2,
          type: !line1 ? 'added' : !line2 ? 'removed' : 'modified'
        });
      }
    }
    
    return diff;
  };

  const similarity = calculateSimilarity(expectedHtml || expectedOutput, actualHtml);
  const differences = highlightDifferences(expectedHtml || expectedOutput, actualHtml);

  return (
    <div ref={containerRef} className={`html-comparison-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>HTML Output Comparison - Submission #{submissionId}</span>
            <Space>
              <Text type={similarity >= 90 ? 'success' : similarity >= 70 ? 'warning' : 'danger'}>
                Similarity: {similarity}%
              </Text>
              <Switch
                checkedChildren={<CodeOutlined />}
                unCheckedChildren={<EyeOutlined />}
                checked={showCode}
                onChange={setShowCode}
              />
              <Button icon={<ReloadOutlined />} onClick={refreshPreviews} size="small">
                Refresh
              </Button>
              <Button 
                icon={<FullscreenOutlined />} 
                onClick={toggleFullscreen} 
                size="small"
              >
                Fullscreen
              </Button>
            </Space>
          </div>
        }
        className="w-full"
      >
        {showDifferences && differences.length > 0 && (
          <Alert
            message={`${differences.length} differences found`}
            description={
              <div className="max-h-32 overflow-y-auto">
                {differences.slice(0, 3).map((diff, idx) => (
                  <div key={idx} className="text-sm">
                    Line {diff.lineNumber}: 
                    <span className={`ml-2 ${
                      diff.type === 'added' ? 'text-green-600' : 
                      diff.type === 'removed' ? 'text-red-600' : 
                      'text-orange-600'
                    }`}>
                      {diff.type} content
                    </span>
                  </div>
                ))}
                {differences.length > 3 && (
                  <div className="text-sm text-gray-500">
                    ... and {differences.length - 3} more differences
                  </div>
                )}
              </div>
            }
            type={similarity >= 90 ? 'success' : similarity >= 70 ? 'warning' : 'error'}
            className="mb-4"
          />
        )}

        <Tabs 
          defaultActiveKey={viewMode} 
          onChange={(key) => setViewMode(key as any)}
          items={[
            {
              key: 'side-by-side',
              label: 'Side by Side',
              children: (
                <div className="grid grid-cols-2 gap-4 h-96">
                  <div>
                    <Title level={5}>Expected Output</Title>
                    {showCode ? (
                      <div className="h-80 border rounded p-2 overflow-auto bg-gray-50">
                        <pre className="text-sm whitespace-pre-wrap">
                          <code>{expectedHtml || expectedOutput || 'No expected HTML provided'}</code>
                        </pre>
                      </div>
                    ) : (
                      <iframe
                        ref={expectedRef}
                        className="w-full h-80 border rounded"
                        title="Expected Output"
                        sandbox="allow-same-origin"
                      />
                    )}
                  </div>
                  <div>
                    <Title level={5}>Student Submission</Title>
                    {showCode ? (
                      <div className="h-80 border rounded p-2 overflow-auto bg-gray-50">
                        <pre className="text-sm whitespace-pre-wrap">
                          <code>{actualHtml}</code>
                        </pre>
                      </div>
                    ) : (
                      <iframe
                        ref={actualRef}
                        className="w-full h-80 border rounded"
                        title="Student Submission"
                        sandbox="allow-same-origin"
                      />
                    )}
                  </div>
                </div>
              )
            },
            {
              key: 'overlay',
              label: 'Overlay',
              children: (
                <div className="relative h-96">
                  <div className="absolute inset-0">
                    <Title level={5}>Expected Output (Background)</Title>
                    <iframe
                      ref={expectedRef}
                      className="w-full h-80 border rounded opacity-50"
                      title="Expected Output"
                      sandbox="allow-same-origin"
                    />
                  </div>
                  <div className="absolute inset-0 top-8">
                    <iframe
                      ref={actualRef}
                      className="w-full h-80 border rounded border-red-500"
                      title="Student Submission"
                      sandbox="allow-same-origin"
                      style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                    />
                  </div>
                </div>
              )
            },
            {
              key: 'diff',
              label: 'Differences',
              children: (
                <div className="max-h-96 overflow-y-auto">
                  {differences.length === 0 ? (
                    <Alert 
                      message="No differences found!" 
                      type="success" 
                      description="The student submission matches the expected output exactly."
                    />
                  ) : (
                    <div className="space-y-2">
                      {differences.map((diff, idx) => (
                        <Card key={idx} size="small" className={`
                          ${diff.type === 'added' ? 'border-green-400' : 
                            diff.type === 'removed' ? 'border-red-400' : 
                            'border-orange-400'}
                        `}>
                          <div className="flex justify-between items-start">
                            <span className="font-medium">Line {diff.lineNumber}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              diff.type === 'added' ? 'bg-green-100 text-green-700' :
                              diff.type === 'removed' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {diff.type}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {diff.expected && (
                              <div>
                                <Text strong>Expected: </Text>
                                <Text code className="bg-red-50">{diff.expected}</Text>
                              </div>
                            )}
                            {diff.actual && (
                              <div>
                                <Text strong>Actual: </Text>
                                <Text code className="bg-green-50">{diff.actual}</Text>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
          ]}
        />
      </Card>

      <style jsx>{`
        .html-comparison-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          background: white;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
