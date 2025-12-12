import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course - AuraLearn",
  description: "Interactive learning with AuraLearn",
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
