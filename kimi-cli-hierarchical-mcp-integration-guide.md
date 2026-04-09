# Kimi CLI Hierarchical MCP Agents Integration Guide

## สารบัญ
1. [ภาพรวมระบบ](#1-ภาพรวมระบบ)
2. [Architecture Overview](#2-architecture-overview)
3. [Prerequisites & Environment Setup](#3-prerequisites--environment-setup)
4. [Configuration Files](#4-configuration-files)
5. [Installation Guide](#5-installation-guide)
6. [Task Steps Definition](#6-task-steps-definition)
7. [Style Guidelines](#7-style-guidelines)
8. [Usage Examples](#8-usage-examples)
9. [Testing & Debugging](#9-testing--debugging)
10. [Troubleshooting Guide](#10-troubleshooting-guide)

---

## 1. ภาพรวมระบบ

### 1.1 什么是 Hierarchical MCP Agents?

Hierarchical MCP Agents คือระบบ AI Agents ที่มีโครงสร้างเป็นลำดับชั้น (Hierarchy) ประกอบด้วย:

```
┌─────────────────────────────────────────────────────────────┐
│                    Orchestrator Agent                        │
│              (ผู้ประสานงานหลัก - กำหนดทิศทาง)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
│   Planner    │ │  Research │ │   Coder     │
│    Agent     │ │   Agent   │ │   Agent     │
└───────┬──────┘ └─────┬─────┘ └──────┬──────┘
        │              │              │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │Sub-Task │    │Sub-Task │    │Sub-Task │
   │Handlers │    │Handlers │    │Handlers │
   └─────────┘    └─────────┘    └─────────┘
```

### 1.2 ความสามารถหลัก

- **Task Decomposition**: แบ่งงานใหญ่เป็นงานย่อย
- **Agent Coordination**: ประสานงานระหว่าง Agents
- **Context Sharing**: แบ่งปันบริบทระหว่างลำดับชั้น
- **Result Aggregation**: รวมผลลัพธ์จากหลาย Agents
- **Error Handling**: จัดการข้อผิดพลาดแบบลำดับชั้น

---

## 2. Architecture Overview

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Kimi CLI                                  │
│              (Command Line Interface)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    MCP Client Layer                              │
│         (MCP Protocol - Model Context Protocol)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌──────▼───────┐
│   MCP Server │  │   MCP Server    │  │  MCP Server  │
│  (Orchestrator)│  │   (Specialized) │  │  (Tools)     │
└───────┬──────┘  └────────┬────────┘  └──────┬───────┘
        │                  │                  │
   ┌────▼──────────────────▼──────────────────▼────┐
   │         Hierarchical Agent System              │
   │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
   │  │  Agent  │  │  Agent  │  │  Agent  │        │
   │  │ Level 1 │  │ Level 2 │  │ Level 3 │        │
   │  └─────────┘  └─────────┘  └─────────┘        │
   └────────────────────────────────────────────────┘
```

### 2.2 Communication Flow

```
1. User Input → Kimi CLI
2. Kimi CLI → MCP Client
3. MCP Client → Orchestrator Agent
4. Orchestrator → Task Analysis
5. Task Decomposition → Sub-tasks
6. Sub-tasks → Specialized Agents
7. Results Aggregation → Final Response
```

---

## 3. Prerequisites & Environment Setup

### 3.1 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | macOS 12+ / Ubuntu 20.04+ / Windows 10+ | macOS 14+ / Ubuntu 22.04+ |
| RAM | 8 GB | 16 GB |
| Disk Space | 2 GB | 5 GB |
| Node.js | 18.x | 20.x LTS |
| Python | 3.9+ | 3.11+ |

### 3.2 Required Software

#### 3.2.1 Node.js & npm
```bash
# ตรวจสอบเวอร์ชัน
node --version  # v18.x หรือสูงกว่า
npm --version   # v9.x หรือสูงกว่า

# ติดตั้ง (ถ้ายังไม่มี)
# macOS (ใช้ Homebrew)
brew install node@20

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows (ใช้ Chocolatey)
choco install nodejs
```

#### 3.2.2 Python & pip
```bash
# ตรวจสอบเวอร์ชัน
python3 --version  # 3.9+ หรือสูงกว่า
pip3 --version

# ติดตั้ง (ถ้ายังไม่มี)
# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3.11 python3.11-pip

# Windows
choco install python
```

#### 3.2.3 Kimi CLI Installation
```bash
# ติดตั้ง Kimi CLI ผ่าน npm
npm install -g @kimi-ai/cli

# ตรวจสอบการติดตั้ง
kimi --version

# Login เข้าสู่ระบบ
kimi login
```

### 3.3 Environment Variables

สร้างไฟล์ `.env` ในโปรเจค:

```bash
# ~/.kimi-mcp-agents/.env

# Kimi API Configuration
KIMI_API_KEY=your_kimi_api_key_here
KIMI_BASE_URL=https://api.moonshot.cn/v1

# MCP Server Configuration
MCP_ORCHESTRATOR_PORT=3000
MCP_PLANNER_PORT=3001
MCP_CODER_PORT=3002
MCP_RESEARCH_PORT=3003

# Agent Configuration
AGENT_MAX_DEPTH=3
AGENT_TIMEOUT_MS=30000
AGENT_MAX_RETRIES=3

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/mcp-agents.log

# Optional: External Services
OPENAI_API_KEY=optional_openai_key
ANTHROPIC_API_KEY=optional_anthropic_key
```

### 3.4 Directory Structure

```
~/kimi-mcp-agents/
├── .env                          # Environment variables
├── .env.example                  # Example environment file
├── package.json                  # Node.js dependencies
├── requirements.txt              # Python dependencies
├── cline_mcp_settings.json       # Main MCP configuration
├── config/
│   ├── agents/                   # Agent configurations
│   │   ├── orchestrator.json
│   │   ├── planner.json
│   │   ├── coder.json
│   │   └── researcher.json
│   ├── tasks/                    # Task definitions
│   │   ├── task-templates.json
│   │   └── task-steps.json
│   └── styles/                   # Style guidelines
│       ├── coding-style.json
│       └── communication-style.json
├── src/
│   ├── agents/                   # Agent implementations
│   │   ├── orchestrator.js
│   │   ├── base-agent.js
│   │   ├── planner-agent.js
│   │   ├── coder-agent.js
│   │   └── researcher-agent.js
│   ├── mcp-servers/              # MCP server implementations
│   │   ├── orchestrator-server.js
│   │   ├── planner-server.js
│   │   ├── coder-server.js
│   │   └── research-server.js
│   ├── utils/                    # Utilities
│   │   ├── logger.js
│   │   ├── context-manager.js
│   │   └── error-handler.js
│   └── index.js                  # Main entry point
├── tests/                        # Test files
├── logs/                         # Log files
└── docs/                         # Documentation
```

---

## 4. Configuration Files

### 4.1 Main Configuration: cline_mcp_settings.json

```json
{
  "mcpServers": {
    "orchestrator": {
      "command": "node",
      "args": [
        "/Users/username/kimi-mcp-agents/src/mcp-servers/orchestrator-server.js"
      ],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}",
        "MCP_PORT": "3000",
        "AGENT_MAX_DEPTH": "3",
        "LOG_LEVEL": "info"
      },
      "disabled": false,
      "autoApprove": [],
      "timeout": 30000
    },
    "planner": {
      "command": "node",
      "args": [
        "/Users/username/kimi-mcp-agents/src/mcp-servers/planner-server.js"
      ],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}",
        "MCP_PORT": "3001",
        "PLANNER_MODE": "hierarchical",
        "LOG_LEVEL": "info"
      },
      "disabled": false,
      "autoApprove": [],
      "timeout": 30000
    },
    "coder": {
      "command": "node",
      "args": [
        "/Users/username/kimi-mcp-agents/src/mcp-servers/coder-server.js"
      ],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}",
        "MCP_PORT": "3002",
        "CODE_STYLE": "standard",
        "LOG_LEVEL": "info"
      },
      "disabled": false,
      "autoApprove": [],
      "timeout": 60000
    },
    "researcher": {
      "command": "node",
      "args": [
        "/Users/username/kimi-mcp-agents/src/mcp-servers/research-server.js"
      ],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}",
        "MCP_PORT": "3003",
        "SEARCH_PROVIDER": "brave",
        "LOG_LEVEL": "info"
      },
      "disabled": false,
      "autoApprove": [],
      "timeout": 45000
    }
  },
  "hierarchicalConfig": {
    "levels": [
      {
        "level": 1,
        "name": "orchestrator",
        "description": "Main coordinator for all tasks",
        "capabilities": ["task_decomposition", "agent_coordination", "result_aggregation"],
        "childAgents": ["planner", "coder", "researcher"],
        "maxDepth": 3
      },
      {
        "level": 2,
        "name": "planner",
        "description": "Task planning and strategy",
        "capabilities": ["task_breakdown", "dependency_analysis", "timeline_estimation"],
        "childAgents": [],
        "maxDepth": 2
      },
      {
        "level": 2,
        "name": "coder",
        "description": "Code generation and implementation",
        "capabilities": ["code_generation", "code_review", "refactoring", "debugging"],
        "childAgents": [],
        "maxDepth": 2
      },
      {
        "level": 2,
        "name": "researcher",
        "description": "Information gathering and analysis",
        "capabilities": ["web_search", "data_analysis", "summarization"],
        "childAgents": [],
        "maxDepth": 2
      }
    ],
    "communication": {
      "protocol": "mcp",
      "messageFormat": "json",
      "contextSharing": true,
      "errorPropagation": true
    },
    "taskRouting": {
      "defaultAgent": "orchestrator",
      "routingRules": [
        {
          "pattern": "plan|strategy|roadmap|timeline",
          "targetAgent": "planner"
        },
        {
          "pattern": "code|implement|develop|program|function|class",
          "targetAgent": "coder"
        },
        {
          "pattern": "research|find|search|analyze|investigate",
          "targetAgent": "researcher"
        }
      ]
    }
  }
}
```

### 4.2 Agent Configuration Files

#### 4.2.1 Orchestrator Agent Config

```json
{
  "name": "orchestrator",
  "version": "1.0.0",
  "description": "Main coordinator for hierarchical MCP agents",
  "capabilities": {
    "taskDecomposition": {
      "enabled": true,
      "maxSubTasks": 10,
      "strategy": "parallel"
    },
    "agentCoordination": {
      "enabled": true,
      "coordinationMode": "hierarchical",
      "timeout": 30000
    },
    "contextManagement": {
      "enabled": true,
      "maxContextSize": 100000,
      "contextSharing": true
    },
    "resultAggregation": {
      "enabled": true,
      "aggregationStrategy": "merge",
      "deduplication": true
    }
  },
  "tools": [
    {
      "name": "decompose_task",
      "description": "Break down a complex task into sub-tasks",
      "parameters": {
        "type": "object",
        "properties": {
          "task": {
            "type": "string",
            "description": "The task to decompose"
          },
          "complexity": {
            "type": "string",
            "enum": ["low", "medium", "high"],
            "description": "Task complexity level"
          }
        },
        "required": ["task"]
      }
    },
    {
      "name": "delegate_task",
      "description": "Delegate a task to a specialized agent",
      "parameters": {
        "type": "object",
        "properties": {
          "task": {
            "type": "string",
            "description": "The task to delegate"
          },
          "agentType": {
            "type": "string",
            "enum": ["planner", "coder", "researcher"],
            "description": "Target agent type"
          },
          "context": {
            "type": "object",
            "description": "Additional context for the task"
          }
        },
        "required": ["task", "agentType"]
      }
    },
    {
      "name": "aggregate_results",
      "description": "Combine results from multiple agents",
      "parameters": {
        "type": "object",
        "properties": {
          "results": {
            "type": "array",
            "description": "Array of results to aggregate"
          },
          "strategy": {
            "type": "string",
            "enum": ["merge", "concatenate", "summarize"],
            "description": "Aggregation strategy"
          }
        },
        "required": ["results"]
      }
    }
  ],
  "systemPrompt": "You are the Orchestrator Agent for a hierarchical MCP system. Your role is to:\n1. Analyze incoming tasks and determine complexity\n2. Decompose complex tasks into manageable sub-tasks\n3. Delegate sub-tasks to appropriate specialized agents\n4. Coordinate communication between agents\n5. Aggregate results and provide coherent responses\n\nAlways follow the task steps and style guidelines provided in the context."
}
```

#### 4.2.2 Planner Agent Config

```json
{
  "name": "planner",
  "version": "1.0.0",
  "description": "Task planning and strategy agent",
  "capabilities": {
    "taskBreakdown": {
      "enabled": true,
      "granularity": "medium",
      "includeDependencies": true
    },
    "timelineEstimation": {
      "enabled": true,
      "unit": "hours",
      "includeBuffers": true
    },
    "resourceAllocation": {
      "enabled": true,
      "trackResources": true
    }
  },
  "tools": [
    {
      "name": "create_plan",
      "description": "Create a detailed execution plan",
      "parameters": {
        "type": "object",
        "properties": {
          "objective": {
            "type": "string",
            "description": "The main objective"
          },
          "constraints": {
            "type": "array",
            "items": { "type": "string" },
            "description": "List of constraints"
          },
          "deadline": {
            "type": "string",
            "description": "Target completion date (ISO format)"
          }
        },
        "required": ["objective"]
      }
    },
    {
      "name": "estimate_timeline",
      "description": "Estimate timeline for tasks",
      "parameters": {
        "type": "object",
        "properties": {
          "tasks": {
            "type": "array",
            "description": "List of tasks to estimate"
          },
          "complexity": {
            "type": "string",
            "enum": ["low", "medium", "high"]
          }
        },
        "required": ["tasks"]
      }
    }
  ],
  "systemPrompt": "You are the Planner Agent. Your role is to:\n1. Create detailed, actionable plans\n2. Break down objectives into specific tasks\n3. Identify dependencies between tasks\n4. Estimate realistic timelines\n5. Consider constraints and resources\n\nAlways provide structured plans with clear steps and milestones."
}
```

#### 4.2.3 Coder Agent Config

```json
{
  "name": "coder",
  "version": "1.0.0",
  "description": "Code generation and implementation agent",
  "capabilities": {
    "codeGeneration": {
      "enabled": true,
      "languages": ["javascript", "python", "typescript", "java", "go"],
      "includeComments": true,
      "includeTests": true
    },
    "codeReview": {
      "enabled": true,
      "checkStyle": true,
      "checkSecurity": true,
      "checkPerformance": true
    },
    "refactoring": {
      "enabled": true,
      "patterns": ["extract-method", "rename", "inline"]
    }
  },
  "tools": [
    {
      "name": "generate_code",
      "description": "Generate code based on requirements",
      "parameters": {
        "type": "object",
        "properties": {
          "requirements": {
            "type": "string",
            "description": "Code requirements"
          },
          "language": {
            "type": "string",
            "description": "Programming language"
          },
          "style": {
            "type": "string",
            "enum": ["standard", "compact", "verbose"]
          }
        },
        "required": ["requirements", "language"]
      }
    },
    {
      "name": "review_code",
      "description": "Review code for issues",
      "parameters": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "Code to review"
          },
          "language": {
            "type": "string",
            "description": "Programming language"
          }
        },
        "required": ["code"]
      }
    }
  ],
  "systemPrompt": "You are the Coder Agent. Your role is to:\n1. Generate clean, efficient, and well-documented code\n2. Follow best practices and coding standards\n3. Include appropriate error handling\n4. Write comprehensive tests\n5. Review code for quality and security\n\nAlways follow the coding style guidelines and provide production-ready code."
}
```

#### 4.2.4 Researcher Agent Config

```json
{
  "name": "researcher",
  "version": "1.0.0",
  "description": "Information gathering and analysis agent",
  "capabilities": {
    "webSearch": {
      "enabled": true,
      "providers": ["brave", "google", "bing"],
      "maxResults": 10
    },
    "dataAnalysis": {
      "enabled": true,
      "supportedFormats": ["json", "csv", "xml"]
    },
    "summarization": {
      "enabled": true,
      "maxLength": 500,
      "includeSources": true
    }
  },
  "tools": [
    {
      "name": "search_web",
      "description": "Search the web for information",
      "parameters": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Search query"
          },
          "maxResults": {
            "type": "number",
            "description": "Maximum results to return"
          }
        },
        "required": ["query"]
      }
    },
    {
      "name": "analyze_data",
      "description": "Analyze data and extract insights",
      "parameters": {
        "type": "object",
        "properties": {
          "data": {
            "type": "string",
            "description": "Data to analyze"
          },
          "analysisType": {
            "type": "string",
            "enum": ["summary", "trends", "comparison"]
          }
        },
        "required": ["data"]
      }
    }
  ],
  "systemPrompt": "You are the Researcher Agent. Your role is to:\n1. Search for accurate and relevant information\n2. Analyze data and extract insights\n3. Summarize findings clearly\n4. Cite sources appropriately\n5. Provide evidence-based recommendations\n\nAlways verify information from multiple sources when possible."
}
```

### 4.3 Task Steps Configuration

```json
{
  "taskSteps": {
    "default": {
      "steps": [
        {
          "order": 1,
          "name": "analyze",
          "description": "Analyze the task requirements",
          "agent": "orchestrator",
          "output": "task_analysis"
        },
        {
          "order": 2,
          "name": "plan",
          "description": "Create execution plan",
          "agent": "planner",
          "output": "execution_plan",
          "dependsOn": ["analyze"]
        },
        {
          "order": 3,
          "name": "execute",
          "description": "Execute the planned tasks",
          "agent": "auto",
          "output": "execution_results",
          "dependsOn": ["plan"]
        },
        {
          "order": 4,
          "name": "review",
          "description": "Review and validate results",
          "agent": "orchestrator",
          "output": "final_review",
          "dependsOn": ["execute"]
        }
      ]
    },
    "coding": {
      "steps": [
        {
          "order": 1,
          "name": "analyze_requirements",
          "description": "Analyze coding requirements",
          "agent": "orchestrator",
          "output": "requirements_analysis"
        },
        {
          "order": 2,
          "name": "design",
          "description": "Design solution architecture",
          "agent": "planner",
          "output": "design_document",
          "dependsOn": ["analyze_requirements"]
        },
        {
          "order": 3,
          "name": "implement",
          "description": "Implement the solution",
          "agent": "coder",
          "output": "code_implementation",
          "dependsOn": ["design"]
        },
        {
          "order": 4,
          "name": "test",
          "description": "Write and run tests",
          "agent": "coder",
          "output": "test_results",
          "dependsOn": ["implement"]
        },
        {
          "order": 5,
          "name": "review",
          "description": "Code review",
          "agent": "coder",
          "output": "review_report",
          "dependsOn": ["test"]
        }
      ]
    },
    "research": {
      "steps": [
        {
          "order": 1,
          "name": "define_scope",
          "description": "Define research scope",
          "agent": "orchestrator",
          "output": "research_scope"
        },
        {
          "order": 2,
          "name": "gather",
          "description": "Gather information",
          "agent": "researcher",
          "output": "raw_data",
          "dependsOn": ["define_scope"]
        },
        {
          "order": 3,
          "name": "analyze",
          "description": "Analyze gathered data",
          "agent": "researcher",
          "output": "analysis_report",
          "dependsOn": ["gather"]
        },
        {
          "order": 4,
          "name": "synthesize",
          "description": "Synthesize findings",
          "agent": "researcher",
          "output": "final_report",
          "dependsOn": ["analyze"]
        }
      ]
    }
  }
}
```

---

## 5. Installation Guide

### 5.1 Step-by-Step Installation

#### Step 1: Create Project Directory
```bash
# สร้างโฟลเดอร์หลัก
mkdir -p ~/kimi-mcp-agents
cd ~/kimi-mcp-agents

