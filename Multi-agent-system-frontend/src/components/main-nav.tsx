"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Info, FileText, User as UserIcon, Menu, X, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "./user-account-nav"

export function MainNav() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Dynamic routes based on role
  const userRole = (session?.user as any)?.role
  
  const publicRoutes = [
    { name: "О Центре", href: "/", icon: Info },
  ]

  const studentRoutes = [
    { name: "Маркетплейс", href: "/student/projects", icon: LayoutDashboard },
    { name: "Мои задачи", href: "/student/my-tasks", icon: FileText },
  ]

  const adminRoutes = [
    { name: "Трекер", href: "/admin/applications", icon: LayoutDashboard },
    { name: "Проекты", href: "/admin/projects", icon: FileText },
    { name: "Аналитика", href: "/admin/analytics", icon: Info },
  ]

  const currentRoutes = [
    ...publicRoutes,
    ...(userRole === 'STUDENT' ? studentRoutes : []),
    ...(userRole === 'ADMIN' ? adminRoutes : []),
    ...(status === 'unauthenticated' ? [{ name: "Подать проект", href: "/submit", icon: FileText }] : [])
  ]

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      (scrolled || pathname !== "/") 
        ? "h-16 bg-white/90 backdrop-blur-md border-b shadow-sm" 
        : "h-20 bg-transparent"
    )}>
      <div className="container flex h-full items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex flex-col group">
            <div className="text-lg font-black italic tracking-tighter text-black uppercase leading-none group-hover:text-primary transition-colors">
              Центр технологий<br />
              <span className="text-primary">для общества</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-10">
            {currentRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-xs font-black uppercase tracking-widest transition-all hover:text-black relative py-1",
                  pathname === route.href ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-slate-400"
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {status === "authenticated" ? (
             <UserAccountNav user={session.user as any} />
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest px-6 hover:bg-slate-100 rounded-xl">
                <Link href="/login">Войти</Link>
              </Button>
              <Button asChild size="sm" className="bg-black text-white hover:bg-slate-800 rounded-xl font-black italic px-8 h-10 shadow-lg shadow-black/10">
                <Link href="/register">Стать участником</Link>
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="lg:hidden rounded-xl bg-slate-100" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b p-6 space-y-6 animate-in slide-in-from-top duration-300 shadow-2xl">
          <nav className="flex flex-col space-y-4">
            {currentRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-black py-2"
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="h-5 w-5 text-primary" />
                {route.name}
              </Link>
            ))}
          </nav>
          {status === "unauthenticated" && (
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Button asChild variant="outline" className="w-full h-12 rounded-xl">
                <Link href="/login" onClick={() => setIsOpen(false)}>Войти</Link>
              </Button>
              <Button asChild className="w-full h-12 bg-black text-white font-bold rounded-xl">
                <Link href="/register" onClick={() => setIsOpen(false)}>Зарегистрироваться</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
