interface AuraBotResponse {
  success: boolean;
  response?: string;
  message_id?: string;
  remaining_attempts?: number;
  tokens_used?: number;
  retrieved_sources?: string[];
  session_info?: {
    attempt_count: number;
    max_attempts: number;
    is_blocked: boolean;
  };
  error?: string;
  blocked_until?: string;
}

interface SessionStatus {
  exists: boolean;
  can_ask: boolean;
  remaining_attempts: number;
  attempt_count: number;
  is_blocked?: boolean;
  blocked_until?: string;
  progress?: any;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: any;
}

class AuraBotAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  }

  /**
   * Ask a question to AuraBot
   */
  async askQuestion(
    sessionId: string,
    question: string,
    htmlContext?: string,
    instructionsContext?: string,
    feedbackContext?: string,
    userId?: number
  ): Promise<AuraBotResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/aurabot/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          session_id: sessionId,
          question,
          html_context: htmlContext || null,
          instructions_context: instructionsContext || null,
          feedback_context: feedbackContext || null,
          user_id: null  // Set to null for now since we don't have user auth
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      return data;

    } catch (error) {
      console.error('AuraBot API Error:', error);
      return {
        success: false,
        error: 'Failed to connect to AuraBot service. Please try again.'
      };
    }
  }

  /**
   * Get session status and remaining attempts
   */
  async getSessionStatus(sessionId: string): Promise<SessionStatus> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/aurabot/session-status?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        return await response.json();
      }

      // Return default status if API call fails
      return {
        exists: false,
        can_ask: true,
        remaining_attempts: 3,
        attempt_count: 0
      };

    } catch (error) {
      console.error('Session Status API Error:', error);
      return {
        exists: false,
        can_ask: true,
        remaining_attempts: 3,
        attempt_count: 0
      };
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(sessionId: string, limit: number = 20): Promise<ConversationMessage[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/aurabot/conversation-history?session_id=${encodeURIComponent(sessionId)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.messages || [];
      }

      return [];

    } catch (error) {
      console.error('Conversation History API Error:', error);
      return [];
    }
  }

  /**
   * Check AuraBot service health
   */
  async healthCheck(): Promise<{ success: boolean; status: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/aurabot/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      return await response.json();

    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: 'Unable to connect to AuraBot service'
      };
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get or create session ID from localStorage - ACTIVITY AND USER-SPECIFIC
   */
  getSessionId(activityId?: string, userId?: string | number): string {
    if (typeof window === 'undefined') {
      return this.generateSessionId();
    }

    // Get user ID from localStorage if not provided
    let userIdentifier = userId?.toString();
    if (!userIdentifier) {
      const userData = localStorage.getItem('auralearn_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userIdentifier = user.id?.toString();
        } catch (e) {
          console.warn('Could not parse user data for session ID');
        }
      }
    }

    // Create user and activity-specific session ID
    const sessionKey = userIdentifier 
      ? (activityId ? `aurabot_session_user_${userIdentifier}_activity_${activityId}` : `aurabot_session_user_${userIdentifier}_global`)
      : (activityId ? `aurabot_session_activity_${activityId}` : 'aurabot_session_global');
    
    const stored = localStorage.getItem(sessionKey);
    if (stored) {
      return stored;
    }

    // Generate user and activity-specific session ID
    const newSessionId = userIdentifier && activityId 
      ? `user_${userIdentifier}_activity_${activityId}_${this.generateSessionId()}`
      : activityId 
        ? `activity_${activityId}_${this.generateSessionId()}`
        : this.generateSessionId();
    
    localStorage.setItem(sessionKey, newSessionId);
    return newSessionId;
  }

  /**
   * Extract HTML context from the current page
   */
  extractHtmlContext(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // Try to find code editor content
    const codeEditors = [
      // Monaco Editor
      document.querySelector('.monaco-editor textarea'),
      // CodeMirror
      document.querySelector('.CodeMirror-code'),
      // Other common editor selectors
      document.querySelector('[class*="code-editor"] textarea'),
      document.querySelector('[class*="editor"] textarea'),
      document.querySelector('textarea[class*="code"]'),
      // Fallback to any textarea that might contain code
      ...Array.from(document.querySelectorAll('textarea')).filter(el => 
        el.value && (el.value.includes('<') || el.value.includes('html') || el.value.includes('css'))
      )
    ];

    for (const editor of codeEditors) {
      if (editor && (editor as HTMLTextAreaElement).value) {
        return (editor as HTMLTextAreaElement).value;
      }
    }

    return null;
  }

  /**
   * Extract instructions context from the current page
   */
  extractInstructionsContext(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // Try to find instructions or feedback content
    const instructionSelectors = [
      '[class*="instruction"]',
      '[class*="feedback"]',
      '[class*="hint"]',
      '[class*="objective"]',
      '[class*="requirement"]',
      '.tutorial-content',
      '.lesson-content',
      '.activity-description'
    ];

    for (const selector of instructionSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }

    return null;
  }
}

export const auraBotAPI = new AuraBotAPI();
export type { AuraBotResponse, SessionStatus, ConversationMessage };