# สร้างโครงสร้างโฟลเดอร์
mkdir -p src/{agents,mcp-servers,utils}
mkdir -p config/{agents,tasks,styles}
mkdir -p tests logs docs
```

#### Step 2: Initialize Node.js Project
```bash
# Initialize package.json
npm init -y

# Install required dependencies
npm install @modelcontextprotocol/sdk
npm install axios
npm install dotenv
npm install winston
npm install express

# Install dev dependencies
npm install --save-dev nodemon
npm install --save-dev jest
```

#### Step 3: Create package.json
```json
{
  "name": "kimi-mcp-hierarchical-agents",
  "version": "1.0.0",
  "description": "Hierarchical MCP Agents for Kimi CLI",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "start:orchestrator": "node src/mcp-servers/orchestrator-server.js",
    "start:planner": "node src/mcp-servers/planner-server.js",
    "start:coder": "node src/mcp-servers/coder-server.js",
    "start:researcher": "node src/mcp-servers/research-server.js"
  },
  "keywords": ["mcp", "kimi", "agents", "hierarchical"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "axios": "^1.6.0",
    "dotenv": "^16.3.0",
    "express": "^4.18.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.0"
  }
}
```

#### Step 4: Create Environment File
```bash
# สร้างไฟล์ .env
cat > .env << 'EOF'
# Kimi API Configuration
KIMI_API_KEY=your_kimi_api_key_here
KIMI_BASE_URL=https://api.moonshot.cn/v1

