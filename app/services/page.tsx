'use client';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, User, Users, Settings, Zap, Star, CheckCircle, Clock, Target } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  badge: string;
  icon: React.ReactNode;
  href: string;
}

const services: Service[] = [
  {
    id: 'personalized-learning',
    title: 'Personalized Learning',
    description: 'AI-powered learning paths tailored to your goals and skill level',
    features: [
      'Custom learning roadmap',
      'Adaptive difficulty adjustment',
      'Progress tracking & analytics',
      'Personalized recommendations',
      '24/7 AI tutor support'
    ],
    price: 'Pro',
    badge: 'Popular',
    icon: <BookOpen className="w-6 h-6" />,
    href: '/services/learning'
  },
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'Get expert feedback on your code from industry professionals',
    features: [
      'Expert code analysis',
      'Best practices guidance',
      'Performance optimization tips',
      'Security recommendations',
      'Detailed feedback reports'
    ],
    price: 'Pro',
    badge: 'New',
    icon: <Code className="w-6 h-6" />,
    href: '/services/code-review'
  },
  {
    id: 'mentorship',
    title: '1-on-1 Mentorship',
    description: 'Direct guidance from experienced developers and industry experts',
    features: [
      'Personal mentor assignment',
      'Weekly 1-on-1 sessions',
      'Career guidance & advice',
      'Project portfolio review',
      'Interview preparation'
    ],
    price: 'Premium',
    badge: 'Limited',
    icon: <User className="w-6 h-6" />,
    href: '/services/mentorship'
  },
  {
    id: 'team-training',
    title: 'Team Training',
    description: 'Corporate learning solutions for teams and organizations',
    features: [
      'Custom curriculum design',
      'Team progress tracking',
      'Certification programs',
      'On-site training options',
      'Dedicated support team'
    ],
    price: 'Enterprise',
    badge: 'Corporate',
    icon: <Users className="w-6 h-6" />,
    href: '/services/team-training'
  },
  {
    id: 'custom-content',
    title: 'Custom Content',
    description: 'Tailored learning materials for your specific needs',
    features: [
      'Industry-specific content',
      'Company technology stack focus',
      'Custom project examples',
      'Branded learning materials',
      'Flexible delivery formats'
    ],
    price: 'Enterprise',
    badge: 'Custom',
    icon: <Settings className="w-6 h-6" />,
    href: '/services/custom-content'
  },
  {
    id: 'api-access',
    title: 'API Access',
    description: 'Integrate our learning platform into your applications',
    features: [
      'RESTful API endpoints',
      'Comprehensive documentation',
      'SDK libraries available',
      'Webhook support',
      'Developer support'
    ],
    price: 'Enterprise',
    badge: 'Technical',
    icon: <Zap className="w-6 h-6" />,
    href: '/services/api'
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-300">Professional solutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Professional Learning Services
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Take your skills to the next level with our comprehensive suite of professional services designed for individuals and organizations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {service.icon}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      {service.price}
                    </span>
                    {service.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                        {service.badge}
                      </span>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">{service.title}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                  <a href={service.href} className="w-full h-full flex items-center justify-center">
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Our Services */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Why Choose Our Services?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Proven Results</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Thousands of developers have advanced their careers using our services
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Expert Quality</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Industry professionals and certified experts deliver all our services
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Flexible & Fast</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Adapt to your schedule with flexible learning and quick turnaround times
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Accelerate Your Learning?
          </h3>
          <p className="text-blue-100 dark:text-blue-200 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who have transformed their careers with our professional services. 
            Start your journey today and unlock your full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-white dark:text-blue-600 dark:hover:bg-gray-100">
              View All Services
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
