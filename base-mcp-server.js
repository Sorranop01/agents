/**
 * Base MCP Server
 * Foundation for all MCP servers in the hierarchical system
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const winston = require('winston');

class BaseMcpServer {
  /**
   * Create a new BaseMcpServer
   * @param {Object} config - Server configuration
   */
  constructor(config) {
    this.name = config.name;
    this.version = config.version;
    this.port = config.port || 3000;
    this.tools = config.tools || [];
    this.agent = config.agent;
    
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
          filename: `./logs/${this.name}-server.log` 
        })
      ]
    });

    // Initialize MCP server
    this.server = new Server(
      { 
        name: this.name, 
        version: this.version 
      },
      { 
        capabilities: { 
          tools: {} 
        } 
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  /**
   * Setup request handlers
   */
  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.logger.info('ListTools request received');
      return { 
        tools: this.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      this.logger.info(`CallTool request: ${name}`);
      this.logger.debug(`Arguments: ${JSON.stringify(args)}`);
      
      return await this.handleToolCall(name, args);
    });
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error:', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught exception:', error);
      process.exit(1);
    });
  }

  /**
   * Handle tool calls (must be implemented by subclasses)
   * @param {string} name - Tool name
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} Tool result
   */
  async handleToolCall(name, args) {
    throw new Error('handleToolCall must be implemented by subclass');
  }

  /**
   * Format successful response
   * @param {any} data - Response data
   * @returns {Object} Formatted response
   */
  formatSuccess(data) {
    return {
      content: [{
        type: 'text',
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }]
    };
  }

  /**
   * Format error response
   * @param {string} message - Error message
   * @param {Error} error - Error object
   * @returns {Object} Formatted error response
   */
  formatError(message, error) {
    this.logger.error(`${message}: ${error.message}`);
    return {
      content: [{
        type: 'text',
        text: `Error: ${message}\nDetails: ${error.message}`
      }],
      isError: true
    };
  }

  /**
   * Start the MCP server
   */
  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      this.logger.info(`${this.name} MCP server v${this.version} started`);
      
      // Initialize agent if provided
      if (this.agent && typeof this.agent.initialize === 'function') {
        await this.agent.initialize();
      }
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      throw error;
    }
  }

  /**
   * Stop the MCP server
   */
  async stop() {
    this.logger.info('Stopping MCP server...');
    await this.server.close();
  }
}

module.exports = BaseMcpServer;
