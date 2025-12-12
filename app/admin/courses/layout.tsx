import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Management - AuraLearn Admin",
  description: "Manage courses, lessons, and learning content",
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
