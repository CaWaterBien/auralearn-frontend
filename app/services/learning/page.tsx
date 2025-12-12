'use client';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { BookOpen, Brain, Target, TrendingUp, Clock, Users, Star, CheckCircle, ArrowRight, Zap } from 'lucide-react';

export default function PersonalizedLearningPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Personalized Learning</h1>
                <p className="text-sm text-gray-500">AI-powered learning paths</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Pro Service
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Personalized Learning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Experience learning that adapts to your unique style, pace, and goals. Our AI analyzes your progress 
            and creates custom learning paths that maximize your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">
              AI continuously adjusts difficulty based on your performance and learning patterns
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Roadmaps</h3>
            <p className="text-gray-600">
              Personalized learning paths tailored to your career goals and current skill level
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Analytics</h3>
            <p className="text-gray-600">
              Detailed insights into your learning progress with actionable recommendations
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 AI Tutor</h3>
            <p className="text-gray-600">
              Round-the-clock AI assistance for questions, explanations, and guidance
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Learning</h3>
            <p className="text-gray-600">
              Connect with peers and mentors in your learning journey
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-gray-600">
              AI suggests the next best learning content based on your interests and goals
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How Personalized Learning Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
              <p className="text-sm text-gray-600">
                Take our comprehensive skill assessment to understand your current level
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Our AI analyzes your results and creates a personalized learning roadmap
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Adaptive Learning</h4>
              <p className="text-sm text-gray-600">
                Learn at your own pace with content that adapts to your progress
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Continuous Optimization</h4>
              <p className="text-sm text-gray-600">
                AI continuously optimizes your learning path based on performance
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative">
              <CardHeader className="text-center">
                <h4 className="text-xl font-semibold">Starter</h4>
                <div className="text-3xl font-bold text-gray-900">$19<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">Perfect for individual learners</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Basic AI recommendations
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Progress tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Community access
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="relative border-purple-500">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white">Most Popular</span>
              </div>
              <CardHeader className="text-center">
                <h4 className="text-xl font-semibold">Pro</h4>
                <div className="text-3xl font-bold text-gray-900">$49<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">Advanced personalization features</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Full AI-powered learning
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Custom learning roadmaps
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    24/7 AI tutor support
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Advanced analytics
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Pro</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader className="text-center">
                <h4 className="text-xl font-semibold">Enterprise</h4>
                <div className="text-3xl font-bold text-gray-900">Custom</div>
                <p className="text-gray-600">For teams and organizations</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Team management
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Custom content creation
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    API access
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your Learning Experience?
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who have accelerated their learning with AI-powered personalization. 
            Start your personalized learning journey today.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Start Free Trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
