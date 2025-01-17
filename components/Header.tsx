import { Phone } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center" role="banner">
      <h1 className="text-2xl font-bold">IFS Guide Voice Chat</h1>
      <div className="flex items-center space-x-4">
        <a href="tel:+1234567890" className="flex items-center space-x-2 text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2" aria-label="Call Support">
          <Phone size={20} />
          <span>Call Support</span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}

