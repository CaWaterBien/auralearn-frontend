import Header from '@/components/header'
import TutorialSections from '@/components/tutorial-sections'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="py-16 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Choose from our comprehensive courses designed to take you from beginner to professional developer
            </p>
          </div>
          <TutorialSections />
        </div>
      </div>
    </div>
  )
}
