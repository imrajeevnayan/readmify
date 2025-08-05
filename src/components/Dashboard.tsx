import React from 'react';
import { Plus, FileText, Clock, Download, Trash2, Edit3 } from 'lucide-react';
import { Page } from '../App';
import { useProjects } from '../contexts/ProjectContext';
import { formatDistanceToNow } from '../utils/dateUtils';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { projects, deleteProject } = useProjects();

  const downloadReadme = (projectName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your README projects</p>
        </div>
        <button
          onClick={() => onNavigate('generator')}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New README</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first README to get started</p>
          <button
            onClick={() => onNavigate('generator')}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(project.createdAt)} ago</span>
                </div>
                <span className="px-2 py-1 bg-slate-700/50 rounded text-xs">
                  {project.language}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {project.readme && (
                  <button
                    onClick={() => downloadReadme(project.name, project.readme!)}
                    className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}
                <button className="flex-1 bg-gradient-to-r from-teal-500/20 to-blue-600/20 hover:from-teal-500/30 hover:to-blue-600/30 text-teal-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 border border-teal-500/30">
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};