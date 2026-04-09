# Comprehensive Agent Workflow System
## ระบบ Workflow ครอบคลุมสำหรับ MCP Hierarchical Agents

---

## 1. ภาพรวมระบบ Workflow

### 1.1 Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPREHENSIVE AGENT WORKFLOW SYSTEM                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 1: USER INTERFACE                                             │   │
│  │  • Natural Language Commands                                         │   │
│  │  • Kimi CLI Integration                                              │   │
│  │  • Progress Dashboard                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 2: ORCHESTRATION LAYER                                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Request    │  │   Workflow   │  │   Agent      │              │   │
│  │  │   Parser     │  │   Engine     │  │   Router     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 3: AGENT EXECUTION LAYER                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Planning   │  │   Execution  │  │   Review     │              │   │
│  │  │   Phase      │  │   Phase      │  │   Phase      │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 4: MEMORY & LEARNING LAYER                                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Working    │  │   Knowledge  │  │   Self-Learn │              │   │
│  │  │   Memory     │  │   Base       │  │   Loop       │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Workflow Types

### 2.1 Type 1: Sequential Workflow (งานแบบลำดับขั้น)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SEQUENTIAL WORKFLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  สำหรับงานที่ต้องทำตามลำดับ ไม่สามารถทำขนานกันได้                           │
│                                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  STEP 1 │───▶│  STEP 2 │───▶│  STEP 3 │───▶│  STEP 4 │───▶│  STEP 5 │  │
│  │ Analyze │    │  Plan   │    │  Design │    │Implement│    │  Test   │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│   ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐     │
│   │Output │     │Output │     │Output │     │Output │     │Output │     │
│   │  A    │     │  B    │     │  C    │     │  D    │     │  E    │     │
│   └───────┘     └───────┘     └───────┘     └───────┘     └───────┘     │
│                                                                              │
│  Example: การพัฒนา Feature ใหม่                                             │
│  1. Analyze Requirements → 2. Plan Architecture → 3. Design API           │
│  4. Implement Code → 5. Test & Deploy                                     │
│                                                                              │
│  Checkpoint: ทุก Step ต้องผ่าน Quality Gate ก่อนถึงจะไป Step ต่อไป         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Type 2: Parallel Workflow (งานแบบขนาน)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PARALLEL WORKFLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  สำหรับงานที่สามารถแบ่งเป็น sub-tasks ที่ทำขนานกันได้                       │
│                                                                              │
│                              ┌─────────┐                                   │
│                              │  START  │                                   │
│                              └────┬────┘                                   │
│                                   │                                        │
│                    ┌──────────────┼──────────────┐                         │
│                    │              │              │                         │
│                    ▼              ▼              ▼                         │
│              ┌─────────┐   ┌─────────┐   ┌─────────┐                      │
│              │ Task A  │   │ Task B  │   │ Task C  │                      │
│              │(Agent 1)│   │(Agent 2)│   │(Agent 3)│                      │
│              │         │   │         │   │         │                      │
│              │Frontend │   │ Backend │   │  DevOps │                      │
│              │   UI    │   │   API   │   │Pipeline │                      │
│              └────┬────┘   └────┬────┘   └────┬────┘                      │
│                   │              │              │                          │
│                   └──────────────┼──────────────┘                          │
│                                  │                                         │
│                                  ▼                                         │
│                           ┌─────────┐                                      │
│                           │  MERGE  │                                      │
│                           │ RESULTS │                                      │
│                           └────┬────┘                                      │
│                                │                                           │
│                                ▼                                           │
│                           ┌─────────┐                                      │
│                           │  END    │                                      │
│                           └─────────┘                                      │
│                                                                              │
│  Example: การพัฒนา Web Application                                          │
│  - Frontend Team ทำ UI ไปพร้อมกับ                                          │
│  - Backend Team ทำ API ไปพร้อมกับ                                          │
│  - DevOps Team ทำ Pipeline ไปพร้อมกัน                                      │
│                                                                              │
│  Synchronization: รอทุก Task เสร็จแล้วค่อย Merge                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Type 3: Iterative Workflow (งานแบบวนซ้ำ)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ITERATIVE WORKFLOW (AGILE)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  สำหรับงานที่ต้องพัฒนาเป็นวง cycles ปรับปรุงไปเรื่อยๆ                       │
│                                                                              │
│         ┌─────────────────────────────────────────┐                        │
│         │                                         │                        │
│         ▼                                         │                        │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐     │                        │
│    │  PLAN   │───▶│  BUILD  │───▶│  TEST   │─────┘                        │
│    │         │    │         │    │         │                              │
│    │• Define │    │• Code   │    │• Unit   │                              │
│    │  scope  │    │• Review │    │  Test   │                              │
│    │• Set    │    │• Commit │    │• Integr.│                              │
│    │  goals  │    │         │    │  Test   │                              │
│    └─────────┘    └─────────┘    └────┬────┘                              │
│         ▲                             │                                    │
│         │                             ▼                                    │
│         │                        ┌─────────┐                               │
│         │                        │ REVIEW  │                               │
│         │                        │         │                               │
│         │                        │• Demo   │                               │
│         │                        │• Feedback│                              │
│         │                        │• Decide │                               │
│         │                        │  next   │                               │
│         │                        └────┬────┘                               │
│         │                             │                                    │
│         │              ┌──────────────┴──────────────┐                     │
│         │              │                              │                     │
│         │         ┌────┴────┐                  ┌────┴────┐                │
│         │         │CONTINUE │                  │  DONE   │                │
│         │         │(Iterate)│                  │(Release)│                │
│         │         └────┬────┘                  └─────────┘                │
│         │              │                                                    │
│         └──────────────┘                                                    │
│                                                                              │
│  Example: Agile Development Sprint                                          │
│  แต่ละ Sprint มี Planning → Build → Test → Review → (Iterate หรือ Release) │
│                                                                              │
│  Feedback Loop: ผลจาก Review กลับไปปรับปรุงในรอบถัดไป                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Type 4: Event-Driven Workflow (งานตามเหตุการณ์)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVENT-DRIVEN WORKFLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  สำหรับงานที่ตอบสนองตามเหตุการณ์ที่เกิดขึ้น                                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        EVENT SOURCES                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Code    │  │  Task    │  │  System  │  │  Manual  │            │   │
│  │  │  Commit  │  │  Update  │  │  Alert   │  │  Trigger │            │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │   │
│  │       │             │             │             │                   │   │
│  │       └─────────────┴─────────────┴─────────────┘                   │   │
│  │                         │                                          │   │
│  │                         ▼                                          │   │
│  │              ┌─────────────────────┐                               │   │
│  │              │    EVENT BUS        │                               │   │
│  │              │   (Message Queue)   │                               │   │
│  │              └──────────┬──────────┘                               │   │
│  └─────────────────────────┼─────────────────────────────────────────┘   │
│                            │                                              │
│           ┌────────────────┼────────────────┐                             │
│           │                │                │                             │
│           ▼                ▼                ▼                             │
│     ┌──────────┐    ┌──────────┐    ┌──────────┐                        │
│     │ Handler  │    │ Handler  │    │ Handler  │                        │
│     │    A     │    │    B     │    │    C     │                        │
│     │          │    │          │    │          │                        │
│     │Auto-Test │    │Auto-Deploy│   │Notify    │                        │
│     │          │    │          │    │          │                        │
│     └────┬─────┘    └────┬─────┘    └────┬─────┘                        │
│          │               │               │                                │
│          ▼               ▼               ▼                                │
│     ┌──────────┐    ┌──────────┐    ┌──────────┐                        │
│     │  Action  │    │  Action  │    │  Action  │                        │
│     │  Output  │    │  Output  │    │  Output  │                        │
│     └──────────┘    └──────────┘    └──────────┘                        │
│                                                                              │
│  Example: CI/CD Pipeline                                                    │
│  - Code Commit → Trigger Tests → Deploy → Notify                           │
│  - System Alert → Diagnose → Fix → Verify                                  │
│                                                                              │
│  Scalability: Handlers สามารถเพิ่มได้ตามเหตุการณ์                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Workflow State Machine

