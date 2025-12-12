'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, Check, UserPlus, AlertCircle, X, FileText, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SignUpFormProps {
  onToggleForm: () => void;
}

export default function SignUpForm({ onToggleForm }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) setError('');

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      setError('Please create a stronger password');
      return;
    }

    try {
      const success = await signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        // Redirect to home page after successful sign up
        router.push('/');
      } else {
        setError('An account with this email already exists. Please sign in instead.');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err?.message || 'An error occurred during account creation. Please try again.');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-none border-0 bg-transparent">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-700 uppercase tracking-wide">
            Create Account
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-12 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg text-sm"
                  required
                />
              </div>

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

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Check className={`h-3 w-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className={`h-3 w-3 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>One uppercase letter</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className={`h-3 w-3 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>One number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-12 pr-12 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-gray-300 text-purple-500 focus:ring-purple-400 w-4 h-4"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-purple-500 hover:text-purple-600 font-medium underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPrivacyModal(true);
                  }}
                  className="text-purple-500 hover:text-purple-600 font-medium underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide"
              disabled={loading || formData.password !== formData.confirmPassword}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onToggleForm}
                className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Terms of Service</h2>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-white/90 text-sm">Last updated: November 9, 2025</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                <p className="text-sm leading-relaxed">
                  By accessing and using AuraLearn ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Description of Service</h3>
                <p className="text-sm leading-relaxed mb-2">
                  AuraLearn provides an interactive HTML5 learning platform with the following features:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Interactive tutorials and coding exercises</li>
                  <li>AI-powered learning assistance (AuraBot)</li>
                  <li>Real-time code validation and feedback</li>
                  <li>Progress tracking and certificates</li>
                  <li>Community features and project showcases</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. User Accounts</h3>
                <p className="text-sm leading-relaxed mb-2">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. User Conduct</h3>
                <p className="text-sm leading-relaxed mb-2">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe upon intellectual property rights</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to access the platform without permission</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Intellectual Property</h3>
                <p className="text-sm leading-relaxed">
                  All content on AuraLearn, including but not limited to text, graphics, logos, code examples, and software, is the property of AuraLearn or its content suppliers and protected by intellectual property laws. Your use of the platform does not grant you ownership of any content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">6. User-Generated Content</h3>
                <p className="text-sm leading-relaxed">
                  By submitting content (code, projects, comments), you grant AuraLearn a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content for platform operations and improvements. You retain ownership of your content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">7. AI Services</h3>
                <p className="text-sm leading-relaxed">
                  Our AuraBot AI assistant is provided for educational purposes. While we strive for accuracy, AI-generated content may contain errors. Always verify critical information and use the AI as a learning aid, not as definitive guidance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed">
                  AuraLearn shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. Our total liability shall not exceed the amount you paid us in the past 12 months.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">9. Modifications to Service</h3>
                <p className="text-sm leading-relaxed">
                  We reserve the right to modify or discontinue the service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">10. Termination</h3>
                <p className="text-sm leading-relaxed">
                  We may terminate or suspend your account and access to the platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">11. Contact Information</h3>
                <p className="text-sm leading-relaxed">
                  For questions about these Terms of Service, please contact us at:{' '}
                  <a href="mailto:support@auralearn.com" className="text-purple-500 hover:text-purple-600 font-medium">
                    support@auralearn.com
                  </a>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Privacy Policy</h2>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-white/90 text-sm">Last updated: November 9, 2025</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6 text-gray-700">
              <div>
                <p className="text-sm leading-relaxed mb-4">
                  At AuraLearn, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
                <p className="text-sm leading-relaxed mb-2">
                  <strong>Personal Information:</strong> We collect information you provide directly:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4 mb-3">
                  <li>Name and email address</li>
                  <li>Account credentials (encrypted passwords)</li>
                  <li>Profile information and preferences</li>
                  <li>Learning progress and achievements</li>
                </ul>
                <p className="text-sm leading-relaxed mb-2">
                  <strong>Usage Data:</strong> We automatically collect:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent</li>
                  <li>Code submissions and AI interactions</li>
                  <li>Learning analytics and progress metrics</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h3>
                <p className="text-sm leading-relaxed mb-2">
                  We use collected information for:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Providing and maintaining our services</li>
                  <li>Personalizing your learning experience</li>
                  <li>Improving platform features and content</li>
                  <li>Training and improving our AI models</li>
                  <li>Sending important updates and notifications</li>
                  <li>Analyzing usage patterns and trends</li>
                  <li>Preventing fraud and ensuring security</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. AI and Machine Learning</h3>
                <p className="text-sm leading-relaxed">
                  Your code submissions and interactions with AuraBot may be used to improve our AI models. We anonymize this data and use it solely for educational purposes and platform improvements. Your personal identifying information is never shared with AI training processes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Data Sharing and Disclosure</h3>
                <p className="text-sm leading-relaxed mb-2">
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li><strong>Service Providers:</strong> Third-party services that help operate our platform (hosting, analytics, AI services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Data Security</h3>
                <p className="text-sm leading-relaxed">
                  We implement industry-standard security measures including encryption, secure authentication, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Cookies and Tracking</h3>
                <p className="text-sm leading-relaxed">
                  We use cookies and similar technologies to maintain sessions, remember preferences, and analyze usage. You can control cookies through your browser settings, though this may affect platform functionality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights</h3>
                <p className="text-sm leading-relaxed mb-2">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Children's Privacy</h3>
                <p className="text-sm leading-relaxed">
                  Our platform is intended for users aged 13 and above. We do not knowingly collect information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">9. International Data Transfers</h3>
                <p className="text-sm leading-relaxed">
                  Your information may be transferred to and maintained on servers located outside your country. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">10. Changes to Privacy Policy</h3>
                <p className="text-sm leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">11. Contact Us</h3>
                <p className="text-sm leading-relaxed">
                  For privacy concerns or data requests, contact us at:{' '}
                  <a href="mailto:privacy@auralearn.com" className="text-purple-500 hover:text-purple-600 font-medium">
                    privacy@auralearn.com
                  </a>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
