import type { Metadata } from "next";
// Temporarily disabled due to Turbopack font loading issue
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp } from "antd";
import { ConditionalAuthProvider } from "@/lib/conditional-auth-provider";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeConfigProvider } from "@/components/theme-config-provider";
import AntdCompat from "./antd-compat";
import HydrationErrorBoundary from "@/components/hydration-error-boundary";
import HydrationSuppressor from "@/components/hydration-suppressor";
import { ToastProvider } from "@/components/ui/toast-notifications";

// Temporarily using system fonts due to Turbopack font loading issue
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "AuraLearn",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
            // Apply theme before React hydration to prevent flash
            (function() {
              const theme = localStorage.getItem('theme') || 'light'; // Default to light mode
              document.documentElement.setAttribute('data-theme', theme);
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            })();
            `
            + `
            // Immediately suppress hydration errors before React loads
            (function() {
              'use strict';
              
              if (typeof window === 'undefined') return;
              
              // Store original console methods
              const originalConsole = {
                error: console.error,
                warn: console.warn,
                log: console.log
              };
              
              // Function to check if message should be suppressed
              function shouldSuppressMessage(message) {
                if (typeof message === 'string') {
                  return (
                    message.includes('hydrated but some attributes') ||
                    message.includes('abId') ||
                    message.includes('server rendered HTML didn\\'t match') ||
                    message.includes('react-hydration-error') ||
                    message.includes('hydration-mismatch') ||
                    message.includes('This won\\'t be patched up') ||
                    message.includes('SSR-ed Client Component') ||
                    message.includes('A tree hydrated but') ||
                    message.includes('Warning: Text content did not match') ||
                    message.includes('Warning: Expected server HTML') ||
                    message.includes('iframe which has both allow-scripts and allow-same-origin') ||
                    message.includes('can escape its sandboxing') ||
                    message.includes('An iframe which has both allow-scripts and allow-same-origin') ||
                    message.includes('iframe') && message.includes('sandboxing') ||
                    message.includes('allow-scripts') && message.includes('allow-same-origin')
                  );
                }
                return false;
              }
              
              // Override console.error
              console.error = function() {
                const args = Array.prototype.slice.call(arguments);
                if (!shouldSuppressMessage(args[0])) {
                  originalConsole.error.apply(console, args);
                }
              };
              
              // Override console.warn
              console.warn = function() {
                const args = Array.prototype.slice.call(arguments);
                if (!shouldSuppressMessage(args[0])) {
                  originalConsole.warn.apply(console, args);
                }
              };
              
              // Override console.log
              console.log = function() {
                const args = Array.prototype.slice.call(arguments);
                if (!shouldSuppressMessage(args[0])) {
                  originalConsole.log.apply(console, args);
                }
              };
              
              // Handle window errors
              const originalOnError = window.onerror;
              window.onerror = function(message, source, lineno, colno, error) {
                if (typeof message === 'string' && shouldSuppressMessage(message)) {
                  return true; // Suppress the error
                }
                if (originalOnError) {
                  return originalOnError.call(this, message, source, lineno, colno, error);
                }
                return false;
              };
              
              // Handle unhandled promise rejections
              const originalOnUnhandledRejection = window.onunhandledrejection;
              window.onunhandledrejection = function(event) {
                if (event.reason && typeof event.reason.message === 'string' &&
                    shouldSuppressMessage(event.reason.message)) {
                  event.preventDefault();
                  return;
                }
                if (originalOnUnhandledRejection) {
                  return originalOnUnhandledRejection.call(this, event);
                }
              };
            })();
            `
          }}
        />
        <script src="/hydration-suppressor.js" />
      </head>
      <body className="antialiased font-sans">
        <AntdCompat />
        <HydrationSuppressor />
        <HydrationErrorBoundary>
          <ThemeProvider>
            <ConditionalAuthProvider>
              <ToastProvider>
                <AntdRegistry>
                  <ThemeConfigProvider>
                    <AntdApp>
                      {children}
                    </AntdApp>
                  </ThemeConfigProvider>
                </AntdRegistry>
              </ToastProvider>
            </ConditionalAuthProvider>
          </ThemeProvider>
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}