### 3.1 Task State Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TASK STATE LIFECYCLE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐     create      ┌─────────┐     assign       ┌─────────┐     │
│  │  IDLE   │────────────────▶│ PENDING │─────────────────▶│ASSIGNED │     │
│  │         │                 │         │                  │         │     │
│  └─────────┘                 └─────────┘                  └────┬────┘     │
│                                                                │          │
│                              ┌─────────────────────────────────┘          │
│                              │ start                                      │
│                              ▼                                            │
│  ┌─────────┐    complete    ┌─────────┐    submit      ┌─────────┐       │
│  │ CLOSED  │◀───────────────│COMPLETED│◀──────────────│IN_PROG  │       │
│  │         │                │         │               │         │       │
│  └─────────┘                └─────────┘               └────┬────┘       │
│       ▲                                                    │             │
│       │                    ┌───────────────────────────────┘             │
│       │                    │ block                                      │
│       │                    ▼                                            │
│       │               ┌─────────┐     resolve      ┌─────────┐          │
│       │               │ BLOCKED │─────────────────▶│IN_PROG  │          │
│       │               │         │                  │ (retry) │          │
│       │               └─────────┘                  └─────────┘          │
│       │                                                                   │
│       │               ┌─────────┐     reject       ┌─────────┐          │
│       │               │REJECTED │─────────────────▶│IN_PROG  │          │
│       └───────────────│         │                  │ (revise)│          │
│           close       └─────────┘                  └─────────┘          │
│                                                                              │
│  STATES:                                                                     │
│  • IDLE - งานถูกสร้างแต่ยังไม่เริ่ม                                         │
│  • PENDING - รอการมอบหมาย                                                    │
│  • ASSIGNED - มอบหมายให้ Agent แล้ว                                          │
│  • IN_PROGRESS - กำลังทำงาน                                                  │
│  • BLOCKED - ถูก block รอ dependency หรือแก้ไขปัญหา                          │
│  • COMPLETED - ทำงานเสร็จแล้ว                                                │
│  • REJECTED - ถูกปฏิเสธต้องแก้ไข                                             │
│  • CLOSED - ปิดงานสำเร็จ                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Workflow Components

