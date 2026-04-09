/**
 * Orchestrator Agent
 * Main coordinator for hierarchical MCP agents
 */

const BaseAgent = require('./base-agent');
const axios = require('axios');

class OrchestratorAgent extends BaseAgent {
  /**
   * Create a new OrchestratorAgent
   * @param {Object} config - Agent configuration
   */
  constructor(config) {
    super(config);
    this.childAgents = new Map();
    this.taskQueue = [];
    this.maxDepth = parseInt(process.env.AGENT_MAX_DEPTH) || 3;
    this.routingRules = config.routingRules || [];
  }

  /**
   * Initialize the orchestrator
   */
  async initialize() {
    await super.initialize();
    this.logger.info(`Orchestrator initialized with max depth: ${this.maxDepth}`);
    this.logger.info(`Registered child agents: ${Array.from(this.childAgents.keys()).join(', ')}`);
  }

  /**
   * Register a child agent
   * @param {string} name - Agent name
   * @param {BaseAgent} agent - Agent instance
   */
  registerChildAgent(name, agent) {
    this.childAgents.set(name, agent);
    this.logger.info(`Registered child agent: ${name}`);
    
    // Forward child agent events
    agent.on('completed', (data) => this.emit('childCompleted', data));
    agent.on('error', (data) => this.emit('childError', data));
  }

  /**
   * Unregister a child agent
   * @param {string} name - Agent name
   */
  unregisterChildAgent(name) {
    this.childAgents.delete(name);
    this.logger.info(`Unregistered child agent: ${name}`);
  }

  /**
   * Process a task
   * @param {Object} task - Task to process
   * @returns {Promise<Object>} Processing result
   */
  async processTask(task) {
    const { type, content, depth = 0, context = {} } = task;
    
    this.logger.info(`Processing task at depth ${depth}: ${content.substring(0, 100)}...`);
    
    // Check recursion depth
    if (depth >= this.maxDepth) {
      throw new Error(`Maximum recursion depth (${this.maxDepth}) reached`);
    }

    // Analyze task
    const analysis = await this.analyzeTask(content);
    this.logger.info(`Task analysis: ${JSON.stringify(analysis)}`);

    // Decompose if complex
    if (analysis.complexity === 'high') {
      this.logger.info('Task is complex, decomposing...');
      const subTasks = await this.decomposeTask(content, analysis);
      const results = await this.executeSubTasks(subTasks, depth + 1, context);
      return this.aggregateResults(results);
    }

    // Route to appropriate agent
    const targetAgent = this.determineTargetAgent(analysis);
    if (targetAgent && targetAgent !== 'orchestrator') {
      this.logger.info(`Routing to agent: ${targetAgent}`);
      return await this.delegateToAgent(targetAgent, content, depth + 1, context);
    }

    // Execute directly
    this.logger.info('Executing task directly');
    return await this.executeDirectly(content, context);
  }

  /**
   * Analyze a task
   * @param {string} content - Task content
   * @returns {Promise<Object>} Task analysis
   */
  async analyzeTask(content) {
    // Keyword-based routing patterns
    const patterns = {
      planner: /plan|strategy|roadmap|timeline|schedule|milestone|goal/i,
      coder: /code|implement|develop|program|function|class|api|endpoint|database|schema/i,
      researcher: /research|find|search|analyze|investigate|study|compare|evaluate/i
    };

    let matchedAgent = 'orchestrator';
    const matchedPatterns = [];
    
    for (const [agent, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        matchedAgent = agent;
        matchedPatterns.push(agent);
      }
    }

    // Determine complexity
    const wordCount = content.split(/\s+/).length;
    const complexity = wordCount > 100 ? 'high' : 
                      wordCount > 50 ? 'medium' : 'low';

    return {
      targetAgent: matchedAgent,
      complexity,
      keywords: this.extractKeywords(content),
      matchedPatterns,
      wordCount
    };
  }

