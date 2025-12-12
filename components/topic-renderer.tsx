'use client'

import React from 'react'
import CodeExecutor from '@/components/code-executor'
import { BookOpen, Code2 } from 'lucide-react'
import { Topic, CodeExample } from '@/lib/course-api'

interface TopicRendererProps {
  topics: Topic[]
  className?: string
}

// Helper function to render different content types
const renderTopicContent = (topic: Topic) => {
  const { content, content_type } = topic;
  
  // Convert paths to relative URLs that will be proxied by Next.js
  const getFullUrl = (path: string) => {
    console.log('Original path:', path);
    
    // Strip localhost URLs - these were saved when uploading locally
    // Convert them to relative URLs that will be proxied
    if (path.includes('localhost:8000')) {
      let storagePath = path.split('localhost:8000')[1]; // Get everything after localhost:8000
      storagePath = storagePath.replace(/^\/+/, '/'); // Remove multiple leading slashes
      console.log('Converted localhost URL to relative:', storagePath);
      return storagePath;
    }
    
    // If it's a full Heroku URL, convert to relative path
    if (path.includes('.herokuapp.com')) {
      let storagePath = path.split('.herokuapp.com')[1]; // Get path after domain
      storagePath = storagePath.replace(/^\/+/, '/'); // Remove multiple leading slashes
      console.log('Converted Heroku URL to relative:', storagePath);
      return storagePath;
    }
    
    // If it's any other full URL (external), return as-is
    if (path.startsWith('http')) {
      console.log('External URL, using as-is:', path);
      return path;
    }
    
    // Convert to relative URL for Next.js proxy
    let relativePath;
    if (path.startsWith('/storage/')) {
      relativePath = path; // Already has /storage/
    } else if (path.startsWith('storage/')) {
      relativePath = `/${path}`; // Add leading slash
    } else {
      relativePath = `/storage/${path}`; // Add /storage/ prefix
    }
    
    console.log('Generated relative URL:', relativePath);
    return relativePath;
  };

  // Generate fallback URL using our API serve-file route
  const getFallbackUrl = (path: string) => {
    // Strip localhost or Heroku URLs first
    let cleanedPath = path;
    if (path.includes('localhost:8000')) {
      cleanedPath = path.split('localhost:8000')[1];
    } else if (path.includes('.herokuapp.com')) {
      cleanedPath = path.split('.herokuapp.com')[1];
    }
    
    // Remove /storage/ prefix for the serve-file route
    const cleanPath = cleanedPath.replace(/^\/storage\//, '').replace(/^storage\//, '');
    return `/api/admin/upload/serve-file/${encodeURIComponent(cleanPath)}`;
  };

  switch (content_type) {
    case 'image':
      return (
        <div className="flex justify-center my-6">
          <img 
            src={getFullUrl(content)} 
            alt={topic.title}
            className="max-w-full h-auto rounded-lg shadow-lg border border-[var(--border)]"
            style={{ maxHeight: '500px' }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', getFullUrl(content));
            }}
            onError={(e) => {
              const currentSrc = e.currentTarget.src;
              const fallbackUrl = getFallbackUrl(content);
              
              console.error('❌ Image failed to load:', {
                originalContent: content,
                currentSrc: currentSrc,
                tryingFallback: fallbackUrl
              });
              
              // Try fallback URL if not already tried
              if (!currentSrc.includes('/api/admin/upload/serve-file/')) {
                console.log('🔄 Trying fallback URL:', fallbackUrl);
                e.currentTarget.src = fallbackUrl;
              } else {
                // If fallback also failed, show placeholder
                console.log('❌ Fallback also failed, showing placeholder');
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
              }
            }}
          />
        </div>
      );
      
    case 'video':
      return (
        <div className="flex justify-center my-6">
          <video 
            src={getFullUrl(content)} 
            controls
            className="max-w-full h-auto rounded-lg shadow-lg border border-[var(--border)]"
            style={{ maxHeight: '400px' }}
            onError={(e) => {
              const currentSrc = e.currentTarget.src;
              const fallbackUrl = getFallbackUrl(content);
              
              console.error('❌ Video failed to load:', {
                originalContent: content,
                currentSrc: currentSrc,
                tryingFallback: fallbackUrl
              });
              
              // Try fallback URL if not already tried
              if (!currentSrc.includes('/api/admin/upload/serve-file/')) {
                console.log('🔄 Trying fallback video URL:', fallbackUrl);
                e.currentTarget.src = fallbackUrl;
              }
            }}
          >
            <p className="text-red-500">Your browser does not support the video tag.</p>
          </video>
        </div>
      );
      
    case 'text':
    default:
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
  }
};

const TopicRenderer: React.FC<TopicRendererProps> = ({ topics, className = '' }) => {
  if (!topics || topics.length === 0) {
    return null
  }


  return (
    <div className={`space-y-12 ${className}`}>
      {topics.map((topic, topicIndex) => (
        <div key={topic.id} className="space-y-8">
          
          {/* Lesson Content Section */}
          <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] shadow-sm">
            {/* Topic Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  {topicIndex + 1}. {topic.title}
                </h3>
              </div>
            </div>

            {/* Topic Content */}
            {topic.content && (
              <div className="prose max-w-none text-[var(--text-primary)] leading-relaxed">
                {renderTopicContent(topic)}
              </div>
            )}
          </div>

          {/* Code Examples Section - Visually Separated */}
          {topic.codeExamples && topic.codeExamples.length > 0 && (
            <div className="space-y-6">

              {/* Code Examples */}
              <div className="space-y-6">
                {topic.codeExamples.map((codeExample, exampleIndex) => (
                  <div 
                    key={codeExample.id}
                    className=""
                  >
                    {/* Code Example Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-italic text-[var(--text-primary)]">
                          {codeExample.title && codeExample.description ? `${codeExample.title}: ${codeExample.description}` : codeExample.title || `Example ${exampleIndex + 1}`}
                        </h4>
                      </div>
                    </div>
                    
                    {/* Interactive Code Editor */}
                    <div className="">
                      <CodeExecutor
                        initialCode={codeExample.initial_code}
                        language={codeExample.language}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TopicRenderer