# MCP Server Configuration
MCP_ORCHESTRATOR_PORT=3000
MCP_PLANNER_PORT=3001
MCP_CODER_PORT=3002
MCP_RESEARCH_PORT=3003

# Agent Configuration
AGENT_MAX_DEPTH=3
AGENT_TIMEOUT_MS=30000
AGENT_MAX_RETRIES=3

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/mcp-agents.log
EOF

# สร้างไฟล์ .env.example
cp .env .env.example
```

#### Step 5: Create Base Agent Implementation

```javascript
// src/agents/base-agent.js
const { EventEmitter } = require('events');
const winston = require('winston');

class BaseAgent extends EventEmitter {
  constructor(config) {
    super();
    this.name = config.name;
    this.version = config.version;
    this.capabilities = config.capabilities || {};
    this.tools = config.tools || [];
    this.systemPrompt = config.systemPrompt || '';
    this.context = {};
    
    // Setup logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
          filename: process.env.LOG_FILE || './logs/agent.log' 
        })
      ]
    });
  }

  async initialize() {
    this.logger.info(`Initializing agent: ${this.name}`);
    this.emit('initialized', { agent: this.name });
  }

  async execute(task, context = {}) {
    this.logger.info(`Executing task: ${task.name || task}`);
    this.context = { ...this.context, ...context };
    
    try {
      const result = await this.processTask(task);
      this.emit('completed', { agent: this.name, result });
      return result;
    } catch (error) {
      this.logger.error(`Task execution failed: ${error.message}`);
      this.emit('error', { agent: this.name, error });
      throw error;
    }
  }

  async processTask(task) {
    throw new Error('processTask must be implemented by subclass');
  }

  getTool(name) {
    return this.tools.find(tool => tool.name === name);
  }

  hasCapability(capability) {
    return this.capabilities[capability]?.enabled === true;
  }

  updateContext(key, value) {
    this.context[key] = value;
    this.emit('contextUpdated', { key, value });
  }

  getContext() {
    return this.context;
  }
}

