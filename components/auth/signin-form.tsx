'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast-notifications';
import ForgotPasswordModal from './forgot-password-modal';

interface SignInFormProps {
  onToggleForm: () => void;
}

export default function SignInForm({ onToggleForm }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await signIn(formData.email, formData.password);
      if (success) {
        // Show success toast
        showToast({
          title: 'Welcome back!',
          message: 'Successfully signed in to your account',
          type: 'success',
          duration: 3000
        });
        // Redirect to home page after successful sign in
        router.push('/');
      } else {
        // Show error toast for invalid credentials
        showToast({
          title: 'Invalid Password',
          message: 'The email or password you entered is incorrect. Please check and try again.',
          type: 'error',
          duration: 6000
        });
        setError('Invalid email or password. Please try creating an account first or contact support.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      // Show error toast for system errors
      showToast({
        title: 'Sign In Failed',
        message: err?.message || 'An error occurred during sign in. Please try again.',
        type: 'error',
        duration: 6000
      });
      setError(err?.message || 'An error occurred during sign in. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-none border-0 bg-transparent">
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-700 uppercase tracking-wide">
          User Login
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 whitespace-pre-line">
              {error}
            </div>
          </div>
        )}

        {/* Welcome Info */}


        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-12 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg text-sm"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-12 pr-12 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-500 focus:ring-purple-400 w-4 h-4"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onToggleForm}
              className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </CardContent>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </Card>
  );
} 