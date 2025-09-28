import { Code, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 bg-dark-card/80 backdrop-blur-sm">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
         
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-code-blue" />
              <span className="font-semibold bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
                CodeCraft
              </span>
            </Link>
            <span className="text-gray-400 text-sm">
              © 2024 CodeCraft. All rights reserved.
            </span>
          </div>

          
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-code-blue text-sm transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-code-blue text-sm transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-code-blue text-sm transition-colors">
              Terms
            </Link>
          </div>

          
          <div className="flex items-center space-x-3">
            <a href="#" className="text-gray-400 hover:text-code-blue transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-code-blue transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;