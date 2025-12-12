import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML5 Tutorial - AuraLearn",
  description: "Learn HTML5 fundamentals with interactive tutorials",
};

export default function HTMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
