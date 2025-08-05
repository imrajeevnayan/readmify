import { GitHubRepoData } from './githubAnalyzer';

export const generateReadmeFromRepo = (repoData: GitHubRepoData): string => {
  const {
    name,
    description,
    language,
    topics,
    license,
    homepage,
    owner,
    stargazers_count,
    forks_count,
    dependencies,
    devDependencies,
    scripts,
    hasDockerfile,
    hasTests,
    framework,
    projectType
  } = repoData;

  // Generate badges
  const badges = generateBadges(repoData);
  
  // Generate sections
  const featuresSection = generateFeaturesSection(repoData);
  const installationSection = generateInstallationSection(repoData);
  const usageSection = generateUsageSection(repoData);
  const apiSection = generateAPISection(repoData);
  const scriptsSection = generateScriptsSection(scripts);
  const contributingSection = generateContributingSection(repoData);
  const licenseSection = generateLicenseSection(license);

  return `# ${name}

${badges}

${description || 'A modern software project built with cutting-edge technologies.'}

${topics && topics.length > 0 ? `## 🏷️ Topics

${topics.map(topic => `\`${topic}\``).join(' ')}

` : ''}## ✨ Features

${featuresSection}

## 🚀 Quick Start

### Prerequisites

${generatePrerequisites(repoData)}

### Installation

${installationSection}

### Usage

${usageSection}

${apiSection}

${scriptsSection}

${hasTests ? `## 🧪 Testing

\`\`\`bash
# Run tests
${scripts?.test || 'npm test'}

# Run tests with coverage
${scripts?.['test:coverage'] || 'npm run test -- --coverage'}
\`\`\`

` : ''}${hasDockerfile ? `## 🐳 Docker

\`\`\`bash
# Build the Docker image
docker build -t ${name.toLowerCase()} .

# Run the container
docker run -p 3000:3000 ${name.toLowerCase()}
\`\`\`

` : ''}## 📁 Project Structure

\`\`\`
${generateProjectStructure(repoData)}
\`\`\`

## 🛠️ Built With

${generateTechStack(repoData)}

${contributingSection}

## 📄 License

${licenseSection}

## 👥 Authors

- **${owner.login}** - *Project Creator* - [@${owner.login}](https://github.com/${owner.login})

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the open-source community
- Built with ❤️ and modern development practices

## 📊 Project Stats

- ⭐ Stars: ${stargazers_count}
- 🍴 Forks: ${forks_count}
- 🐛 Issues: ${repoData.open_issues_count}
- 📝 Language: ${language || 'Multiple'}

---

⭐️ If you found this project helpful, please give it a star!

${homepage ? `🌐 **Live Demo**: [${homepage}](${homepage})` : ''}`;
};

const generateBadges = (repoData: GitHubRepoData): string => {
  const { language, license, owner, name, framework } = repoData;
  const badges = [];

  // Language badge
  if (language) {
    const languageBadges = {
      JavaScript: '![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)',
      TypeScript: '![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)',
      Python: '![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)',
      Java: '![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=java&logoColor=white)',
      'C++': '![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)',
      Go: '![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)',
      Rust: '![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)',
      PHP: '![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)',
      Ruby: '![Ruby](https://img.shields.io/badge/ruby-%23CC342D.svg?style=for-the-badge&logo=ruby&logoColor=white)',
      Swift: '![Swift](https://img.shields.io/badge/swift-F54A2A?style=for-the-badge&logo=swift&logoColor=white)',
    };
    badges.push(languageBadges[language as keyof typeof languageBadges] || `![${language}](https://img.shields.io/badge/${language}-blue?style=for-the-badge)`);
  }

  // Framework badge
  if (framework) {
    const frameworkBadges = {
      'React': '![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)',
      'Next.js': '![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)',
      'Vue.js': '![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)',
      'Angular': '![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)',
      'Express.js': '![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)',
      'Vite': '![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)',
    };
    if (frameworkBadges[framework as keyof typeof frameworkBadges]) {
      badges.push(frameworkBadges[framework as keyof typeof frameworkBadges]);
    }
  }

  // License badge
  if (license) {
    badges.push(`![License](https://img.shields.io/badge/license-${license.spdx_id || license.name}-blue.svg?style=for-the-badge)`);
  }

  // GitHub badges
  badges.push(`![GitHub stars](https://img.shields.io/github/stars/${owner.login}/${name}?style=for-the-badge)`);
  badges.push(`![GitHub forks](https://img.shields.io/github/forks/${owner.login}/${name}?style=for-the-badge)`);

  return badges.join(' ');
};

