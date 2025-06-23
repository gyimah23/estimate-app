
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Mail, Lock, User, Building } from 'lucide-react';

interface AuthLayoutProps {
  onLogin: (email: string, password: string) => void;
}

const AuthLayout = ({ onLogin }: AuthLayoutProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isLogin) {
      onLogin(email, password);
    } else {
      // For demo purposes, we'll just switch to login
      setIsLogin(true);
      console.log('Account created successfully');
    }
    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
  };

  return (
    <div className="min-h-screen electric-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center mb-6 relative">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-2xl animate-glow">
              <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">AG</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            AG ELECTRICAL ESTIMATE APP
          </h1>
          <p className="text-white/90 text-lg font-medium">
            Professional Electrical Estimates Made Easy
          </p>
        </div>

        {/* Enhanced Card */}
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 animate-scale-in overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                {isLogin ? (
                  <Lock className="h-6 w-6 text-blue-600" />
                ) : (
                  <User className="h-6 w-6 text-purple-600" />
                )}
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Join AG Electrical'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin 
                ? 'Sign in to manage your electrical estimates' 
                : 'Create your account and start estimating'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="company" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your Electrical Company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="electrician@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-500" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full electric-gradient text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg py-3 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>

            {/* Enhanced Toggle */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={toggleMode}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300 hover:scale-105 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Create one now" 
                  : "Already have an account? Sign in instead"
                }
              </Button>
            </div>

            {/* Demo Note */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-sm text-center text-blue-800">
                <span className="font-semibold">Demo Version:</span> Use any email and password to sign in
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm">
            © 2024 AG Electrical Estimate App. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
