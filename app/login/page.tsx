'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import AnimatedBackground from '../../components/AnimatedBackground';
import ThemeToggle from '../../components/ThemeToggle';
import { Loader } from '../../components/ui/Loader';
import ThreeDText from '@/components/ThreeDText';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const router = useRouter();

  // Apply theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setTheme(initialTheme);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      router.push('/feed');
    } catch (error) {
      setError('Something went wrong');
      setIsLoading(false);
    }
  };

  // Get card styles based on theme
  const cardClasses = theme === 'dark' 
    ? "w-[350px] z-10 bg-gray-900/90 backdrop-blur-sm text-white border-gray-800" 
    : "w-[350px] z-10 bg-white/90 backdrop-blur-sm border-gray-200";

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground theme={theme} intensity="high" />
      
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle onThemeChange={handleThemeChange} />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-8 text-center">
          <ThreeDText text="Naughty Bot" size="2xl" className="mb-8" />
        </div>
        
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
          <Card className={cardClasses}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className={theme === 'dark' ? "text-gray-400" : "text-gray-500"}>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Email</label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className={theme === 'dark' ? "bg-gray-800 border-gray-700" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className={theme === 'dark' ? "bg-gray-800 border-gray-700" : ""}
                  />
                  <p className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`}>
                    (For demo: use any email from JSONPlaceholder users, any password)
                  </p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  variant={theme === 'dark' ? "outline" : "default"}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader size="small" color={theme === 'dark' ? "gray-300" : "white"} />
                      <span className="ml-2">Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className={`text-sm ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`}>
                Demo app using JSONPlaceholder API
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 