### 4.1 Workflow Engine Components

```typescript
// ==================== WORKFLOW ENGINE INTERFACES ====================

// Workflow Definition
interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  type: 'sequential' | 'parallel' | 'iterative' | 'event-driven';
  
  // Steps/Phases
  steps: WorkflowStep[];
  
  // Transitions
  transitions: WorkflowTransition[];
  
  // Global configuration
  config: {
    timeout_seconds: number;
    retry_policy: RetryPolicy;
    checkpoint_interval: number;
    parallel_limit: number;
  };
}

// Workflow Step
interface WorkflowStep {
  id: string;
  name: string;
  type: 'task' | 'decision' | 'parallel' | 'sub-workflow' | 'wait';
  
  // Agent assignment
  agent?: {
    type: string;
    selector: 'specific' | 'round-robin' | 'capability-based' | 'auction';
    target?: string;
  };
  
  // Input/Output
  input_mapping: Record<string, string>;
  output_mapping: Record<string, string>;
  
  // Execution
  action: {
    type: 'mcp-tool' | 'agent-task' | 'human-review' | 'api-call';
    config: Record<string, any>;
  };
  
  // Conditions
  conditions: {
    preconditions: Condition[];
    postconditions: Condition[];
  };
  
  // Error handling
  on_error: 'retry' | 'skip' | 'fail' | 'compensate';
  compensation_step?: string;
}

// Workflow Transition
interface WorkflowTransition {
  from: string;
  to: string;
  condition?: Condition;
  priority: number;
}

// Workflow Instance
interface WorkflowInstance {
  id: string;
  definition_id: string;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  
  // Context
  context: {
    input: Record<string, any>;
    variables: Record<string, any>;
    output: Record<string, any>;
  };
  
  // State
  current_step: string;
  step_states: Map<string, StepState>;
  
  // History
  history: StepExecution[];
  
  // Timestamps
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;
}

// Step State
interface StepState {
  step_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: ErrorInfo;
  attempts: number;
  started_at?: Date;
  completed_at?: Date;
}

// Retry Policy
interface RetryPolicy {
  max_attempts: number;
  backoff_strategy: 'fixed' | 'linear' | 'exponential';
  backoff_delay_ms: number;
  max_backoff_ms: number;
  retryable_errors: string[];
}

// Condition
interface Condition {
  type: 'expression' | 'script' | 'mcp-tool';
  config: Record<string, any>;
}
```

