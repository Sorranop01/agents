/**
 * Base Agent Class
 * Foundation for all hierarchical MCP agents
 */

const { EventEmitter } = require('events');
const winston = require('winston');

class BaseAgent extends EventEmitter {
  /**
   * Create a new BaseAgent
   * @param {Object} config - Agent configuration
   * @param {string} config.name - Agent name
   * @param {string} config.version - Agent version
   * @param {Object} config.capabilities - Agent capabilities
   * @param {Array} config.tools - Available tools
   * @param {string} config.systemPrompt - System prompt for LLM
   */
  constructor(config) {
    super();
    this.name = config.name;
    this.version = config.version;
    this.capabilities = config.capabilities || {};
    this.tools = config.tools || [];
    this.systemPrompt = config.systemPrompt || '';
    this.context = {};
    this.metrics = {
      tasksCompleted: 0,
      tasksFailed: 0,
      averageResponseTime: 0
    };
    
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

  /**
   * Initialize the agent
   */
  async initialize() {
    this.logger.info(`Initializing agent: ${this.name} v${this.version}`);
    this.emit('initialized', { agent: this.name, version: this.version });
  }

  /**
   * Execute a task
   * @param {Object|string} task - Task to execute
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Task result
   */
  async execute(task, context = {}) {
    const startTime = Date.now();
    const taskName = typeof task === 'string' ? task : task.name || 'unnamed';
    
    this.logger.info(`[${this.name}] Executing task: ${taskName}`);
    this.context = { ...this.context, ...context };
    
    try {
      const result = await this.processTask(task);
      const duration = Date.now() - startTime;
      
      this.metrics.tasksCompleted++;
      this.updateAverageResponseTime(duration);
      
      this.logger.info(`[${this.name}] Task completed in ${duration}ms`);
      this.emit('completed', { 
        agent: this.name, 
        task: taskName, 
        result,
        duration 
      });
      
      return {
        success: true,
        data: result,
        duration,
        agent: this.name
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.tasksFailed++;
      
      this.logger.error(`[${this.name}] Task failed: ${error.message}`);
      this.emit('error', { 
        agent: this.name, 
        task: taskName, 
        error: error.message,
        duration 
      });
      
      throw error;
    }
  }

  /**
   * Process a task (must be implemented by subclasses)
   * @param {Object} task - Task to process
   * @returns {Promise<any>} Processing result
   */
  async processTask(task) {
    throw new Error('processTask must be implemented by subclass');
  }

  /**
   * Get a tool by name
   * @param {string} name - Tool name
   * @returns {Object|undefined} Tool definition
   */
  getTool(name) {
    return this.tools.find(tool => tool.name === name);
  }

  /**
   * Check if agent has a capability
   * @param {string} capability - Capability name
   * @returns {boolean} True if capability is enabled
   */
  hasCapability(capability) {
    return this.capabilities[capability]?.enabled === true;
  }

  /**
   * Update context
   * @param {string} key - Context key
   * @param {any} value - Context value
   */
  updateContext(key, value) {
    this.context[key] = value;
    this.emit('contextUpdated', { key, value });
  }

  /**
   * Get current context
   * @returns {Object} Current context
   */
  getContext() {
    return this.context;
  }

  /**
   * Get agent metrics
   * @returns {Object} Agent metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Update average response time
   * @param {number} duration - New duration
   * @private
   */
  updateAverageResponseTime(duration) {
    const total = this.metrics.tasksCompleted + this.metrics.tasksFailed;
    const current = this.metrics.averageResponseTime;
    this.metrics.averageResponseTime = 
      ((current * (total - 1)) + duration) / total;
  }

  /**
   * Reset agent state
   */
  reset() {
    this.context = {};
    this.metrics = {
      tasksCompleted: 0,
      tasksFailed: 0,
      averageResponseTime: 0
    };
    this.emit('reset', { agent: this.name });
  }
}

module.exports = BaseAgent;
