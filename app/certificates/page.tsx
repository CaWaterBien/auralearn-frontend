'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Star, Trophy, BookOpen, Code, ArrowRight } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'free' | 'pro';
  progress: number;
  modules: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const certificates: Certificate[] = [
  {
    id: 'html5-developer',
    title: 'HTML5 Developer',
    description: 'Master HTML fundamentals and build modern web pages',
    category: 'WEB DEVELOPMENT',
    status: 'free',
    progress: 0,
    modules: 12,
    duration: '4-6 weeks',
    difficulty: 'beginner'
  },
  {
    id: 'css-specialist',
    title: 'CSS Specialist',
    description: 'Advanced styling skills and responsive design',
    category: 'WEB DEVELOPMENT',
    status: 'free',
    progress: 0,
    modules: 15,
    duration: '5-7 weeks',
    difficulty: 'intermediate'
  }
];

export default function CertificatesPage() {
  const router = useRouter();
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'free') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Free
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Star className="w-3 h-3 mr-1" />
        Pro
      </span>
    );
  };

  const handleCertificateClick = (certificateId: string) => {
    router.push(`/certificates/${certificateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Track your progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Earn Your Certificates
          </h2>
          <p className="text-lg text-gray-600">
            Complete courses and earn professional certificates to showcase your skills
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card 
              key={certificate.id}
              className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              onClick={() => handleCertificateClick(certificate.id)}
            >
              {/* Certificate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {certificate.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {certificate.category}
                    </p>
                  </div>
                </div>
                {getStatusBadge(certificate.status)}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">
                {certificate.description}
              </p>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{certificate.progress}%</span>
                </div>
                <Progress value={certificate.progress} className="h-2" />
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{certificate.modules}</p>
                  <p className="text-xs text-gray-500">Modules</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 mx-auto mb-1 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{certificate.duration}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(certificate.difficulty)}`}>
                  {certificate.difficulty.charAt(0).toUpperCase() + certificate.difficulty.slice(1)}
                </span>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full group-hover:bg-purple-700 transition-colors duration-200"
                variant={certificate.progress > 0 ? "default" : "outline"}
              >
                <span>{certificate.progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleCertificateClick('html5-developer')}
            >
              <div className="text-left">
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">HTML5 Developer</p>
                    <p className="text-sm text-gray-500">Master HTML fundamentals</p>
                  </div>
                </div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleCertificateClick('css-specialist')}
            >
              <div className="text-left">
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">CSS Specialist</p>
                    <p className="text-sm text-gray-500">Advanced styling skills</p>
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About Our Certificates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Industry Recognized</h4>
              <p className="text-sm text-gray-600">
                Certificates that are valued by employers and industry professionals
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Skill Validation</h4>
              <p className="text-sm text-gray-600">
                Prove your expertise with hands-on projects and assessments
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Lifetime Access</h4>
              <p className="text-sm text-gray-600">
                Keep learning and updating your skills with ongoing access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
