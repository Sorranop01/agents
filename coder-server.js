#!/usr/bin/env node

/**
 * Coder MCP Server
 * Code generation and implementation MCP server
 */

require('dotenv').config();
const BaseMcpServer = require('./base-mcp-server');
const CoderAgent = require('../agents/coder-agent');
const coderConfig = require('../../config/agents/coder.json');

class CoderMcpServer extends BaseMcpServer {
  constructor() {
    super({
      name: 'coder',
      version: '1.0.0',
      port: process.env.MCP_PORT || 3002,
      tools: coderConfig.tools
    });

    this.agent = new CoderAgent(coderConfig);
    this.codeHistory = [];
  }

  async handleToolCall(name, args) {
    try {
      let result;

      switch (name) {
        case 'generate_code':
          result = await this.handleGenerateCode(args);
          break;

        case 'review_code':
          result = await this.handleReviewCode(args);
          break;

        case 'refactor_code':
          result = await this.handleRefactorCode(args);
          break;

        case 'generate_tests':
          result = await this.handleGenerateTests(args);
          break;

        case 'get_code_history':
          result = this.handleGetCodeHistory();
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return this.formatSuccess(result);
    } catch (error) {
      return this.formatError(`Tool call '${name}' failed`, error);
    }
  }

  async handleGenerateCode(args) {
    const { requirements, language = 'javascript', style = 'standard' } = args;
    
    this.logger.info(`Generating ${language} code`);
    
    const result = await this.agent.generateCode(requirements, { 
      language, 
      style 
    });

    // Store in history
    this.codeHistory.push({
      type: 'generated',
      language,
      timestamp: new Date().toISOString(),
      preview: result.code?.substring(0, 100) + '...'
    });

    return result;
  }

  async handleReviewCode(args) {
    const { code, language } = args;
    
    this.logger.info(`Reviewing ${language || 'code'}`);
    
    const result = await this.agent.reviewCode(code, { language });

    this.codeHistory.push({
      type: 'reviewed',
      language,
      timestamp: new Date().toISOString()
    });

    return result;
  }

  async handleRefactorCode(args) {
    const { code, language, goals = [] } = args;
    
    this.logger.info(`Refactoring ${language || 'code'}`);
    
    const result = await this.agent.refactorCode(code, { 
      language, 
      goals 
    });

    this.codeHistory.push({
      type: 'refactored',
      language,
      timestamp: new Date().toISOString()
    });

    return result;
  }

  async handleGenerateTests(args) {
    const { code, language, framework } = args;
    
    this.logger.info(`Generating tests for ${language || 'code'}`);
    
    const result = await this.agent.generateTests(code, { 
      language, 
      framework 
    });

    this.codeHistory.push({
      type: 'tests_generated',
      language,
      timestamp: new Date().toISOString()
    });

    return result;
  }

  handleGetCodeHistory() {
    return {
      history: this.codeHistory,
      total: this.codeHistory.length
    };
  }
}

// Start server if called directly
if (require.main === module) {
  const server = new CoderMcpServer();
  server.start().catch((error) => {
    console.error('Failed to start coder server:', error);
    process.exit(1);
  });
}

module.exports = CoderMcpServer;