### 4.2 Workflow Engine Implementation

```typescript
// ==================== WORKFLOW ENGINE IMPLEMENTATION ====================

class WorkflowEngine {
  private definitions: Map<string, WorkflowDefinition>;
  private instances: Map<string, WorkflowInstance>;
  private agentPool: AgentPool;
  private eventBus: EventBus;
  
  constructor(config: WorkflowEngineConfig) {
    this.definitions = new Map();
    this.instances = new Map();
    this.agentPool = new AgentPool(config.agentPool);
    this.eventBus = new EventBus(config.eventBus);
  }
  
  // Register workflow definition
  registerDefinition(definition: WorkflowDefinition): void {
    this.definitions.set(definition.id, definition);
    console.log(`[WorkflowEngine] Registered workflow: ${definition.name} (${definition.id})`);
  }
  
  // Start workflow instance
  async startWorkflow(
    definitionId: string, 
    input: Record<string, any>,
    options?: WorkflowOptions
  ): Promise<WorkflowInstance> {
    const definition = this.definitions.get(definitionId);
    if (!definition) {
      throw new Error(`Workflow definition not found: ${definitionId}`);
    }
    
    // Create instance
    const instance: WorkflowInstance = {
      id: generateUUID(),
      definition_id: definitionId,
      status: 'running',
      context: {
        input,
        variables: {},
        output: {}
      },
      current_step: definition.steps[0]?.id,
      step_states: new Map(),
      history: [],
      created_at: new Date(),
      started_at: new Date()
    };
    
    this.instances.set(instance.id, instance);
    
    // Emit event
    this.eventBus.emit('workflow.started', {
      workflow_id: instance.id,
      definition_id: definitionId
    });
    
    // Start execution
    this.executeWorkflow(instance.id);
    
    return instance;
  }
  
  // Execute workflow
  private async executeWorkflow(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const definition = this.definitions.get(instance.definition_id);
    if (!definition) return;
    
    while (instance.status === 'running' && instance.current_step) {
      const step = definition.steps.find(s => s.id === instance.current_step);
      if (!step) break;
      
      try {
        // Execute step
        const result = await this.executeStep(instance, step);
        
        // Update state
        instance.step_states.set(step.id, {
          step_id: step.id,
          status: result.success ? 'completed' : 'failed',
          input: result.input,
          output: result.output,
          error: result.error,
          attempts: result.attempts,
          started_at: result.started_at,
          completed_at: new Date()
        });
        
        // Add to history
        instance.history.push({
          step_id: step.id,
          status: result.success ? 'completed' : 'failed',
          timestamp: new Date(),
          duration_ms: result.duration_ms
        });
        
        // Determine next step
        if (result.success) {
          instance.current_step = this.getNextStep(definition, step.id, result.output);
        } else {
          // Handle error
          if (step.on_error === 'retry' && result.attempts < definition.config.retry_policy.max_attempts) {
            // Retry same step
            continue;
          } else if (step.on_error === 'compensate' && step.compensation_step) {
            instance.current_step = step.compensation_step;
          } else {
            instance.status = 'failed';
            break;
          }
        }
        
        // Save checkpoint
        if (definition.config.checkpoint_interval > 0 && 
            instance.history.length % definition.config.checkpoint_interval === 0) {
          await this.saveCheckpoint(instance);
        }
        
      } catch (error) {
        console.error(`[WorkflowEngine] Error executing step ${step.id}:`, error);
        instance.status = 'failed';
        break;
      }
    }
    
    // Complete workflow
    if (instance.status === 'running') {
      instance.status = 'completed';
      instance.completed_at = new Date();
    }
    
    // Emit event
    this.eventBus.emit('workflow.completed', {
      workflow_id: instance.id,
      status: instance.status,
      duration_ms: instance.completed_at.getTime() - instance.started_at!.getTime()
    });
  }
  
  // Execute single step
  private async executeStep(
    instance: WorkflowInstance, 
    step: WorkflowStep
  ): Promise<StepResult> {
    const startTime = Date.now();
    let attempts = 0;
    
    while (attempts < this.definitions.get(instance.definition_id)!.config.retry_policy.max_attempts) {
      attempts++;
      
      try {
        // Check preconditions
        const preconditionsMet = await this.checkConditions(step.conditions.preconditions, instance);
        if (!preconditionsMet) {
          throw new Error('Preconditions not met');
        }
        
        // Prepare input
        const input = this.mapInput(step.input_mapping, instance);
        
        // Execute action
        let output: Record<string, any>;
        
        switch (step.action.type) {
          case 'mcp-tool':
            output = await this.executeMCPTool(step.action.config, input);
            break;
            
          case 'agent-task':
            output = await this.executeAgentTask(step, input);
            break;
            
          case 'human-review':
            output = await this.requestHumanReview(step, input);
            break;
            
          case 'api-call':
            output = await this.executeAPICall(step.action.config, input);
            break;
            
          default:
            throw new Error(`Unknown action type: ${step.action.type}`);
        }
        
        // Check postconditions
        const postconditionsMet = await this.checkConditions(step.conditions.postconditions, instance, output);
        if (!postconditionsMet) {
          throw new Error('Postconditions not met');
        }
        
        return {
          success: true,
          input,
          output,
          attempts,
          started_at: new Date(startTime),
          duration_ms: Date.now() - startTime
        };
        
      } catch (error) {
        console.error(`[WorkflowEngine] Step ${step.id} attempt ${attempts} failed:`, error);
        
        if (attempts >= this.definitions.get(instance.definition_id)!.config.retry_policy.max_attempts) {
          return {
            success: false,
            input: {},
            error: {
              message: error.message,
              code: error.code || 'UNKNOWN',
              stack: error.stack
            },
            attempts,
            started_at: new Date(startTime),
            duration_ms: Date.now() - startTime
          };
        }
        
        // Wait before retry
        await this.delay(this.calculateBackoff(attempts, instance.definition_id));
      }
    }
    
    throw new Error('Max retry attempts exceeded');
  }
  
  // Execute agent task
  private async executeAgentTask(
    step: WorkflowStep, 
    input: Record<string, any>
  ): Promise<Record<string, any>> {
    // Select agent
    const agent = await this.selectAgent(step.agent!, input);
    
    // Assign task
    const taskId = await this.agentPool.assignTask(agent.id, {
      type: step.action.config.task_type,
      description: step.action.config.description,
      input,
      timeout_ms: step.action.config.timeout_ms
    });
    
    // Wait for completion
    const result = await this.agentPool.waitForTask(taskId);
    
    return result.output;
  }
  
  // Select agent based on strategy
  private async selectAgent(
    agentConfig: WorkflowStep['agent'], 
    input: Record<string, any>
  ): Promise<Agent> {
    switch (agentConfig?.selector) {
      case 'specific':
        return this.agentPool.getAgent(agentConfig.target!);
        
      case 'round-robin':
        return this.agentPool.getNextAvailable(agentConfig!.type);
        
      case 'capability-based':
        return this.agentPool.getMostCapable(agentConfig!.type, input);
        
      case 'auction':
        return this.agentPool.runAuction(agentConfig!.type, input);
        
      default:
        throw new Error(`Unknown agent selector: ${agentConfig?.selector}`);
    }
  }
  
  // Get next step
  private getNextStep(
    definition: WorkflowDefinition, 
    currentStepId: string,
    output: Record<string, any>
  ): string | undefined {
    const transitions = definition.transitions.filter(t => t.from === currentStepId);
    
    // Sort by priority
    transitions.sort((a, b) => b.priority - a.priority);
    
    // Find first matching transition
    for (const transition of transitions) {
      if (!transition.condition || this.evaluateCondition(transition.condition, output)) {
        return transition.to;
      }
    }
    
    return undefined;
  }
  
  // Save checkpoint
  private async saveCheckpoint(instance: WorkflowInstance): Promise<void> {
    const checkpoint = {
      instance_id: instance.id,
      timestamp: new Date(),
      state: instance.step_states,
      context: instance.context,
      current_step: instance.current_step
    };
    
    // Save to persistent storage
    await this.persistCheckpoint(checkpoint);
    
    console.log(`[WorkflowEngine] Checkpoint saved for workflow ${instance.id}`);
  }
  
  // Helper methods
  private async executeMCPTool(config: any, input: any): Promise<any> { /* ... */ }
  private async requestHumanReview(step: WorkflowStep, input: any): Promise<any> { /* ... */ }
  private async executeAPICall(config: any, input: any): Promise<any> { /* ... */ }
  private async checkConditions(conditions: Condition[], instance: WorkflowInstance, output?: any): Promise<boolean> { /* ... */ }
  private mapInput(mapping: Record<string, string>, instance: WorkflowInstance): Record<string, any> { /* ... */ }
  private evaluateCondition(condition: Condition, output: any): boolean { /* ... */ }
  private calculateBackoff(attempt: number, definitionId: string): number { /* ... */ }
  private async delay(ms: number): Promise<void> { /* ... */ }
  private async persistCheckpoint(checkpoint: any): Promise<void> { /* ... */ }
}
```

