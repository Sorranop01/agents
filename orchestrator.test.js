/**
 * Orchestrator Agent Tests
 */

const OrchestratorAgent = require('../src/agents/orchestrator-agent');
const PlannerAgent = require('../src/agents/planner-agent');
const CoderAgent = require('../src/agents/coder-agent');
const ResearcherAgent = require('../src/agents/researcher-agent');

describe('OrchestratorAgent', () => {
  let orchestrator;
  let planner;
  let coder;
  let researcher;

  beforeEach(() => {
    // Setup test configuration
    const orchestratorConfig = {
      name: 'test-orchestrator',
      version: '1.0.0',
      capabilities: {
        taskDecomposition: { enabled: true },
        agentCoordination: { enabled: true }
      },
      tools: [],
      systemPrompt: 'Test orchestrator prompt'
    };

    const plannerConfig = {
      name: 'test-planner',
      version: '1.0.0',
      capabilities: {
        taskBreakdown: { enabled: true }
      },
      tools: [],
      systemPrompt: 'Test planner prompt'
    };

    const coderConfig = {
      name: 'test-coder',
      version: '1.0.0',
      capabilities: {
        codeGeneration: { enabled: true, languages: ['javascript'] }
      },
      tools: [],
      systemPrompt: 'Test coder prompt'
    };

    const researcherConfig = {
      name: 'test-researcher',
      version: '1.0.0',
      capabilities: {
        webSearch: { enabled: true }
      },
      tools: [],
      systemPrompt: 'Test researcher prompt'
    };

    orchestrator = new OrchestratorAgent(orchestratorConfig);
    planner = new PlannerAgent(plannerConfig);
    coder = new CoderAgent(coderConfig);
    researcher = new ResearcherAgent(researcherConfig);

    // Register child agents
    orchestrator.registerChildAgent('planner', planner);
    orchestrator.registerChildAgent('coder', coder);
    orchestrator.registerChildAgent('researcher', researcher);
  });

  describe('Initialization', () => {
    test('should initialize correctly', async () => {
      await orchestrator.initialize();
      expect(orchestrator.childAgents.size).toBe(3);
    });

    test('should have correct name and version', () => {
      expect(orchestrator.name).toBe('test-orchestrator');
      expect(orchestrator.version).toBe('1.0.0');
    });
  });

  describe('Task Analysis', () => {
    test('should analyze coding tasks correctly', async () => {
      const content = 'Write a function to sort an array';
      const analysis = await orchestrator.analyzeTask(content);
      
      expect(analysis.targetAgent).toBe('coder');
      expect(analysis.complexity).toBeDefined();
      expect(analysis.keywords).toBeInstanceOf(Array);
    });

    test('should route planning tasks to planner', async () => {
      const content = 'Create a project roadmap for Q1';
      const analysis = await orchestrator.analyzeTask(content);
      
      expect(analysis.targetAgent).toBe('planner');
    });

    test('should route research tasks to researcher', async () => {
      const content = 'Research the latest trends in AI';
      const analysis = await orchestrator.analyzeTask(content);
      
      expect(analysis.targetAgent).toBe('researcher');
    });

    test('should extract keywords correctly', () => {
      const content = 'Create a user authentication system with JWT tokens';
      const keywords = orchestrator.extractKeywords(content);
      
      expect(keywords).toContain('authentication');
      expect(keywords).toContain('system');
      expect(keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Agent Registration', () => {
    test('should register child agents', () => {
      expect(orchestrator.childAgents.has('planner')).toBe(true);
      expect(orchestrator.childAgents.has('coder')).toBe(true);
      expect(orchestrator.childAgents.has('researcher')).toBe(true);
    });

    test('should unregister child agents', () => {
      orchestrator.unregisterChildAgent('planner');
      expect(orchestrator.childAgents.has('planner')).toBe(false);
    });
  });

  describe('Result Aggregation', () => {
    test('should aggregate results correctly', () => {
      const results = [
        { task: 'task1', result: 'result1', status: 'success' },
        { task: 'task2', result: 'result2', status: 'success' },
        { task: 'task3', error: 'error', status: 'failed' }
      ];

      const aggregated = orchestrator.aggregateResults(results);
      
      expect(aggregated.summary).toContain('2/3');
      expect(aggregated.successful).toHaveLength(2);
      expect(aggregated.failed).toHaveLength(1);
    });
  });

  describe('Depth Limiting', () => {
    test('should respect max depth', async () => {
      const task = {
        type: 'complex',
        content: 'Test task',
        depth: 3
      };

      await expect(orchestrator.processTask(task))
        .rejects.toThrow('Maximum recursion depth');
    });
  });

  describe('Metrics', () => {
    test('should track metrics', async () => {
      const initialMetrics = orchestrator.getMetrics();
      expect(initialMetrics.tasksCompleted).toBe(0);
      expect(initialMetrics.tasksFailed).toBe(0);
    });
  });
});
