import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Eye, Download, Copy, Check, Github, AlertCircle } from 'lucide-react';
import { Page } from '../App';
import { useProjects } from '../contexts/ProjectContext';
import { analyzeGitHubRepo } from '../utils/githubAnalyzer';
import { generateReadmeFromRepo } from '../utils/readmeGenerator';

interface GeneratorFormProps {
  onNavigate: (page: Page) => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onNavigate }) => {
  const { addProject } = useProjects();
  const [repoUrl, setRepoUrl] = useState('');
  const [generatedReadme, setGeneratedReadme] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    // Validate GitHub URL
    const githubUrlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/;
    if (!githubUrlPattern.test(repoUrl.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Extract owner and repo from URL
      const urlParts = repoUrl.trim().replace(/\/$/, '').split('/');
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];

      // Analyze repository
      const repoData = await analyzeGitHubRepo(owner, repo);
      
      // Generate README
      const readme = generateReadmeFromRepo(repoData);
      setGeneratedReadme(readme);
      setShowPreview(true);
      
      // Save project
      addProject({
        name: repoData.name,
        description: repoData.description || 'No description provided',
        language: repoData.language || 'Unknown',
        readme
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReadme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">AI README Generator</h1>
          <p className="text-gray-400">Automatically generate professional documentation from your GitHub repository</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Repository Input */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Github className="h-6 w-6 text-teal-400" />
            <span>Repository Analysis</span>
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Repository URL *
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://github.com/username/repository"
              />
              {error && (
                <div className="mt-2 flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
              <h3 className="text-sm font-medium text-gray-300 mb-3">What we'll analyze:</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Repository metadata (name, description, language)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>File structure and project type detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Dependencies and package configuration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>License and contribution guidelines</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Installation and usage patterns</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !repoUrl}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Repository...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate README</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-teal-400" />
              <span className="font-semibold text-white">Generated README</span>
            </div>
            {generatedReadme && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={downloadReadme}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-500/20 to-blue-600/20 hover:from-teal-500/30 hover:to-blue-600/30 text-teal-400 rounded-lg transition-colors border border-teal-500/30"
                  title="Download README.md"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {generatedReadme ? (
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Preview</h3>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-auto max-h-96 bg-slate-800/50 p-3 rounded">
                      {generatedReadme}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Github className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Enter a GitHub repository URL to get started</p>
                <p className="text-sm text-gray-600">We'll automatically analyze your project and generate a comprehensive README</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};