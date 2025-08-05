import React from 'react';
import { ArrowRight, Users, FileText, Zap, Star } from 'lucide-react';
import { Page } from '../App';
import { useProjects } from '../contexts/ProjectContext';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { projects } = useProjects();
  const totalUsers = 156 + projects.length;
  const totalReadmes = 175 + projects.filter(p => p.readme).length;

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 mb-8">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">AI-POWERED DOCUMENTATION</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI GitHub Readme
            <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent block">
              Generator
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Generate beautiful, professional README files for your GitHub repositories in 
            seconds using AI. Create comprehensive documentation that showcases your projects.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate('generator')}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 border border-slate-700/50">
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-teal-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{totalUsers}+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{totalReadmes}+</div>
              <div className="text-gray-400">READMEs Generated</div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">10s</div>
              <div className="text-gray-400">Average Generation Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};