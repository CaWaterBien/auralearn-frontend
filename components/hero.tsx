'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import styles from './hero.module.scss'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className={`${styles.hero} text-white py-20`}>
      <div className="w-full px-4 text-center max-w-[1920px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Learn to Code
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-[#FAEB92]">
          With the world&apos;s largest web developer site.
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className={`flex ${styles.searchBar} shadow-lg`}>
            <Input
              type="text"
              placeholder="Search our tutorials, e.g. HTML"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none rounded-none h-14 text-lg px-6 text-[#9929EA]"
            />
            <Button className="bg-[#00AA6C] hover:bg-[#008A5A] h-14 px-8 rounded-none">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="text-lg">
          <span className="underline cursor-pointer hover:text-[#FAEB92]">
            Not Sure Where To Begin?
          </span>
        </div>
      </div>
    </section>
  )
}


