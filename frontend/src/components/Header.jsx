import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';

import {
  Code,
  Menu,
  Trophy,
  BookOpen,
  Users,
  FilePlus2,
  LogOut,
  Lock,
  Award
} from 'lucide-react';

const LockedItem = ({ label, Icon }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" className="text-gray-300 hover:text-code-blue hover:bg-dark-card/50">
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </PopoverTrigger>
    <PopoverContent side="bottom" className="bg-dark-card text-gray-200">
      <Lock className="h-4 w-4 inline mr-1" />
      Please sign in to access&nbsp;{label}.
    </PopoverContent>
  </Popover>
);

const Header = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { isAuthenticated, user, status } = useSelector((s) => s.auth);
  const isProblemSetter = user?.role === 'problemSetter';

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => navigate('/'));
  };

  return (
    <header className="w-full border-b border-gray-700  backdrop-blur bg-dark-card/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Code className="h-8 w-8 text-code-blue group-hover:text-code-purple transition-colors duration-300" />
            <div className="absolute -inset-1 bg-gradient-to-r from-code-purple to-code-blue rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
            CodeCraft
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          {isAuthenticated ? (
            isProblemSetter ? (
              ""
            ) : (
              <>
                <Link to="/problems">
                  <Button variant="ghost" className="text-gray-300 hover:text-code-blue hover:bg-dark-card/50">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Problems
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-code-blue hover:bg-dark-card/50">
                    <Users className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-code-blue hover:bg-dark-card/50">
                  <Award className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Button>
                </Link>
              </>
            )
          ) : (
            <>
              <LockedItem label="Leaderboard"   Icon={Trophy}  />
              <LockedItem label="Problems"  Icon={BookOpen} />
              <LockedItem label="Dashboard" Icon={Users}    />
            </>
          )}
        </nav>
        <div className="flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-300 hover:text-code-blue hover:bg-dark-card/50">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple text-white transition-all duration-300 shadow-lg hover:shadow-xl">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Button
              variant="ghost"
              disabled={status === 'loading'}
              onClick={handleLogout}
              className="text-gray-300 hover:text-code-blue hover:bg-dark-card/50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
