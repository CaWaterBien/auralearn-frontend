import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - AuraLearn",
  description: "Sign in to access more learning features",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white/90 backdrop-blur-sm">
      {children}
    </div>
  );
} 