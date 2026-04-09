#!/usr/bin/env node

/**
 * Orchestrator MCP Server
 * Main coordinator server for hierarchical MCP agents
 */

require('dotenv').config();
const BaseMcpServer = require('./base-mcp-server');
const OrchestratorAgent = require('../agents/orchestrator-agent');
const PlannerAgent = require('../agents/planner-agent');
const CoderAgent = require('../agents/coder-agent');
const ResearcherAgent = require('../agents/researcher-agent');

// Load configurations
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

    // Initialize orchestrator agent
    this.agent = new OrchestratorAgent(orchestratorConfig);
    
    // Setup child agents
    this.setupChildAgents();
    
    // Setup event handlers
    this.setupEventHandlers();
  }

  /**
   * Setup child agents
   */
  setupChildAgents() {
    // Create child agent instances
    const planner = new PlannerAgent(plannerConfig);
    const coder = new CoderAgent(coderConfig);
    const researcher = new ResearcherAgent(researcherConfig);

    // Register with orchestrator
    this.agent.registerChildAgent('planner', planner);
    this.agent.registerChildAgent('coder', coder);
    this.agent.registerChildAgent('researcher', researcher);

    this.logger.info('Child agents registered: planner, coder, researcher');
  }

  /**
   * Setup event handlers for agent events
   */
  setupEventHandlers() {
    this.agent.on('initialized', (data) => {
      this.logger.info(`Agent initialized: ${data.agent}`);
    });

    this.agent.on('completed', (data) => {
      this.logger.info(`Task completed by ${data.agent} in ${data.duration}ms`);
    });

    this.agent.on('error', (data) => {
      this.logger.error(`Error from ${data.agent}: ${data.error}`);
    });

    this.agent.on('childCompleted', (data) => {
      this.logger.info(`Child agent completed: ${data.agent}`);
    });

    this.agent.on('childError', (data) => {
      this.logger.error(`Child agent error: ${data.agent} - ${data.error}`);
    });
  }

  /**
   * Handle tool calls
   * @param {string} name - Tool name
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} Tool result
   */
  async handleToolCall(name, args) {
    try {
      let result;

      switch (name) {
        case 'decompose_task':
          result = await this.handleDecomposeTask(args);
          break;

        case 'delegate_task':
          result = await this.handleDelegateTask(args);
          break;

        case 'aggregate_results':
          result = this.handleAggregateResults(args);
          break;

        case 'get_agent_status':
          result = this.handleGetAgentStatus();
          break;

        case 'process_complex_task':
          result = await this.handleProcessComplexTask(args);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return this.formatSuccess(result);
    } catch (error) {
      return this.formatError(`Tool call '${name}' failed`, error);
    }
  }

  /**
   * Handle decompose_task tool
   */
  async handleDecomposeTask(args) {
    const { task, complexity = 'medium' } = args;
    
    this.logger.info(`Decomposing task with complexity: ${complexity}`);
    
    const analysis = await this.agent.analyzeTask(task);
    const subTasks = await this.agent.decomposeTask(task, { ...analysis, complexity });
    
    return {
      originalTask: task,
      complexity,
      analysis,
      subTasks,
      subTaskCount: subTasks.length
    };
  }

  /**
   * Handle delegate_task tool
   */
  async handleDelegateTask(args) {
    const { task, agentType, context = {} } = args;
    
    this.logger.info(`Delegating task to ${agentType}`);
    
    const result = await this.agent.delegateToAgent(agentType, task, 0, context);
    
    return {
      delegatedTo: agentType,
      task,
      result
    };
  }

  /**
   * Handle aggregate_results tool
   */
  handleAggregateResults(args) {
    const { results, strategy = 'merge' } = args;
    
    this.logger.info(`Aggregating ${results.length} results with strategy: ${strategy}`);
    
    const aggregated = this.agent.aggregateResults(results);
    
    return {
      strategy,
      ...aggregated
    };
  }

  /**
   * Handle get_agent_status tool
   */
  handleGetAgentStatus() {
    const childAgents = Array.from(this.agent.childAgents.entries()).map(([name, agent]) => ({
      name,
      version: agent.version,
      metrics: agent.getMetrics()
    }));

    return {
      orchestrator: {
        name: this.agent.name,
        version: this.agent.version,
        metrics: this.agent.getMetrics(),
        maxDepth: this.agent.maxDepth
      },
      childAgents,
      totalAgents: childAgents.length + 1
    };
  }

  /**
   * Handle process_complex_task tool
   */
  async handleProcessComplexTask(args) {
    const { task, context = {} } = args;
    
    this.logger.info('Processing complex task through orchestrator');
    
    const result = await this.agent.execute({
      type: 'complex',
      content: task,
      context
    });

    return result;
  }
}

// Start server if called directly
if (require.main === module) {
  const server = new OrchestratorMcpServer();
  server.start().catch((error) => {
    console.error('Failed to start orchestrator server:', error);
    process.exit(1);
  });
}

module.exports = OrchestratorMcpServer;