---

## 5. Workflow Examples

### 5.1 Example: Feature Development Workflow

```yaml
# feature-development-workflow.yaml
workflow:
  id: "feature-development"
  name: "Feature Development Workflow"
  version: "1.0.0"
  type: "sequential"
  
  config:
    timeout_seconds: 3600
    retry_policy:
      max_attempts: 3
      backoff_strategy: "exponential"
      backoff_delay_ms: 1000
      max_backoff_ms: 30000
    checkpoint_interval: 3
    parallel_limit: 5
  
  steps:
    - id: "analyze-requirements"
      name: "Analyze Requirements"
      type: "task"
      agent:
        type: "analyst"
        selector: "capability-based"
      action:
        type: "agent-task"
        config:
          task_type: "analysis"
          description: "Analyze user requirements and create specification"
          timeout_ms: 300000
      input_mapping:
        "user_request": "$.context.input.request"
        "project_context": "$.context.variables.project"
      output_mapping:
        "analysis_result": "$.output.analysis"
        "requirements": "$.output.requirements"
      conditions:
        preconditions: []
        postconditions:
          - type: "expression"
            config:
              expression: "$.output.requirements.length > 0"
      on_error: "retry"
    
    - id: "create-architecture"
      name: "Create Architecture"
      type: "task"
      agent:
        type: "architect"
        selector: "capability-based"
      action:
        type: "agent-task"
        config:
          task_type: "architecture"
          description: "Design system architecture based on requirements"
          timeout_ms: 300000
      input_mapping:
        "requirements": "$.step_states['analyze-requirements'].output.requirements"
      output_mapping:
        "architecture": "$.output.architecture"
        "tech_stack": "$.output.tech_stack"
      on_error: "retry"
    
    - id: "plan-implementation"
      name: "Plan Implementation"
      type: "task"
      agent:
        type: "planner"
        selector: "capability-based"
      action:
        type: "agent-task"
        config:
          task_type: "planning"
          description: "Create implementation plan with tasks"
          timeout_ms: 300000
      input_mapping:
        "architecture": "$.step_states['create-architecture'].output.architecture"
        "requirements": "$.step_states['analyze-requirements'].output.requirements"
      output_mapping:
        "task_list": "$.output.tasks"
        "estimates": "$.output.estimates"
      on_error: "retry"
    
    - id: "implement-parallel"
      name: "Implement Features"
      type: "parallel"
      parallel_config:
        branches:
          - id: "frontend-impl"
            name: "Frontend Implementation"
            agent:
              type: "frontend-dev"
              selector: "auction"
            action:
              type: "agent-task"
              config:
                task_type: "implementation"
                description: "Implement frontend components"
          
          - id: "backend-impl"
            name: "Backend Implementation"
            agent:
              type: "backend-dev"
              selector: "auction"
            action:
              type: "agent-task"
              config:
                task_type: "implementation"
                description: "Implement backend APIs"
          
          - id: "database-impl"
            name: "Database Implementation"
            agent:
              type: "db-dev"
              selector: "capability-based"
            action:
              type: "agent-task"
              config:
                task_type: "implementation"
                description: "Implement database schema and queries"
      on_error: "retry"
    
    - id: "code-review"
      name: "Code Review"
      type: "task"
      agent:
        type: "reviewer"
        selector: "capability-based"
      action:
        type: "agent-task"
        config:
          task_type: "review"
          description: "Review all implemented code"
          timeout_ms: 300000
      input_mapping:
        "frontend_code": "$.step_states['implement-parallel'].branches['frontend-impl'].output"
        "backend_code": "$.step_states['implement-parallel'].branches['backend-impl'].output"
        "database_code": "$.step_states['implement-parallel'].branches['database-impl'].output"
      output_mapping:
        "review_result": "$.output.review"
        "issues": "$.output.issues"
        "approved": "$.output.approved"
      on_error: "fail"
    
    - id: "decision-point"
      name: "Review Decision"
      type: "decision"
      conditions:
        - type: "expression"
          config:
            expression: "$.step_states['code-review'].output.approved"
            true_next: "run-tests"
            false_next: "fix-issues"
    
    - id: "fix-issues"
      name: "Fix Review Issues"
      type: "task"
      agent:
        type: "developer"
        selector: "auction"
      action:
        type: "agent-task"
        config:
          task_type: "fix"
          description: "Fix issues identified in code review"
      input_mapping:
        "issues": "$.step_states['code-review'].output.issues"
      output_mapping:
        "fixes": "$.output.fixes"
      on_error: "retry"
      compensation_step: "code-review"
    
    - id: "run-tests"
      name: "Run Tests"
      type: "task"
      agent:
        type: "qa"
        selector: "capability-based"
      action:
        type: "agent-task"
        config:
          task_type: "testing"
          description: "Run all tests"
          timeout_ms: 600000
      output_mapping:
        "test_results": "$.output.results"
        "coverage": "$.output.coverage"
        "passed": "$.output.passed"
      on_error: "retry"
    
    - id: "deploy"
      name: "Deploy"
      type: "task"
      agent:
        type: "devops"
        selector: "capability-based"
      action:
        type: "agent-task"
        config:
          task_type: "deployment"
          description: "Deploy to staging/production"
          timeout_ms: 600000
      conditions:
        preconditions:
          - type: "expression"
            config:
              expression: "$.step_states['run-tests'].output.passed"
      output_mapping:
        "deployment_url": "$.output.url"
        "status": "$.output.status"
      on_error: "retry"
  
  transitions:
    - from: "analyze-requirements"
      to: "create-architecture"
      priority: 1
    
    - from: "create-architecture"
      to: "plan-implementation"
      priority: 1
    
    - from: "plan-implementation"
      to: "implement-parallel"
      priority: 1
    
    - from: "implement-parallel"
      to: "code-review"
      priority: 1
    
    - from: "code-review"
      to: "decision-point"
      priority: 1
    
    - from: "fix-issues"
      to: "code-review"
      priority: 1
    
    - from: "run-tests"
      to: "deploy"
      priority: 1
```

