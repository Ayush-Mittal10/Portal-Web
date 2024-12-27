"use client"

import Link from "next/link"
import { LayoutDashboard, Package2, ClipboardList, Star, UserCircle, HelpCircle } from 'lucide-react'

// Sidebar component that provides main navigation for the seller dashboard
export function Sidebar() {
  return (
    <div className="h-screen w-56 bg-[#3f8f5d]">
      <div className="py-4">
        
        {/* Navigation Links */}
        <nav className="space-y-1 px-2">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            href="/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10"
          >
            <Package2 className="h-4 w-4" />
            Seller Management
          </Link>
          <Link 
            href="/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10"
          >
            <ClipboardList className="h-4 w-4" />
            Product Management
          </Link>
          <Link 
            href="/reviews"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10"
          >
            <Star className="h-4 w-4" />
            Order Management
          </Link>
          <Link 
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10"
          >
            <UserCircle className="h-4 w-4" />
            Reports & Analytics
          </Link>
          <Link 
            href="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4" />
            Help/Faq Management
          </Link>
        </nav>
      </div>
    </div>
  )
}