  /**
   * Extract keywords from content
   * @param {string} content - Content to analyze
   * @returns {Array<string>} Extracted keywords
   */
  extractKeywords(content) {
    const commonWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
      'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
      'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
      'below', 'between', 'under', 'and', 'but', 'or', 'yet', 'so', 'if',
      'because', 'although', 'though', 'while', 'where', 'when', 'that',
      'which', 'who', 'whom', 'whose', 'what', 'this', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
      'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
    ]);

    return content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 15);
  }

  /**
   * Decompose a task into sub-tasks
   * @param {string} content - Task content
   * @param {Object} analysis - Task analysis
   * @returns {Promise<Array>} Sub-tasks
   */
  async decomposeTask(content, analysis) {
    const prompt = `Break down this task into sub-tasks:

Task: ${content}
Complexity: ${analysis.complexity}
Keywords: ${analysis.keywords.join(', ')}

Provide sub-tasks as a JSON array with this format:
[
  {
    "name": "sub-task name",
    "description": "detailed description",
    "agent": "target agent (planner, coder, or researcher)",
    "estimatedDuration": "estimated time in minutes",
    "dependencies": []
  }
]

Rules:
1. Each sub-task should be specific and actionable
2. Assign to the most appropriate agent
3. Include estimated duration
4. List dependencies if any`;

    try {
      const response = await this.callLLM(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      this.logger.error('Task decomposition failed:', error.message);
      // Fallback: create single sub-task
      return [{ 
        name: 'main-task', 
        description: content, 
        agent: analysis.targetAgent,
        estimatedDuration: '30',
        dependencies: []
      }];
    }
  }

  /**
   * Execute sub-tasks
   * @param {Array} subTasks - Sub-tasks to execute
   * @param {number} depth - Current depth
   * @param {Object} context - Execution context
   * @returns {Promise<Array>} Execution results
   */
  async executeSubTasks(subTasks, depth, context) {
    this.logger.info(`Executing ${subTasks.length} sub-tasks at depth ${depth}`);
    
    const results = [];
    
    for (const subTask of subTasks) {
      try {
        // Check dependencies
        if (subTask.dependencies && subTask.dependencies.length > 0) {
          const depsCompleted = subTask.dependencies.every(dep => 
            results.some(r => r.task === dep && r.status === 'success')
          );
          if (!depsCompleted) {
            results.push({ 
              task: subTask.name, 
              error: 'Dependencies not met',
              status: 'skipped' 
            });
            continue;
          }
        }

        const result = await this.delegateToAgent(
          subTask.agent, 
          subTask.description, 
          depth,
          context
        );
        
        results.push({ 
          task: subTask.name, 
          result, 
          status: 'success',
          duration: result.duration 
        });
      } catch (error) {
        results.push({ 
          task: subTask.name, 
          error: error.message, 
          status: 'failed' 
        });
      }
    }
    
    return results;
  }

  /**
   * Delegate a task to an agent
   * @param {string} agentName - Agent name
   * @param {string} content - Task content
   * @param {number} depth - Current depth
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Task result
   */
  async delegateToAgent(agentName, content, depth, context) {
    const agent = this.childAgents.get(agentName);
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    this.logger.info(`Delegating to ${agentName} at depth ${depth}`);
    
    return await agent.execute(
      { content, depth, name: `task-${Date.now()}` }, 
      { ...this.context, ...context }
    );
  }

  /**
   * Determine target agent from analysis
   * @param {Object} analysis - Task analysis
   * @returns {string} Target agent name
   */
  determineTargetAgent(analysis) {
    // Check routing rules from config
    for (const rule of this.routingRules) {
      const pattern = new RegExp(rule.pattern, 'i');
      if (pattern.test(analysis.keywords.join(' '))) {
        return rule.targetAgent;
      }
    }
    
    return analysis.targetAgent;
  }

  /**
   * Execute a task directly
   * @param {string} content - Task content
   * @param {Object} context - Execution context
   * @returns {Promise<string>} Execution result
   */
  async executeDirectly(content, context) {
    const prompt = `${this.systemPrompt}

Context: ${JSON.stringify(context)}

Task: ${content}

Please provide a comprehensive response.`;

    return await this.callLLM(prompt);
  }

  /**
   * Aggregate results from multiple tasks
   * @param {Array} results - Task results
   * @returns {Object} Aggregated result
   */
  aggregateResults(results) {
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');
    const skipped = results.filter(r => r.status === 'skipped');

    const totalDuration = successful.reduce((sum, r) => sum + (r.duration || 0), 0);

    return {
      summary: `Completed ${successful.length}/${results.length} sub-tasks`,
      details: {
        successful: successful.length,
        failed: failed.length,
        skipped: skipped.length,
        totalDuration
      },
      successful,
      failed,
      skipped,
      aggregated: successful.map(r => r.result?.data || r.result).join('\n\n---\n\n')
    };
  }

  /**
   * Call LLM API
   * @param {string} prompt - Prompt to send
   * @returns {Promise<string>} LLM response
   */
  async callLLM(prompt) {
    try {
      const response = await axios.post(
        `${process.env.KIMI_BASE_URL}/chat/completions`,
        {
          model: 'kimi-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
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