---

## 6. Workflow Monitoring & Observability

### 6.1 Monitoring Dashboard

```typescript
// Workflow Monitoring System
interface WorkflowMetrics {
  // Overall metrics
  total_workflows: number;
  active_workflows: number;
  completed_workflows: number;
  failed_workflows: number;
  
  // Performance metrics
  average_duration_ms: number;
  p50_duration_ms: number;
  p95_duration_ms: number;
  p99_duration_ms: number;
  
  // Step metrics
  step_success_rates: Map<string, number>;
  step_average_durations: Map<string, number>;
  
  // Agent metrics
  agent_utilization: Map<string, number>;
  agent_success_rates: Map<string, number>;
  
  // Error metrics
  error_counts: Map<string, number>;
  retry_counts: Map<string, number>;
}

class WorkflowMonitor {
  private metrics: WorkflowMetrics;
  private eventLog: WorkflowEvent[];
  
  constructor() {
    this.metrics = this.initializeMetrics();
    this.eventLog = [];
  }
  
  // Record event
  recordEvent(event: WorkflowEvent): void {
    this.eventLog.push(event);
    this.updateMetrics(event);
    
    // Real-time alerts
    if (event.type === 'workflow.failed') {
      this.sendAlert('workflow_failure', event);
    }
    
    if (event.type === 'step.retry' && event.data.attempt > 3) {
      this.sendAlert('excessive_retries', event);
    }
  }
  
  // Get real-time status
  getWorkflowStatus(workflowId: string): WorkflowStatus {
    const events = this.eventLog.filter(e => e.workflow_id === workflowId);
    
    return {
      workflow_id: workflowId,
      current_step: this.getCurrentStep(events),
      progress_percentage: this.calculateProgress(events),
      estimated_completion: this.estimateCompletion(events),
      recent_events: events.slice(-10)
    };
  }
  
  // Generate report
  generateReport(timeRange: { start: Date; end: Date }): WorkflowReport {
    const events = this.eventLog.filter(
      e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
    );
    
    return {
      time_range: timeRange,
      summary: this.generateSummary(events),
      performance: this.generatePerformanceStats(events),
      bottlenecks: this.identifyBottlenecks(events),
      recommendations: this.generateRecommendations(events)
    };
  }
  
  // Stream metrics (for real-time dashboard)
  async *streamMetrics(): AsyncGenerator<WorkflowMetrics> {
    while (true) {
      yield this.metrics;
      await this.delay(1000); // Update every second
    }
  }
}
```

