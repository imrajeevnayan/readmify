import React from 'react';
import { Github, Sparkles } from 'lucide-react';
import { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-2 rounded-lg">
              <Github className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">README Generator</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-teal-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'dashboard' 
                  ? 'text-teal-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Testimonials
            </button>
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Pricing
            </button>
          </nav>

          <button
            onClick={() => onNavigate('generator')}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </header>
  );
};