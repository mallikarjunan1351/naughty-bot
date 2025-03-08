'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/feed" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">SocialFeed</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
                <ThemeToggle />
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:inline-block dark:text-white">
                      {session.user.name}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 