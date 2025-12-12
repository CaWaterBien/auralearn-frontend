"use client";

import React, { useEffect, useState } from "react";
import { App, Button, Card, Form, Input, Typography, Checkbox } from "antd";
import { adminLogin } from "@/lib/admin-api";
import Link from "next/link";
import { ArrowLeft, Code, Shield, Users, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to AuraLearn Admin",
      description:
        "Manage platform content, users, and insights with a clear, modern admin toolkit.",
      icon: <Shield className="h-12 w-12 text-white/80" />,
      gradient: "from-purple-600 via-pink-500 to-orange-400",
    },
    {
      title: "Moderate FAQs & Content",
      description:
        "Create and update FAQs, review submissions, and keep learning resources fresh.",
      icon: <Code className="h-12 w-12 text-white/80" />,
      gradient: "from-blue-600 via-purple-500 to-pink-400",
    },
    {
      title: "Understand Your Learners",
      description:
        "Monitor user growth and engagement to guide product decisions confidently.",
      icon: <Users className="h-12 w-12 text-white/80" />,
      gradient: "from-green-600 via-blue-500 to-purple-400",
    },
    {
      title: "Fast, Secure Access",
      description:
        "Session-based authentication keeps your dashboard private and responsive.",
      icon: <Zap className="h-12 w-12 text-white/80" />,
      gradient: "from-orange-600 via-red-500 to-pink-400",
    },
  ];

  useEffect(() => {
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    try {
      const data: { admin: { name: string } } = await adminLogin(values.email, values.password);
      message.success("Welcome, " + data.admin.name);
      window.location.href = "/admin";
    } catch (e) {
      message.error((e as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Animated Slides (shown on lg and above) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex items-center justify-center transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
            <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
            <div className="absolute top-16 right-20 w-8 h-8 bg-white/20 rotate-45 rounded-sm"></div>
            <div className="absolute bottom-40 left-16 w-12 h-1 bg-white/30 rounded-full rotate-45"></div>
            <div className="absolute top-1/3 right-16 w-6 h-6 bg-white/25 rounded-full"></div>
            <div className="absolute bottom-16 right-1/3 w-10 h-1 bg-white/30 rounded-full rotate-12"></div>

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-8 text-center text-white">
              <div className="flex justify-center mb-6">{slide.icon}</div>
              <h1 className="text-4xl font-bold mb-6 leading-tight">{slide.title}</h1>
              <p className="text-lg text-white/90 leading-relaxed">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform flex space-x-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-4 text-white/60 text-xs z-20">designed by AuraLearn</div>
      </div>

      {/* Right Column - Admin Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 relative">
        {/* Back to site */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to AuraLearn</span>
          </Link>
        </div>

        <div className="w-full max-w-md px-6 py-8">
          <Card
            style={{ borderRadius: 16, border: "1px solid #eef0f3", boxShadow: "0 24px 80px rgba(17,24,39,0.08)" }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Header */}
            <div className="flex flex-col items-center justify-center pt-10 pb-6 border-b border-gray-100 bg-white rounded-t-2xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md mb-3">
                <Shield className="h-7 w-7" />
              </div>
              <div className="text-sm tracking-wider text-gray-700 font-semibold">ADMIN LOGIN</div>
            </div>

            {/* Form */}
            <div className="px-6 pt-4 pb-6">
              <Form layout="vertical" onFinish={onFinish} requiredMark={false} autoComplete="on">
                <Form.Item name="email" label="Admin Email" rules={[{ required: true, type: "email" }]}> 
                  <Input placeholder="admin@auralearn.local" allowClear autoComplete="username" size="large" />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}> 
                  <Input.Password placeholder="••••••••" autoComplete="current-password" size="large" />
                </Form.Item>
                <div className="flex items-center justify-between mb-4">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a className="text-sm text-purple-600 hover:text-purple-700" href="#">Forgot password?</a>
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600"
                >
                  LOGIN
                </Button>
                <div className="text-center text-sm text-gray-600 mt-6">
                  Need access? <span className="text-purple-600">Contact a system administrator</span>
                </div>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 