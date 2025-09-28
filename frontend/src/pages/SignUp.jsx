import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '@/store/authSlice';
import { googleLogin } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Code, ArrowLeft, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted,        setHasSubmitted]        = useState(false);
  const [localError,          setLocalError]          = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log(isAuthenticated);
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLocalError('');
    const { confirmPassword, ...payload } = formData; // drop confirmPassword
    dispatch(registerUser(payload));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-gradient-to-br from-dark-bg via-dark-card/50 to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-code-pattern opacity-10" />

        {/* Decorative blobs */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-code-purple/30 to-code-blue/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-code-orange/30 to-code-green/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-code-green/20 to-code-blue/20 rounded-full blur-xl animate-pulse delay-500" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
              <Code className="h-10 w-10 text-code-blue group-hover:animate-glow transition-all duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
                CodeCraft
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-white">Join CodeCraft</h1>
            <p className="text-gray-300">Start your coding adventure today</p>
          </div>

          <Card className="shadow-2xl border-0 bg-dark-card/90 backdrop-blur-sm animate-fade-in">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-white">Create Account</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 border-2 border-gray-600 bg-dark-bg/50 text-white placeholder:text-gray-400 focus:border-code-blue transition-colors"
                    required
                  />
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-11 border-2 border-gray-600 bg-dark-bg/50 text-white placeholder:text-gray-400 focus:border-code-blue transition-colors pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {(hasSubmitted && (localError || error)) && (
                  <p className="text-red-500 text-sm">
                    {localError || error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-11 bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple transition-all duration-300 text-white font-medium"
                >
                  {status === 'loading' ? 'Creating…' : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              {/* separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-dark-card px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Google button placeholder */}
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-gray-600 bg-dark-bg/50 text-white hover:bg-gray-700 transition-colors"
                onClick={() => dispatch(googleLogin())}
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Continue with Google
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-300">Already have an account? </span>
                <Link to="/signin" className="text-code-blue hover:text-code-purple font-medium transition-colors">
                  Sign in
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

export default SignUp;
