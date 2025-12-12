'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Palette, Loader2 } from 'lucide-react';

export default function CSSRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the full CSS Specialist course after a short delay
    const timer = setTimeout(() => {
      router.push('/certificates/css-specialist');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Redirecting...
        </h1>
        <p className="text-gray-600 mb-4">
          Taking you to the CSS Specialist certification course
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-500">Redirecting in 2 seconds...</span>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push('/certificates/css-specialist')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Click here if not redirected automatically
          </button>
        </div>
      </Card>
    </div>
  );
}