module.exports = BaseAgent;
```

#### Step 6: Create Orchestrator Agent

```javascript
// src/agents/orchestrator-agent.js
const BaseAgent = require('./base-agent');
const axios = require('axios');

class OrchestratorAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.childAgents = new Map();
    this.taskQueue = [];
    this.maxDepth = parseInt(process.env.AGENT_MAX_DEPTH) || 3;
  }

  async initialize() {
    await super.initialize();
    this.logger.info('Orchestrator initialized with max depth:', this.maxDepth);
  }

  registerChildAgent(name, agent) {
    this.childAgents.set(name, agent);
    this.logger.info(`Registered child agent: ${name}`);
  }

  async processTask(task) {
    const { type, content, depth = 0 } = task;
    
    if (depth >= this.maxDepth) {
      throw new Error(`Maximum recursion depth (${this.maxDepth}) reached`);
    }

    // Analyze task and determine routing
    const analysis = await this.analyzeTask(content);
    this.logger.info('Task analysis:', analysis);

    // Decompose if complex
    if (analysis.complexity === 'high') {
      const subTasks = await this.decomposeTask(content, analysis);
      const results = await this.executeSubTasks(subTasks, depth + 1);
      return this.aggregateResults(results);
    }

    // Route to appropriate agent
    const targetAgent = this.determineTargetAgent(analysis);
    if (targetAgent && targetAgent !== 'orchestrator') {
      return await this.delegateToAgent(targetAgent, content, depth + 1);
    }

    // Execute directly
    return await this.executeDirectly(content);
  }

  async analyzeTask(content) {
    // Simple keyword-based analysis
    const patterns = {
      planner: /plan|strategy|roadmap|timeline|schedule/i,
      coder: /code|implement|develop|program|function|class|api/i,
      researcher: /research|find|search|analyze|investigate|study/i
    };

    let matchedAgent = 'orchestrator';
    for (const [agent, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        matchedAgent = agent;
        break;
      }
    }

    // Determine complexity
    const complexity = content.length > 500 ? 'high' : 
                      content.length > 200 ? 'medium' : 'low';

    return {
      targetAgent: matchedAgent,
      complexity,
      keywords: this.extractKeywords(content)
    };
  }

  extractKeywords(content) {
    const commonWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were']);
    return content.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 10);
  }

  async decomposeTask(content, analysis) {
    const prompt = `Break down this task into sub-tasks:
Task: ${content}
Complexity: ${analysis.complexity}

Provide sub-tasks as a JSON array with format:
[{"name": "sub-task name", "description": "description", "agent": "target agent"}]`;

    try {
      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error) {
      this.logger.error('Task decomposition failed:', error);
      // Fallback: create single sub-task
      return [{ name: 'main-task', description: content, agent: analysis.targetAgent }];
    }
  }

  async executeSubTasks(subTasks, depth) {
    const results = [];
    
    for (const subTask of subTasks) {
      try {
        const result = await this.delegateToAgent(subTask.agent, subTask.description, depth);
        results.push({ task: subTask.name, result, status: 'success' });
      } catch (error) {
        results.push({ task: subTask.name, error: error.message, status: 'failed' });
      }
    }
    
    return results;
  }

  async delegateToAgent(agentName, content, depth) {
    const agent = this.childAgents.get(agentName);
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    this.logger.info(`Delegating to ${agentName} at depth ${depth}`);
    return await agent.execute({ content, depth }, this.context);
  }

  determineTargetAgent(analysis) {
    return analysis.targetAgent;
  }

  async executeDirectly(content) {
    const prompt = `${this.systemPrompt}\n\nTask: ${content}`;
    return await this.callLLM(prompt);
  }

  aggregateResults(results) {
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');

    return {
      summary: `Completed ${successful.length}/${results.length} sub-tasks`,
      successful,
      failed,
      aggregated: successful.map(r => r.result).join('\n\n---\n\n')
    };
  }

  async callLLM(prompt) {
    try {
      const response = await axios.post(
        `${process.env.KIMI_BASE_URL}/chat/completions`,
        {
          model: 'kimi-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('LLM call failed:', error.message);
      throw error;
    }
  }
}

module.exports = OrchestratorAgent;
```

#### Step 7: Create MCP Server Base

```javascript
// src/mcp-servers/base-mcp-server.js
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const winston = require('winston');

class BaseMcpServer {
  constructor(config) {
    this.name = config.name;
    this.version = config.version;
    this.port = config.port || 3000;
    this.tools = config.tools || [];
    this.agent = config.agent;
    
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
          filename: `./logs/${this.name}-server.log` 
        })
      ]
    });

    this.server = new Server(
      { name: this.name, version: this.version },
      { capabilities: { tools: {} } }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.logger.info('ListTools request received');
      return { tools: this.tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      this.logger.info(`CallTool request: ${request.params.name}`);
      return await this.handleToolCall(request.params.name, request.params.arguments);
    });
  }

  async handleToolCall(name, args) {
    throw new Error('handleToolCall must be implemented by subclass');
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info(`${this.name} MCP server started`);
  }
}