---

## 7. Summary

### 7.1 Key Workflow Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KEY WORKFLOW FEATURES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ 4 Workflow Types                                                         │
│     • Sequential - งานแบบลำดับขั้น                                          │
│     • Parallel - งานแบบขนาน                                                 │
│     • Iterative - งานแบบวนซ้ำ (Agile)                                       │
│     • Event-Driven - งานตามเหตุการณ์                                       │
│                                                                              │
│  ✅ State Machine                                                            │
│     • 8 Task States (IDLE → PENDING → ASSIGNED → IN_PROGRESS → COMPLETED)  │
│     • Automatic transitions                                                 │
│     • Error handling with retry/compensation                                │
│                                                                              │
│  ✅ Agent Selection Strategies                                               │
│     • Specific - ระบุ agent เฉพาะ                                          │
│     • Round-Robin - วนเวียนกัน                                              │
│     • Capability-Based - ตามความสามารถ                                     │
│     • Auction - ประมูล                                                     │
│                                                                              │
│  ✅ Quality Gates                                                            │
│     • Preconditions/Postconditions                                          │
│     • Automatic validation                                                  │
│     • Human review checkpoints                                              │
│                                                                              │
│  ✅ Observability                                                            │
│     • Real-time monitoring                                                  │
│     • Event logging                                                         │
│     • Performance metrics                                                   │
│     • Alert system                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. References

### GitHub Repositories Referenced

1. **coordinated-agent-team** (q3ok)
   - Multi-agent workflow with orchestrator
   - Artifact-based coordination
   - https://github.com/q3ok/coordinated-agent-team

2. **claude-code-ultimate-guide** (FlorianBruniaux)
   - Agent Teams Workflow
   - Parallel agent execution
   - https://github.com/FlorianBruniaux/claude-code-ultimate-guide

3. **dash** (agno-agi)
   - Self-learning data agent
   - 6 layers of context
   - https://github.com/agno-agi/dash

---

*สร้างเมื่อ: 2026-04-09*
*Version: 1.0*
