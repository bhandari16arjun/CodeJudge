import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '@/store/authSlice';
import { googleLogin } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Code, Github, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const SignIn = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-gradient-to-br from-dark-bg via-dark-card/50 to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-code-pattern opacity-10" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-code-purple/30 to-code-blue/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-code-blue/30 to-code-purple/30 rounded-full blur-xl animate-pulse delay-1000" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <Code className="h-10 w-10 text-code-blue group-hover:animate-glow transition-all duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
                CodeCraft
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-gray-300">Sign in to continue your coding journey</p>
          </div>

          <Card className="shadow-2xl border-0 bg-dark-card/90 backdrop-blur-sm animate-fade-in">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 border-2 border-gray-600 bg-dark-bg/50 text-white placeholder:text-gray-400 focus:border-code-blue transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-11 border-2 border-gray-600 bg-dark-bg/50 text-white placeholder:text-gray-400 focus:border-code-blue transition-colors pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {hasSubmitted && error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-11 bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple transition-all duration-300 text-white font-medium shadow-lg"
                >
                  {status === 'loading' ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-dark-card px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

               <Button
                onClick={() => dispatch(googleLogin())}
                variant="outline"
                className="w-full h-11 border-2 border-gray-600 bg-dark-bg/50 text-white hover:bg-gray-700 transition-colors"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Continue with Google
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-300">Don't have an account? </span>
                <Link to="/signup" className="text-code-blue hover:text-code-purple font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
