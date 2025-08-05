import axios from 'axios';

export interface GitHubRepoData {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  license: {
    name: string;
    spdx_id: string;
  } | null;
  homepage: string | null;
  clone_url: string;
  ssh_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  files: {
    name: string;
    type: 'file' | 'dir';
    path: string;
  }[];
  packageJson?: any;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  hasDockerfile?: boolean;
  hasTests?: boolean;
  framework?: string;
  projectType?: string;
}

export const analyzeGitHubRepo = async (owner: string, repo: string): Promise<GitHubRepoData> => {
  try {
    // Get repository information
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    const repoData = repoResponse.data;

    // Get repository contents
    const contentsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`);
    const contents = contentsResponse.data;

    // Analyze files
    const files = contents.map((item: any) => ({
      name: item.name,
      type: item.type,
      path: item.path
    }));

    // Check for specific files
    const hasPackageJson = files.some(f => f.name === 'package.json');
    const hasDockerfile = files.some(f => f.name === 'Dockerfile' || f.name === 'dockerfile');
    const hasTests = files.some(f => 
      f.name.includes('test') || 
      f.name.includes('spec') || 
      f.name === '__tests__' ||
      f.name === 'tests'
    );

    let packageJson: any = null;
    let dependencies: string[] = [];
    let devDependencies: string[] = [];
    let scripts: Record<string, string> = {};

    // Get package.json if it exists
    if (hasPackageJson) {
      try {
        const packageResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`);
        const packageContent = JSON.parse(atob(packageResponse.data.content));
        packageJson = packageContent;
        dependencies = Object.keys(packageContent.dependencies || {});
        devDependencies = Object.keys(packageContent.devDependencies || {});
        scripts = packageContent.scripts || {};
      } catch (error) {
        console.warn('Could not fetch package.json:', error);
      }
    }

    // Detect framework and project type
    const framework = detectFramework(dependencies, devDependencies, files);
    const projectType = detectProjectType(files, dependencies, repoData.language);

    return {
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      topics: repoData.topics || [],
      license: repoData.license,
      homepage: repoData.homepage,
      clone_url: repoData.clone_url,
      ssh_url: repoData.ssh_url,
      stargazers_count: repoData.stargazers_count,
      forks_count: repoData.forks_count,
      open_issues_count: repoData.open_issues_count,
      default_branch: repoData.default_branch,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      owner: {
        login: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url
      },
      files,
      packageJson,
      dependencies,
      devDependencies,
      scripts,
      hasDockerfile,
      hasTests,
      framework,
      projectType
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Repository not found. Please check the URL and make sure the repository is public.');
      } else if (error.response?.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`GitHub API error: ${error.response?.statusText || error.message}`);
      }
    }
    throw new Error('Failed to analyze repository. Please check your internet connection and try again.');
  }
};

const detectFramework = (dependencies: string[], devDependencies: string[], files: any[]): string => {
  const allDeps = [...dependencies, ...devDependencies];
  
  // React
  if (allDeps.includes('react')) {
    if (allDeps.includes('next')) return 'Next.js';
    if (allDeps.includes('gatsby')) return 'Gatsby';
    if (allDeps.includes('@remix-run/react')) return 'Remix';
    return 'React';
  }
  
  // Vue
  if (allDeps.includes('vue')) {
    if (allDeps.includes('nuxt')) return 'Nuxt.js';
    return 'Vue.js';
  }
  
  // Angular
  if (allDeps.includes('@angular/core')) return 'Angular';
  
  // Node.js frameworks
  if (allDeps.includes('express')) return 'Express.js';
  if (allDeps.includes('fastify')) return 'Fastify';
  if (allDeps.includes('koa')) return 'Koa.js';
  if (allDeps.includes('nestjs')) return 'NestJS';
  
  // Static site generators
  if (allDeps.includes('vite')) return 'Vite';
  if (allDeps.includes('webpack')) return 'Webpack';
  if (allDeps.includes('parcel')) return 'Parcel';
  
  // Python frameworks
  if (files.some(f => f.name === 'requirements.txt' || f.name === 'pyproject.toml')) {
    return 'Python';
  }
  
  return '';
};

const detectProjectType = (files: any[], dependencies: string[], language: string | null): string => {
  // Web application
  if (files.some(f => f.name === 'index.html') || dependencies.includes('react') || dependencies.includes('vue')) {
    return 'Web Application';
  }
  
  // API/Backend
  if (dependencies.includes('express') || dependencies.includes('fastify') || dependencies.includes('koa')) {
    return 'API/Backend';
  }
  
  // CLI Tool
  if (files.some(f => f.name === 'bin' || f.path.includes('bin/'))) {
    return 'CLI Tool';
  }
  
  // Library/Package
  if (files.some(f => f.name === 'package.json') && !files.some(f => f.name === 'index.html')) {
    return 'Library/Package';
  }
  
  // Mobile App
  if (files.some(f => f.name === 'android' || f.name === 'ios' || f.name === 'App.js')) {
    return 'Mobile Application';
  }
  
  // Desktop App
  if (dependencies.includes('electron') || dependencies.includes('tauri')) {
    return 'Desktop Application';
  }
  
  // Based on language
  switch (language) {
    case 'Python':
      return 'Python Application';
    case 'Java':
      return 'Java Application';
    case 'Go':
      return 'Go Application';
    case 'Rust':
      return 'Rust Application';
    case 'C++':
      return 'C++ Application';
    default:
      return 'Software Project';
  }
};