module.exports = BaseMcpServer;
```

#### Step 8: Create Orchestrator MCP Server

```javascript
// src/mcp-servers/orchestrator-server.js
#!/usr/bin/env node

require('dotenv').config();
const BaseMcpServer = require('./base-mcp-server');
const OrchestratorAgent = require('../agents/orchestrator-agent');
const PlannerAgent = require('../agents/planner-agent');
const CoderAgent = require('../agents/coder-agent');
const ResearcherAgent = require('../agents/researcher-agent');

const orchestratorConfig = require('../../config/agents/orchestrator.json');
const plannerConfig = require('../../config/agents/planner.json');
const coderConfig = require('../../config/agents/coder.json');
const researcherConfig = require('../../config/agents/researcher.json');

class OrchestratorMcpServer extends BaseMcpServer {
  constructor() {
    super({
      name: 'orchestrator',
      version: '1.0.0',
      port: process.env.MCP_PORT || 3000,
      tools: orchestratorConfig.tools
    });

    this.agent = new OrchestratorAgent(orchestratorConfig);
    this.setupChildAgents();
  }

  setupChildAgents() {
    // Register child agents
    const planner = new PlannerAgent(plannerConfig);
    const coder = new CoderAgent(coderConfig);
    const researcher = new ResearcherAgent(researcherConfig);

    this.agent.registerChildAgent('planner', planner);
    this.agent.registerChildAgent('coder', coder);
    this.agent.registerChildAgent('researcher', researcher);

    this.logger.info('Child agents registered');
  }

