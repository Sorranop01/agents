#!/usr/bin/env node

/**
 * Kimi MCP Hierarchical Agents - Main Entry Point
 * 
 * This is the main entry point for the hierarchical MCP agents system.
 * It initializes and coordinates all agents and MCP servers.
 */

require('dotenv').config();
const winston = require('winston');
const path = require('path');
const fs = require('fs');

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

/**
 * Hierarchical MCP System
 * Main system class that manages all agents and servers
 */
class HierarchicalMcpSystem {
  constructor() {
    this.agents = new Map();
    this.servers = new Map();
    this.config = null;
    this.initialized = false;
  }

  /**
   * Initialize the system
   */
  async initialize() {
    logger.info('╔════════════════════════════════════════════════════════════╗');
    logger.info('║     Kimi MCP Hierarchical Agents System v1.0.0            ║');
    logger.info('╚════════════════════════════════════════════════════════════╝');
    
    try {
      // Validate environment
      this.validateEnvironment();
      
      // Load configuration
      await this.loadConfiguration();
      
      // Ensure log directory exists
      this.ensureLogDirectory();
      
      logger.info('System initialized successfully');
      logger.info('Available agents: orchestrator, planner, coder, researcher');
      logger.info('');
      logger.info('Usage:');
      logger.info('  npm run start:orchestrator  - Start orchestrator server');
      logger.info('  npm run start:planner       - Start planner server');
      logger.info('  npm run start:coder         - Start coder server');
      logger.info('  npm run start:researcher    - Start researcher server');
      logger.info('  npm run start:all           - Start all servers');
      logger.info('');
      
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error('System initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Validate environment variables
   */
  validateEnvironment() {
    logger.info('Validating environment...');
    
    const required = ['KIMI_API_KEY', 'KIMI_BASE_URL'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate API key format
    const apiKey = process.env.KIMI_API_KEY;
    if (apiKey === 'your_kimi_api_key_here' || apiKey.length < 10) {
      throw new Error('Invalid KIMI_API_KEY. Please set a valid API key in .env file');
    }
    
    logger.info('Environment validation passed');
  }

  /**
   * Load system configuration
   */
  async loadConfiguration() {
    logger.info('Loading configuration...');
    
    const configPath = path.join(__dirname, '..', 'cline_mcp_settings.json');
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }
    
    try {
      const configData = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configData);
      logger.info('Configuration loaded successfully');
    } catch (error) {
      throw new Error(`Failed to parse configuration: ${error.message}`);
    }
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    const logDir = path.join(__dirname, '..', 'logs');
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
      logger.info('Created log directory:', logDir);
    }
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      agents: Array.from(this.agents.keys()),
      servers: Array.from(this.servers.keys()),
      config: this.config ? {
        mcpServers: Object.keys(this.config.mcpServers || {}),
        hierarchicalLevels: this.config.hierarchicalConfig?.levels?.length || 0
      } : null
    };
  }

  /**
   * Display system information
   */
  displayInfo() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  Kimi MCP Hierarchical Agents System');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('Configuration:');
    console.log('  • MCP Servers: orchestrator, planner, coder, researcher');
    console.log('  • Max Depth:', process.env.AGENT_MAX_DEPTH || 3);
    console.log('  • Timeout:', process.env.AGENT_TIMEOUT_MS || 30000, 'ms');
    console.log('');
    
    console.log('Environment:');
    console.log('  • Kimi API:', process.env.KIMI_BASE_URL);
    console.log('  • Log Level:', process.env.LOG_LEVEL || 'info');
    console.log('');
    
    console.log('Quick Start:');
    console.log('  1. Start servers: npm run start:all');
    console.log('  2. Configure Kimi CLI with cline_mcp_settings.json');
    console.log('  3. Start using hierarchical agents!');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════\n');
  }
}

// Run if called directly
if (require.main === module) {
  const system = new HierarchicalMcpSystem();
  
  system.initialize()
    .then(() => {
      system.displayInfo();
    })
    .catch(error => {
      logger.error('\n❌ System initialization failed:');
      logger.error(error.message);
      logger.error('\nPlease check:');
      logger.error('  1. .env file exists and is properly configured');
      logger.error('  2. KIMI_API_KEY is set correctly');
      logger.error('  3. All dependencies are installed (npm install)');
      process.exit(1);
    });
}

module.exports = HierarchicalMcpSystem;
