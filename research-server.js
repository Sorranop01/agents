#!/usr/bin/env node

/**
 * Researcher MCP Server
 * Information gathering and analysis MCP server
 */

require('dotenv').config();
const BaseMcpServer = require('./base-mcp-server');
const ResearcherAgent = require('../agents/researcher-agent');
const researcherConfig = require('../../config/agents/researcher.json');

class ResearcherMcpServer extends BaseMcpServer {
  constructor() {
    super({
      name: 'researcher',
      version: '1.0.0',
      port: process.env.MCP_PORT || 3003,
      tools: researcherConfig.tools
    });

    this.agent = new ResearcherAgent(researcherConfig);
    this.searchHistory = [];
  }

  async handleToolCall(name, args) {
    try {
      let result;

      switch (name) {
        case 'search_web':
          result = await this.handleSearchWeb(args);
          break;

        case 'analyze_data':
          result = await this.handleAnalyzeData(args);
          break;

        case 'summarize':
          result = await this.handleSummarize(args);
          break;

        case 'get_search_history':
          result = this.handleGetSearchHistory();
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return this.formatSuccess(result);
    } catch (error) {
      return this.formatError(`Tool call '${name}' failed`, error);
    }
  }

  async handleSearchWeb(args) {
    const { query, maxResults = 10 } = args;
    
    this.logger.info(`Searching web for: ${query}`);
    
    const result = await this.agent.search(query, { maxResults });

    // Store in history
    this.searchHistory.push({
      query,
      resultCount: result.resultCount,
      timestamp: new Date().toISOString()
    });

    return result;
  }

  async handleAnalyzeData(args) {
    const { data, analysisType = 'summary' } = args;
    
    this.logger.info(`Analyzing data with type: ${analysisType}`);
    
    const result = await this.agent.analyzeData(data, { analysisType });

    return result;
  }

  async handleSummarize(args) {
    const { text, maxLength = 500, style = 'concise' } = args;
    
    this.logger.info(`Summarizing text (max ${maxLength} chars)`);
    
    const result = await this.agent.summarize(text, { maxLength, style });

    return result;
  }

  handleGetSearchHistory() {
    return {
      history: this.searchHistory,
      total: this.searchHistory.length
    };
  }
}

// Start server if called directly
if (require.main === module) {
  const server = new ResearcherMcpServer();
  server.start().catch((error) => {
    console.error('Failed to start researcher server:', error);
    process.exit(1);
  });
}

module.exports = ResearcherMcpServer;