  async handleToolCall(name, args) {
    try {
      let result;

      switch (name) {
        case 'decompose_task':
          result = await this.agent.decomposeTask(args.task, { 
            complexity: args.complexity || 'medium' 
          });
          break;

        case 'delegate_task':
          result = await this.agent.delegateToAgent(
            args.agentType, 
            args.task, 
            0
          );
          break;

        case 'aggregate_results':
          result = this.agent.aggregateResults(args.results);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      this.logger.error(`Tool call failed: ${error.message}`);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
}

// Start server
const server = new OrchestratorMcpServer();
server.start().catch(console.error);
```

#### Step 9: Create Configuration Files

```bash
# Create orchestrator config
cat > config/agents/orchestrator.json << 'EOF'
{
  "name": "orchestrator",
  "version": "1.0.0",
  "description": "Main coordinator for hierarchical MCP agents",
  "capabilities": {
    "taskDecomposition": { "enabled": true, "maxSubTasks": 10 },
    "agentCoordination": { "enabled": true, "timeout": 30000 },
    "contextManagement": { "enabled": true, "maxContextSize": 100000 },
    "resultAggregation": { "enabled": true }
  },
  "tools": [
    {
      "name": "decompose_task",
      "description": "Break down a complex task into sub-tasks",
      "inputSchema": {
        "type": "object",
        "properties": {
          "task": { "type": "string" },
          "complexity": { "type": "string", "enum": ["low", "medium", "high"] }
        },
        "required": ["task"]
      }
    },
    {
      "name": "delegate_task",
      "description": "Delegate a task to a specialized agent",
      "inputSchema": {
        "type": "object",
        "properties": {
          "task": { "type": "string" },
          "agentType": { "type": "string", "enum": ["planner", "coder", "researcher"] },
          "context": { "type": "object" }
        },
        "required": ["task", "agentType"]
      }
    }
  ],
  "systemPrompt": "You are the Orchestrator Agent for a hierarchical MCP system."
}
EOF

# Create planner config
cat > config/agents/planner.json << 'EOF'
{
  "name": "planner",
  "version": "1.0.0",
  "description": "Task planning and strategy agent",
  "capabilities": {
    "taskBreakdown": { "enabled": true },
    "timelineEstimation": { "enabled": true },
    "resourceAllocation": { "enabled": true }
  },
  "tools": [
    {
      "name": "create_plan",
      "description": "Create a detailed execution plan",
      "inputSchema": {
        "type": "object",
        "properties": {
          "objective": { "type": "string" },
          "constraints": { "type": "array", "items": { "type": "string" } },
          "deadline": { "type": "string" }
        },
        "required": ["objective"]
      }
    }
  ],
  "systemPrompt": "You are the Planner Agent. Create detailed, actionable plans."
}
EOF

# Create coder config
cat > config/agents/coder.json << 'EOF'
{
  "name": "coder",
  "version": "1.0.0",
  "description": "Code generation and implementation agent",
  "capabilities": {
    "codeGeneration": { "enabled": true, "languages": ["javascript", "python", "typescript"] },
    "codeReview": { "enabled": true },
    "refactoring": { "enabled": true }
  },
  "tools": [
    {
      "name": "generate_code",
      "description": "Generate code based on requirements",
      "inputSchema": {
        "type": "object",
        "properties": {
          "requirements": { "type": "string" },
          "language": { "type": "string" },
          "style": { "type": "string" }
        },
        "required": ["requirements", "language"]
      }
    }
  ],
  "systemPrompt": "You are the Coder Agent. Generate clean, efficient code."
}
EOF

# Create researcher config
cat > config/agents/researcher.json << 'EOF'
{
  "name": "researcher",
  "version": "1.0.0",
  "description": "Information gathering and analysis agent",
  "capabilities": {
    "webSearch": { "enabled": true },
    "dataAnalysis": { "enabled": true },
    "summarization": { "enabled": true }
  },
  "tools": [
    {
      "name": "search_web",
      "description": "Search the web for information",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "maxResults": { "type": "number" }
        },
        "required": ["query"]
      }
    }
  ],
  "systemPrompt": "You are the Researcher Agent. Search for accurate information."
}
EOF
```

#### Step 10: Create Main Entry Point

```javascript
// src/index.js
#!/usr/bin/env node

require('dotenv').config();
const winston = require('winston');

// Setup main logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

class HierarchicalMcpSystem {
  constructor() {
    this.agents = new Map();
    this.servers = new Map();
  }

  async initialize() {
    logger.info('Initializing Hierarchical MCP System...');
    
    // Validate environment
    this.validateEnvironment();
    
    logger.info('System initialized successfully');
    logger.info('Available agents: orchestrator, planner, coder, researcher');
    logger.info('Use "npm run start:<agent>" to start individual servers');
  }