const generateFeaturesSection = (repoData: GitHubRepoData): string => {
  const { framework, hasTests, hasDockerfile, language, projectType } = repoData;
  const features = [];

  // Based on project type
  switch (projectType) {
    case 'Web Application':
      features.push('🌐 Modern web application with responsive design');
      features.push('⚡ Fast and optimized performance');
      features.push('🎨 Beautiful and intuitive user interface');
      break;
    case 'API/Backend':
      features.push('🚀 RESTful API with comprehensive endpoints');
      features.push('🔒 Secure authentication and authorization');
      features.push('📊 Database integration and data management');
      break;
    case 'Library/Package':
      features.push('📦 Easy to install and integrate');
      features.push('🔧 Flexible configuration options');
      features.push('📚 Comprehensive documentation');
      break;
    default:
      features.push('✨ Clean and maintainable codebase');
      features.push('🔧 Easy to configure and customize');
      features.push('📱 Cross-platform compatibility');
  }

  // Framework-specific features
  if (framework) {
    switch (framework) {
      case 'React':
        features.push('⚛️ Built with React for component-based architecture');
        break;
      case 'Next.js':
        features.push('🔥 Server-side rendering with Next.js');
        break;
      case 'Vue.js':
        features.push('💚 Vue.js for reactive user interfaces');
        break;
      case 'Express.js':
        features.push('🚂 Express.js for robust server-side logic');
        break;
    }
  }

  // Additional features
  if (hasTests) {
    features.push('🧪 Comprehensive test coverage');
  }
  if (hasDockerfile) {
    features.push('🐳 Docker support for easy deployment');
  }

  return features.join('\n');
};

const generatePrerequisites = (repoData: GitHubRepoData): string => {
  const { language, framework } = repoData;
  const prerequisites = [];

  switch (language) {
    case 'JavaScript':
    case 'TypeScript':
      prerequisites.push('- Node.js (version 16 or higher)');
      prerequisites.push('- npm or yarn package manager');
      break;
    case 'Python':
      prerequisites.push('- Python 3.8 or higher');
      prerequisites.push('- pip package manager');
      break;
    case 'Java':
      prerequisites.push('- Java Development Kit (JDK) 11 or higher');
      prerequisites.push('- Maven or Gradle build tool');
      break;
    case 'Go':
      prerequisites.push('- Go 1.19 or higher');
      break;
    case 'Rust':
      prerequisites.push('- Rust 1.60 or higher');
      prerequisites.push('- Cargo package manager');
      break;
    default:
      prerequisites.push(`- ${language || 'Required'} development environment`);
  }

  prerequisites.push('- Git for version control');

  return prerequisites.join('\n');
};

const generateInstallationSection = (repoData: GitHubRepoData): string => {
  const { name, owner, language, clone_url } = repoData;
  const repoName = name.toLowerCase().replace(/\s+/g, '-');

  let installation = `\`\`\`bash
# Clone the repository
git clone ${clone_url}

# Navigate to the project directory
cd ${repoName}
`;

  switch (language) {
    case 'JavaScript':
    case 'TypeScript':
      installation += `
# Install dependencies
npm install

# Or using yarn
yarn install
`;
      break;
    case 'Python':
      installation += `
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
`;
      break;
    case 'Java':
      installation += `
# Build the project
mvn clean install

# Or using Gradle
gradle build
`;
      break;
    case 'Go':
      installation += `
# Download dependencies
go mod download

# Build the project
go build
`;
      break;
    case 'Rust':
      installation += `
# Build the project
cargo build --release
`;
      break;
  }

  installation += '```';
  return installation;
};

const generateUsageSection = (repoData: GitHubRepoData): string => {
  const { language, scripts, projectType, framework } = repoData;

  let usage = '';

  // Based on project type
  switch (projectType) {
    case 'Web Application':
      usage = `\`\`\`bash
# Start the development server
${scripts?.dev || scripts?.start || 'npm run dev'}

# Build for production
${scripts?.build || 'npm run build'}

# Start production server
${scripts?.start || 'npm start'}
\`\`\`

Visit \`http://localhost:3000\` to view the application.`;
      break;
    case 'API/Backend':
      usage = `\`\`\`bash
# Start the server
${scripts?.start || scripts?.dev || 'npm start'}

# Run in development mode
${scripts?.dev || 'npm run dev'}
\`\`\`

The API will be available at \`http://localhost:3000\` (or your configured port).`;
      break;
    case 'CLI Tool':
      usage = `\`\`\`bash
# Run the CLI tool
${language === 'JavaScript' || language === 'TypeScript' ? 'node' : language?.toLowerCase() || 'run'} ${repoData.name.toLowerCase()}

# Show help
${repoData.name.toLowerCase()} --help
\`\`\``;
      break;
    default:
      switch (language) {
        case 'JavaScript':
        case 'TypeScript':
          usage = `\`\`\`bash
# Run the application
${scripts?.start || 'npm start'}

# Run in development mode
${scripts?.dev || 'npm run dev'}
\`\`\``;
          break;
        case 'Python':
          usage = `\`\`\`bash
# Run the application
python main.py

# Or if using a specific entry point
python -m ${repoData.name.toLowerCase().replace('-', '_')}
\`\`\``;
          break;
        case 'Java':
          usage = `\`\`\`bash
# Run the application
java -jar target/${repoData.name.toLowerCase()}.jar

# Or using Maven
mvn spring-boot:run
\`\`\``;
          break;
        case 'Go':
          usage = `\`\`\`bash
# Run the application
go run main.go

# Or run the built binary
./${repoData.name.toLowerCase()}
\`\`\``;
          break;
        case 'Rust':
          usage = `\`\`\`bash
# Run the application
cargo run

# Or run the built binary
./target/release/${repoData.name.toLowerCase()}
\`\`\``;
          break;
        default:
          usage = `\`\`\`bash
# Run the application
# Add specific usage instructions here
\`\`\``;
      }
  }

  return usage;
};

