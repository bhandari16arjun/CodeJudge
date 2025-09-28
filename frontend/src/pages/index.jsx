import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Trophy, Users, BookOpen, Zap, Target, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      {/* Hero Section with Dark Theme */}
      <section className="flex-1 px-4 py-20 lg:py-32 bg-gradient-to-br from-dark-bg via-dark-card/50 to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-code-pattern opacity-10"></div>
        
        {/* Floating Purple Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-code-purple/30 to-code-blue/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-code-blue/30 to-code-purple/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12 animate-fade-in">
              <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm font-medium bg-dark-card/80 backdrop-blur-sm border border-gray-600 text-white">
                🚀 Join 50K+ Developers
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight">
                Master
                <span className="block bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
                  Competitive
                </span>
                <span className="block bg-gradient-to-r from-code-purple to-code-blue bg-clip-text text-transparent">
                  Programming
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Solve challenging problems, compete in contests, and become a better developer with our interactive platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Start Coding Now
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-2 border-gray-600 bg-dark-card/50 text-white hover:bg-dark-card/80 backdrop-blur-sm transition-colors">
                Browse Problems
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Simplified Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-400">Developers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">1000+</div>
                <div className="text-gray-400">Problems</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400">Contests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-dark-bg to-dark-card/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why CodeCraft?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to excel in competitive programming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-dark-card/90 backdrop-blur-sm hover:bg-dark-card transform hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-code-purple to-code-blue rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:animate-glow">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-3">Live Contests</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Compete with developers worldwide in real-time programming challenges
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-dark-card/90 backdrop-blur-sm hover:bg-dark-card transform hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-code-blue to-code-purple rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:animate-glow">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-3">Smart Learning</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  AI-powered problem recommendations tailored to your skill level
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-dark-card/90 backdrop-blur-sm hover:bg-dark-card transform hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-code-purple to-code-blue rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:animate-glow">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-3">Instant Feedback</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Get real-time feedback on your solutions and coding techniques
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dark-card via-dark-bg to-dark-card relative overflow-hidden">
        <div className="absolute inset-0 bg-code-pattern opacity-10"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers who are already improving their skills on CodeCraft.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple text-white transition-all duration-300 shadow-xl">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-2 border-gray-600 bg-dark-card/50 text-white hover:bg-dark-card/80 backdrop-blur-sm transition-colors">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;