  validateEnvironment() {
    const required = ['KIMI_API_KEY', 'KIMI_BASE_URL'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    logger.info('Environment validation passed');
  }
}

// Run if called directly
if (require.main === module) {
  const system = new HierarchicalMcpSystem();
  system.initialize().catch(error => {
    logger.error('System initialization failed:', error.message);
    process.exit(1);
  });
}

module.exports = HierarchicalMcpSystem;
```

---

## 6. Task Steps Definition

### 6.1 Task Step Templates

```json
{
  "templates": {
    "general": {
      "name": "General Task",
      "description": "Standard task processing workflow",
      "steps": [
        {
          "id": "analyze",
          "name": "Task Analysis",
          "description": "Analyze task requirements and constraints",
          "agent": "orchestrator",
          "inputs": ["task_description"],
          "outputs": ["task_analysis"],
          "validation": "analysis_complete"
        },
        {
          "id": "plan",
          "name": "Planning",
          "description": "Create execution plan",
          "agent": "planner",
          "inputs": ["task_analysis"],
          "outputs": ["execution_plan"],
          "dependsOn": ["analyze"],
          "validation": "plan_approved"
        },
        {
          "id": "execute",
          "name": "Execution",
          "description": "Execute planned tasks",
          "agent": "auto",
          "inputs": ["execution_plan"],
          "outputs": ["execution_results"],
          "dependsOn": ["plan"],
          "validation": "execution_complete"
        },
        {
          "id": "review",
          "name": "Review",
          "description": "Review and validate results",
          "agent": "orchestrator",
          "inputs": ["execution_results"],
          "outputs": ["final_output"],
          "dependsOn": ["execute"],
          "validation": "review_passed"
        }
      ]
    },
    "coding": {
      "name": "Coding Task",
      "description": "Software development workflow",
      "steps": [
        {
          "id": "requirements",
          "name": "Requirements Analysis",
          "description": "Analyze coding requirements",
          "agent": "orchestrator",
          "inputs": ["feature_request"],
          "outputs": ["requirements_doc"]
        },
        {
          "id": "design",
          "name": "Design",
          "description": "Design solution architecture",
          "agent": "planner",
          "inputs": ["requirements_doc"],
          "outputs": ["design_doc"],
          "dependsOn": ["requirements"]
        },
        {
          "id": "implement",
          "name": "Implementation",
          "description": "Write code implementation",
          "agent": "coder",
          "inputs": ["design_doc"],
          "outputs": ["code_files"],
          "dependsOn": ["design"]
        },
        {
          "id": "test",
          "name": "Testing",
          "description": "Write and execute tests",
          "agent": "coder",
          "inputs": ["code_files"],
          "outputs": ["test_results"],
          "dependsOn": ["implement"]
        },
        {
          "id": "review",
          "name": "Code Review",
          "description": "Review code quality",
          "agent": "coder",
          "inputs": ["code_files", "test_results"],
          "outputs": ["review_report"],
          "dependsOn": ["test"]
        }
      ]
    },
    "research": {
      "name": "Research Task",
      "description": "Information research workflow",
      "steps": [
        {
          "id": "scope",
          "name": "Scope Definition",
          "description": "Define research scope and objectives",
          "agent": "orchestrator",
          "inputs": ["research_question"],
          "outputs": ["research_scope"]
        },
        {
          "id": "gather",
          "name": "Data Gathering",
          "description": "Gather information from sources",
          "agent": "researcher",
          "inputs": ["research_scope"],
          "outputs": ["raw_data"],
          "dependsOn": ["scope"]
        },
        {
          "id": "analyze",
          "name": "Analysis",
          "description": "Analyze gathered data",
          "agent": "researcher",
          "inputs": ["raw_data"],
          "outputs": ["analysis_report"],
          "dependsOn": ["gather"]
        },
        {
          "id": "synthesize",
          "name": "Synthesis",
          "description": "Synthesize findings into report",
          "agent": "researcher",
          "inputs": ["analysis_report"],
          "outputs": ["final_report"],
          "dependsOn": ["analyze"]
        }
      ]
    }
  }
}
```

### 6.2 Task Step Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Task Execution Flow                          │
└─────────────────────────────────────────────────────────────────┘

  Input Task
      │
      ▼
┌─────────────┐
│   Analyze   │ ◄── orchestrator
│   (Step 1)  │
└──────┬──────┘
       │ task_analysis
       ▼
┌─────────────┐
│    Plan     │ ◄── planner
│   (Step 2)  │
└──────┬──────┘
       │ execution_plan
       ▼
┌─────────────┐
│   Execute   │ ◄── specialized agents
│   (Step 3)  │
└──────┬──────┘
       │ results
       ▼
┌─────────────┐
│   Review    │ ◄── orchestrator
│   (Step 4)  │
└──────┬──────┘
       │
       ▼
  Final Output
```

---

## 7. Style Guidelines

### 7.1 Communication Style

```json
{
  "communication": {
    "general": {
      "tone": "professional",
      "clarity": "high",
      "conciseness": "medium",
      "formality": "professional"
    },
    "orchestrator": {
      "tone": "directive",
      "style": "clear_instructions",
      "format": "structured"
    },
    "planner": {
      "tone": "analytical",
      "style": "detailed",
      "format": "bullet_points"
    },
    "coder": {
      "tone": "technical",
      "style": "precise",
      "format": "code_blocks"
    },
    "researcher": {
      "tone": "objective",
      "style": "evidence_based",
      "format": "cited_sources"
    }
  }
}
```

### 7.2 Coding Style Guidelines

```json
{
  "coding": {
    "general": {
      "indentation": "2_spaces",
      "lineLength": 100,
      "trailingComma": "es5",
      "semicolons": true
    },
    "javascript": {
      "style": "standard",
      "quotes": "single",
      "arrowParens": "avoid",
      "bracketSpacing": true
    },
    "python": {
      "style": "pep8",
      "quotes": "single",
      "docstrings": "google_style"
    },
    "documentation": {
      "required": true,
      "style": "jsdoc",
      "includeExamples": true
    },
    "testing": {
      "required": true,
      "coverage": 80,
      "framework": "jest"
    }
  }
}
```

### 7.3 Response Format Guidelines

```json
{
  "responseFormat": {
    "structure": {
      "greeting": "optional",
      "summary": "required",
      "details": "required",
      "nextSteps": "recommended",
      "closing": "optional"
    },
    "codeResponses": {
      "includeComments": true,
      "includeUsage": true,
      "includeTests": true,
      "format": "markdown_code_blocks"
    },
    "planResponses": {
      "includeTimeline": true,
      "includeDependencies": true,
      "includeRisks": true,
      "format": "numbered_list"
    },
    "researchResponses": {
      "includeSources": true,
      "includeConfidence": true,
      "format": "structured_report"
    }
  }
}
```

---

## 8. Usage Examples

### 8.1 Basic Usage

```bash
# Start the orchestrator server
npm run start:orchestrator

# In another terminal, use Kimi CLI with MCP
kimi mcp use orchestrstrator

# Send a task
kimi ask "Plan a new feature for user authentication"
```

### 8.2 Complex Task Example

```javascript
// Example: Using the hierarchical system programmatically
const HierarchicalMcpSystem = require('./src/index');

async function example() {
  const system = new HierarchicalMcpSystem();
  await system.initialize();

  // Complex task that requires multiple agents
  const task = {
    type: 'complex',
    content: `
      Create a user authentication system with:
      1. Login/Logout functionality
      2. Password reset
      3. JWT token management
      4. Role-based access control
    `,
    context: {
      techStack: 'Node.js, Express, MongoDB',
      deadline: '2 weeks'
    }
  };

  // The orchestrator will:
  // 1. Analyze the task
  // 2. Delegate to planner for architecture
  // 3. Delegate to coder for implementation
  // 4. Aggregate results
  const result = await system.processTask(task);
  console.log('Result:', result);
}

example().catch(console.error);
```

### 8.3 Using with Kimi CLI

```bash
# 1. Configure Kimi CLI to use MCP servers
kimi config set mcp.enabled true
kimi config set mcp.configPath ~/kimi-mcp-agents/cline_mcp_settings.json

# 2. Start MCP servers
npm run start:orchestrator &
npm run start:planner &
npm run start:coder &
npm run start:researcher &

# 3. Use Kimi CLI with hierarchical agents
kimi ask "Create a REST API for a todo app"

# The orchestrator will automatically:
# - Analyze the request
# - Create a plan
# - Generate code
# - Return complete solution
```

### 8.4 Task Routing Examples

```javascript
// Task routing based on content
const routingExamples = [
  {
    input: "Plan the development roadmap for Q1",
    routedTo: "planner",
    reason: "Contains planning keywords"
  },
  {
    input: "Write a function to calculate fibonacci",
    routedTo: "coder",
    reason: "Contains code generation keywords"
  },
  {
    input: "Research the latest trends in AI",
    routedTo: "researcher",
    reason: "Contains research keywords"
  },
  {
    input: "Create a full-stack application",
    routedTo: "orchestrator",
    reason: "Complex task requiring multiple agents"
  }
];
```

---

## 9. Testing & Debugging

### 9.1 Testing Strategy

```javascript
// tests/orchestrator.test.js
const OrchestratorAgent = require('../src/agents/orchestrator-agent');

describe('OrchestratorAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new OrchestratorAgent({
      name: 'test-orchestrator',
      version: '1.0.0',
      capabilities: {},
      tools: [],
      systemPrompt: 'Test prompt'
    });
  });

  test('should analyze task correctly', async () => {
    const content = 'Write a function to sort an array';
    const analysis = await agent.analyzeTask(content);
    
    expect(analysis.targetAgent).toBe('coder');
    expect(analysis.complexity).toBeDefined();
    expect(analysis.keywords).toBeInstanceOf(Array);
  });

  test('should route to planner for planning tasks', async () => {
    const content = 'Create a project roadmap';
    const analysis = await agent.analyzeTask(content);
    
    expect(analysis.targetAgent).toBe('planner');
  });

  test('should respect max depth', async () => {
    const task = {
      type: 'complex',
      content: 'Test task',
      depth: 3
    };

    await expect(agent.processTask(task))
      .rejects.toThrow('Maximum recursion depth');
  });
});
```

### 9.2 Debugging Tools

```javascript
// src/utils/debug-helper.js
class DebugHelper {
  constructor(logger) {
    this.logger = logger;
    this.debugMode = process.env.DEBUG === 'true';
  }

  logAgentCommunication(from, to, message) {
    if (this.debugMode) {
      this.logger.debug(`[${from}] -> [${to}]: ${JSON.stringify(message)}`);
    }
  }

  logTaskExecution(agent, task, result) {
    if (this.debugMode) {
      this.logger.debug(`Task executed by ${agent}:`, {
        task: task.name || task,
        success: !result.error,
        duration: result.duration
      });
    }
  }

  logContextUpdate(agent, key, value) {
    if (this.debugMode) {
      this.logger.debug(`Context updated by ${agent}: ${key}`);
    }
  }

  createTrace() {
    return {
      steps: [],
      addStep: (agent, action, details) => {
        this.steps.push({
          timestamp: new Date().toISOString(),
          agent,
          action,
          details
        });
      },
      export: () => JSON.stringify(this.steps, null, 2)
    };
  }
}

module.exports = DebugHelper;
```

### 9.3 Debug Configuration

```bash
# Enable debug mode
export DEBUG=true
export LOG_LEVEL=debug

# Run with debug output
DEBUG=true npm run start:orchestrator

# View logs
tail -f logs/orchestrator-server.log
```

---

## 10. Troubleshooting Guide

### 10.1 Common Issues

#### Issue 1: MCP Server Connection Failed
```
Error: Cannot connect to MCP server
```

**Solutions:**
```bash
# 1. Check if server is running
curl http://localhost:3000/health

# 2. Restart the server
npm run start:orchestrator

# 3. Check port availability
lsof -i :3000

# 4. Verify configuration
cat cline_mcp_settings.json | jq '.mcpServers.orchestrator'
```

#### Issue 2: API Key Not Found
```
Error: KIMI_API_KEY is required
```

**Solutions:**
```bash
# 1. Check environment file
cat .env | grep KIMI_API_KEY

# 2. Set environment variable
export KIMI_API_KEY=your_api_key

# 3. Verify in Node.js
node -e "console.log(process.env.KIMI_API_KEY)"
```

#### Issue 3: Task Routing Not Working
```
Error: Unknown agent type
```

**Solutions:**
```bash
# 1. Check agent registration
node -e "const sys = require('./src/index'); console.log(sys.agents)"

# 2. Verify agent config
cat config/agents/orchestrator.json | jq '.childAgents'

# 3. Check routing rules
cat cline_mcp_settings.json | jq '.hierarchicalConfig.taskRouting'
```

### 10.2 Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| E001 | MCP Connection Failed | Check server status and port |
| E002 | API Key Invalid | Verify KIMI_API_KEY |
| E003 | Agent Not Found | Check agent registration |
| E004 | Max Depth Exceeded | Increase AGENT_MAX_DEPTH |
| E005 | Timeout | Increase timeout value |
| E006 | Task Decomposition Failed | Simplify task description |

### 10.3 Debug Checklist

```markdown
## Pre-flight Checklist

- [ ] Environment variables configured (.env file created)
- [ ] KIMI_API_KEY is valid and active
- [ ] All required ports are available (3000-3003)
- [ ] Node.js version is 18+ (node --version)
- [ ] Dependencies installed (npm install completed)
- [ ] Configuration files are valid JSON
- [ ] MCP server scripts are executable

## Runtime Checklist

- [ ] Orchestrator server is running
- [ ] Child agent servers are running
- [ ] Kimi CLI can connect to MCP servers
- [ ] Logs are being written to ./logs/
- [ ] Task routing is working correctly
- [ ] Context is being shared between agents
```

### 10.4 Support Resources

```markdown
## Getting Help

1. **Check Logs**
   ```bash
   tail -f logs/*.log
   ```

2. **Enable Debug Mode**
   ```bash
   DEBUG=true npm run start:orchestrator
   ```

3. **Verify Configuration**
   ```bash
   node -e "console.log(require('./cline_mcp_settings.json'))"
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Community Support**
   - GitHub Issues: github.com/your-repo/issues
   - Documentation: docs.kimi-mcp-agents.com
   - Discord: discord.gg/kimi-mcp
```

---

## Appendix

### A. Quick Reference Commands

```bash
# Installation
npm install

# Start servers
npm run start:orchestrator
npm run start:planner
npm run start:coder
npm run start:researcher

# Development
npm run dev

# Testing
npm test

# Logs
tail -f logs/*.log

# Configuration validation
node -e "JSON.parse(require('fs').readFileSync('./cline_mcp_settings.json'))"
```

### B. File Locations

| File | Location | Purpose |
|------|----------|---------|
| Main Config | `~/kimi-mcp-agents/cline_mcp_settings.json` | MCP server configuration |
| Environment | `~/kimi-mcp-agents/.env` | Environment variables |
| Agent Configs | `~/kimi-mcp-agents/config/agents/*.json` | Agent configurations |
| Source Code | `~/kimi-mcp-agents/src/` | Implementation files |
| Logs | `~/kimi-mcp-agents/logs/` | Log files |

### C. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| KIMI_API_KEY | Yes | - | Kimi API key |
| KIMI_BASE_URL | No | https://api.moonshot.cn/v1 | Kimi API base URL |
| MCP_ORCHESTRATOR_PORT | No | 3000 | Orchestrator server port |
| MCP_PLANNER_PORT | No | 3001 | Planner server port |
| MCP_CODER_PORT | No | 3002 | Coder server port |
| MCP_RESEARCH_PORT | No | 3003 | Researcher server port |
| AGENT_MAX_DEPTH | No | 3 | Maximum recursion depth |
| AGENT_TIMEOUT_MS | No | 30000 | Task timeout in ms |
| LOG_LEVEL | No | info | Logging level |

---

## License

MIT License - See LICENSE file for details

## Version History

- v1.0.0 - Initial release with hierarchical MCP agents
  - Orchestrator, Planner, Coder, Researcher agents
  - Task decomposition and routing
  - Context sharing between agents