const generateAPISection = (repoData: GitHubRepoData): string => {
  const { projectType } = repoData;
  
  if (projectType === 'API/Backend') {
    return `## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | \`/\`      | Health check |
| GET    | \`/users\` | Get all users |
| POST   | \`/users\` | Create a new user |
| GET    | \`/users/:id\` | Get user by ID |
| PUT    | \`/users/:id\` | Update user |
| DELETE | \`/users/:id\` | Delete user |

### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/users
\`\`\`

### Example Response
\`\`\`json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

`;
  }
  
  return '';
};

const generateScriptsSection = (scripts: Record<string, string> = {}): string => {
  if (Object.keys(scripts).length === 0) return '';

  let section = `## 📜 Available Scripts

| Script | Description |
|--------|-------------|
`;

  Object.entries(scripts).forEach(([script, command]) => {
    const description = getScriptDescription(script);
    section += `| \`npm run ${script}\` | ${description} |\n`;
  });

  return section + '\n';
};

const getScriptDescription = (script: string): string => {
  const descriptions: Record<string, string> = {
    'start': 'Start the production server',
    'dev': 'Start the development server',
    'build': 'Build the project for production',
    'test': 'Run the test suite',
    'lint': 'Run the linter',
    'format': 'Format the code',
    'type-check': 'Run TypeScript type checking',
    'preview': 'Preview the production build',
    'deploy': 'Deploy the application',
  };

  return descriptions[script] || `Run ${script}`;
};

const generateProjectStructure = (repoData: GitHubRepoData): string => {
  const { files, language } = repoData;
  
  // Generate a basic structure based on common patterns
  let structure = `${repoData.name}/
├── README.md
`;

  // Add language-specific files
  if (language === 'JavaScript' || language === 'TypeScript') {
    structure += `├── package.json
├── src/
│   ├── index.${language === 'TypeScript' ? 'ts' : 'js'}
│   └── components/
├── public/
└── dist/`;
  } else if (language === 'Python') {
    structure += `├── requirements.txt
├── src/
│   └── main.py
├── tests/
└── docs/`;
  } else if (language === 'Java') {
    structure += `├── pom.xml
├── src/
│   ├── main/java/
│   └── test/java/
└── target/`;
  } else {
    structure += `├── src/
├── tests/
├── docs/
└── build/`;
  }

  return structure;
};

const generateTechStack = (repoData: GitHubRepoData): string => {
  const { language, framework, dependencies = [], devDependencies = [] } = repoData;
  const stack = [];

  // Primary language
  if (language) {
    stack.push(`- **${language}** - Primary programming language`);
  }

  // Framework
  if (framework) {
    stack.push(`- **${framework}** - Application framework`);
  }

  // Key dependencies
  const keyDeps = [...dependencies, ...devDependencies].filter(dep => 
    ['react', 'vue', 'angular', 'express', 'fastify', 'next', 'nuxt', 'gatsby', 'webpack', 'vite', 'typescript'].includes(dep)
  );

  keyDeps.forEach(dep => {
    const descriptions: Record<string, string> = {
      'react': 'UI library',
      'vue': 'Progressive framework',
      'angular': 'Platform for building mobile and desktop web applications',
      'express': 'Web application framework',
      'fastify': 'Fast and low overhead web framework',
      'next': 'React framework',
      'nuxt': 'Vue.js framework',
      'gatsby': 'Static site generator',
      'webpack': 'Module bundler',
      'vite': 'Build tool',
      'typescript': 'Typed superset of JavaScript',
    };
    
    stack.push(`- **${dep}** - ${descriptions[dep] || 'Development tool'}`);
  });

  return stack.join('\n');
};

