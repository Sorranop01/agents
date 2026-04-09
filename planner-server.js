#!/usr/bin/env node

/**
 * Planner MCP Server
 * Task planning and strategy MCP server
 */

require('dotenv').config();
const BaseMcpServer = require('./base-mcp-server');
const PlannerAgent = require('../agents/planner-agent');
const plannerConfig = require('../../config/agents/planner.json');

class PlannerMcpServer extends BaseMcpServer {
  constructor() {
    super({
      name: 'planner',
      version: '1.0.0',
      port: process.env.MCP_PORT || 3001,
      tools: plannerConfig.tools
    });

    this.agent = new PlannerAgent(plannerConfig);
  }

  async handleToolCall(name, args) {
    try {
      let result;

      switch (name) {
        case 'create_plan':
          result = await this.handleCreatePlan(args);
          break;

        case 'estimate_timeline':
          result = await this.handleEstimateTimeline(args);
          break;

        case 'get_plan':
          result = this.handleGetPlan(args);
          break;

        case 'list_plans':
          result = this.handleListPlans();
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return this.formatSuccess(result);
    } catch (error) {
      return this.formatError(`Tool call '${name}' failed`, error);
    }
  }

  async handleCreatePlan(args) {
    const { objective, constraints = [], deadline } = args;
    
    this.logger.info(`Creating plan for: ${objective}`);
    
    const plan = await this.agent.createPlan(objective, {
      constraints,
      deadline
    });

    return {
      plan,
      created: new Date().toISOString()
    };
  }

  async handleEstimateTimeline(args) {
    const { tasks, complexity = 'medium' } = args;
    
    this.logger.info(`Estimating timeline for ${tasks.length} tasks`);
    
    const estimation = await this.agent.estimateTimeline(
      JSON.stringify(tasks),
      { complexity }
    );

    return estimation;
  }

  handleGetPlan(args) {
    const { objective } = args;
    const plan = this.agent.plans.get(objective);
    
    if (!plan) {
      throw new Error(`Plan not found for objective: ${objective}`);
    }

    return { plan };
  }

  handleListPlans() {
    const plans = Array.from(this.agent.plans.entries()).map(([objective, plan]) => ({
      objective,
      phases: plan.phases?.length || 0,
      milestones: plan.milestones?.length || 0
    }));

    return { plans, total: plans.length };
  }
}

// Start server if called directly
if (require.main === module) {
  const server = new PlannerMcpServer();
  server.start().catch((error) => {
    console.error('Failed to start planner server:', error);
    process.exit(1);
  });
}

module.exports = PlannerMcpServer;