const generateContributingSection = (repoData: GitHubRepoData): string => {
  return `## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Process

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
7. Push to the branch (\`git push origin feature/amazing-feature\`)
8. Open a Pull Request

### Code Style

- Follow the existing code style
- Run the linter before submitting: \`${repoData.scripts?.lint || 'npm run lint'}\`
- Write meaningful commit messages
- Add tests for new features

### Reporting Issues

- Use the GitHub issue tracker
- Provide detailed information about the bug
- Include steps to reproduce the issue
- Add relevant labels

`;
};

const generateLicenseSection = (license: any): string => {
  if (!license) {
    return `This project is open source. Please check the repository for license information.`;
  }

  return `This project is licensed under the ${license.name} License - see the [LICENSE](LICENSE) file for details.

### License Summary

The ${license.name} license is a ${license.spdx_id === 'MIT' ? 'permissive' : 'copyleft'} license that ${
  license.spdx_id === 'MIT' 
    ? 'allows for commercial use, modification, distribution, and private use.'
    : 'requires derivative works to be licensed under the same terms.'
}`;
};

// Legacy function for backward compatibility
interface ReadmeData {
  name: string;
  description: string;
  language: string;
  features: string;
  installation: string;
  usage: string;
  contributing: string;
  license: string;
}

export const generateReadme = (data: ReadmeData): string => {
  const { name, description, language, features, installation, usage, license } = data;
  
  const featuresArray = features.split('\n').filter(f => f.trim()).map(f => f.trim());
  const languageBadge = getLanguageBadge(language);
  const licenseBadge = `![License](https://img.shields.io/badge/license-${license}-blue.svg)`;
  
  return `# ${name}

${languageBadge} ${licenseBadge} ![Status](https://img.shields.io/badge/status-active-success.svg)

${description}

## 🚀 Features

${featuresArray.length > 0 
  ? featuresArray.map(feature => `- ${feature}`).join('\n')
  : '- Feature 1\n- Feature 2\n- Feature 3'
}

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- ${getPrerequisites(language)}
- Git installed on your machine
- A code editor of your choice

## 🛠️ Installation

${installation || getDefaultInstallation(language, name)}

## 💻 Usage

${usage || getDefaultUsage(language, name)}

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

---

⭐️ If you found this project helpful, please give it a star!`;
};

const getLanguageBadge = (language: string): string => {
  const badges = {
    JavaScript: '![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)',
    TypeScript: '![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)',
    Python: '![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)',
    Java: '![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=java&logoColor=white)',
    'C++': '![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)',
    Go: '![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)',
    Rust: '![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)',
    PHP: '![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)',
    Ruby: '![Ruby](https://img.shields.io/badge/ruby-%23CC342D.svg?style=for-the-badge&logo=ruby&logoColor=white)',
    Swift: '![Swift](https://img.shields.io/badge/swift-F54A2A?style=for-the-badge&logo=swift&logoColor=white)',
  };
  
  return badges[language as keyof typeof badges] || `![${language}](https://img.shields.io/badge/${language}-blue?style=for-the-badge)`;
};

const getPrerequisites = (language: string): string => {
  const prerequisites = {
    JavaScript: 'Node.js (version 14 or higher)',
    TypeScript: 'Node.js (version 14 or higher) and TypeScript',
    Python: 'Python 3.7 or higher',
    Java: 'Java Development Kit (JDK) 11 or higher',
    'C++': 'C++ compiler (GCC, Clang, or MSVC)',
    Go: 'Go 1.16 or higher',
    Rust: 'Rust 1.50 or higher',
    PHP: 'PHP 7.4 or higher',
    Ruby: 'Ruby 2.7 or higher',
    Swift: 'Swift 5.0 or higher',
  };
  
  return prerequisites[language as keyof typeof prerequisites] || `${language} development environment`;
};

const getDefaultInstallation = (language: string, projectName: string): string => {
  const instructions = {
    JavaScript: `\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/${projectName.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to the project directory
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install
\`\`\``,
    TypeScript: `\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/${projectName.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to the project directory
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Build the project
npm run build
\`\`\``,
    Python: `\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/${projectName.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to the project directory
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
\`\`\``,
  };
  
  return instructions[language as keyof typeof instructions] || `\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/${projectName.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to the project directory
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Follow language-specific setup instructions
\`\`\``;
};

const getDefaultUsage = (language: string, projectName: string): string => {
  const examples = {
    JavaScript: `\`\`\`bash
# Start the application
npm start

# Run in development mode
npm run dev
\`\`\``,
    TypeScript: `\`\`\`bash
# Start the application
npm start

# Run in development mode
npm run dev

# Run tests
npm test
\`\`\``,
    Python: `\`\`\`bash
# Run the application
python main.py

# Run with arguments
python main.py --option value
\`\`\``,
  };
  
  return examples[language as keyof typeof examples] || `\`\`\`bash
# Run the application
# Add specific usage instructions here
\`\`\``;
};