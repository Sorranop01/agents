# Critical Fixes for MCP Hierarchical Agents
## การแก้ไขปัญหาสำคัญก่อนการพัฒนา

---

## 1. การแก้ไขจำนวน Agents (Agent Count Standardization)

### 1.1 จำนวน Agents มาตรฐานที่กำหนด

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STANDARD AGENT COUNT                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LEVEL 1: STRATEGIC (1 Agent)                                                │
│  ├── 1 CTO Agent                                                             │
│                                                                              │
│  LEVEL 2: TACTICAL (5 Agents)                                                │
│  ├── 1 Frontend Department Head                                              │
│  ├── 1 Backend Department Head                                               │
│  ├── 1 DevOps Department Head                                                │
│  ├── 1 QA Department Head                                                    │
│  └── 1 Project Management Department Head                                    │
│                                                                              │
│  LEVEL 3: EXECUTION (20 Workers)                                             │
│  ├── Frontend Workers (4)                                                    │
│  │   ├── React Agent                                                         │
│  │   ├── Vue Agent                                                           │
│  │   ├── CSS Agent                                                           │
│  │   └── UI/UX Agent                                                         │
│  ├── Backend Workers (4)                                                     │
│  │   ├── API Agent                                                           │
│  │   ├── Database Agent                                                      │
│  │   ├── Auth Agent                                                          │
│  │   └── Integration Agent                                                   │
│  ├── DevOps Workers (4)                                                      │
│  │   ├── CI/CD Agent                                                         │
│  │   ├── Infrastructure Agent                                                │
│  │   ├── Monitoring Agent                                                    │
│  │   └── Security Agent                                                      │
│  ├── QA Workers (4)                                                          │
│  │   ├── Test Agent                                                          │
│  │   ├── Automation Agent                                                    │
│  │   ├── Performance Agent                                                   │
│  │   └── Security Test Agent                                                 │
│  └── PM Workers (4)                                                          │
│      ├── Requirements Agent                                                   │
│      ├── Task Agent                                                           │
│      ├── Documentation Agent                                                  │
│      └── Communication Agent                                                  │
│                                                                              │
│  TOTAL: 26 Agents (1 + 5 + 20)                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema

### 2.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA OVERVIEW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐                        │
│  │  Agent   │───────│  Task    │───────│  Project │                        │
│  │          │  1:N  │          │  N:1  │          │                        │
│  └──────────┘       └──────────┘       └──────────┘                        │
│        │                  │                                                  │
│        │                  │                                                  │
│        │             ┌────┴────┐                                            │
│        │             │  Subtask│                                            │
│        │             └─────────┘                                            │
│        │                                                                    │
│        │             ┌──────────┐       ┌──────────┐                       │
│        └─────────────│  Memory  │───────│ Knowledge│                       │
│              1:N     │          │  N:M  │          │                       │
│                      └──────────┘       └──────────┘                       │
│                                                                              │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐                        │
│  │  Message │───────│ Session  │───────│  Vote    │                        │
│  │          │  N:1  │          │  1:N  │          │                        │
│  └──────────┘       └──────────┘       └──────────┘                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 PostgreSQL Schema

```sql
-- ==================== CORE TABLES ====================

-- Agents Table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'cto', 'department_head', 'worker'
    department VARCHAR(50),
    level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
    capabilities JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled')),
    tech_stack JSONB DEFAULT '[]',
    created_by UUID REFERENCES agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'feature', 'bug', 'refactor', 'test'
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'assigned', 'in_progress', 'blocked', 'reviewing', 'completed', 'approved', 'rejected', 'closed', 'error', 'archived')),
    assigned_to UUID REFERENCES agents(id),
    created_by UUID REFERENCES agents(id),
    requirements JSONB DEFAULT '{}',
    acceptance_criteria JSONB DEFAULT '[]',
    estimated_hours INTEGER,
    actual_hours INTEGER,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Dependencies Table
CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(20) DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'requires', 'relates_to')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, depends_on_task_id)
);

-- ==================== MEMORY TABLES ====================

-- Working Memory Table
CREATE TABLE working_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    memory_type VARCHAR(50) NOT NULL CHECK (memory_type IN ('working', 'short_term', 'long_term')),
    key VARCHAR(200) NOT NULL,
    value JSONB NOT NULL,
    importance DECIMAL(3,2) DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
    tags JSONB DEFAULT '[]',
    ttl_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(agent_id, session_id, key)
);

-- Episodic Memory Table
CREATE TABLE episodic_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    task_id UUID REFERENCES tasks(id),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('task_start', 'task_complete', 'decision', 'error', 'learning')),
    content JSONB NOT NULL,
    importance DECIMAL(3,2) DEFAULT 0.5,
    embedding VECTOR(1536), -- For semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector search
CREATE INDEX idx_episodic_memory_embedding ON episodic_memory USING ivfflat (embedding vector_cosine_ops);

-- ==================== COMMUNICATION TABLES ====================

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(100) UNIQUE NOT NULL,
    correlation_id VARCHAR(100),
    from_agent_id UUID REFERENCES agents(id),
    to_type VARCHAR(20) NOT NULL CHECK (to_type IN ('agent', 'group', 'broadcast', 'topic')),
    to_target JSONB NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('command', 'query', 'response', 'event', 'update', 'delegation', 'submission', 'approval', 'alert', 'heartbeat')),
    payload JSONB NOT NULL,
    context JSONB DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low')),
    qos JSONB DEFAULT '{"delivery_guarantee": "at-least-once", "ordering": "unordered", "ttl_seconds": 86400}',
    security JSONB DEFAULT '{"encrypted": false}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for message queries
CREATE INDEX idx_messages_from_agent ON messages(from_agent_id);
CREATE INDEX idx_messages_correlation ON messages(correlation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Sessions Table (for conversations)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('decision', 'review', 'brainstorming', 'emergency')),
    topic VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'convened' CHECK (status IN ('convened', 'in_progress', 'voting', 'resolved', 'closed')),
    speaker_id UUID REFERENCES agents(id),
    participants JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==================== KNOWLEDGE TABLES ====================

-- Skills Table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    domain JSONB DEFAULT '[]',
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    prerequisites JSONB DEFAULT '[]',
    context JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{"usage_count": 0, "success_count": 0, "failure_count": 0, "average_reward": 0}',
    version INTEGER DEFAULT 1,
    parent_skill_id VARCHAR(100) REFERENCES skills(skill_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Skills Junction Table
CREATE TABLE agent_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'novice' CHECK (proficiency_level IN ('novice', 'competent', 'proficient', 'expert', 'master')),
    verified_tasks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, skill_id)
);

-- ==================== WORKFLOW TABLES ====================

-- Workflow Definitions Table
CREATE TABLE workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0.0',
    type VARCHAR(50) NOT NULL CHECK (type IN ('sequential', 'parallel', 'iterative', 'event-driven')),
    definition JSONB NOT NULL,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Instances Table
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id VARCHAR(100) UNIQUE NOT NULL,
    workflow_id UUID REFERENCES workflow_definitions(id),
    project_id UUID REFERENCES projects(id),
    status VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'failed', 'cancelled')),
    context JSONB DEFAULT '{}',
    current_step VARCHAR(100),
    step_states JSONB DEFAULT '{}',
    history JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==================== AUDIT TABLES ====================

-- Audit Log Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id VARCHAR(100) UNIQUE NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'agent', 'task', 'message', 'session'
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES agents(id),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit queries
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);

-- ==================== TRIGGERS ====================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_working_memory_updated_at BEFORE UPDATE ON working_memory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_definitions_updated_at BEFORE UPDATE ON workflow_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Neo4j Schema (Knowledge Graph)

```cypher
// ==================== NODES ====================

// Agent Node
CREATE CONSTRAINT agent_id IF NOT EXISTS
FOR (a:Agent) REQUIRE a.agent_id IS UNIQUE;

// Knowledge Node
CREATE CONSTRAINT knowledge_id IF NOT EXISTS
FOR (k:Knowledge) REQUIRE k.knowledge_id IS UNIQUE;

// Task Node
CREATE CONSTRAINT task_id IF NOT EXISTS
FOR (t:Task) REQUIRE t.task_id IS UNIQUE;

// ==================== RELATIONSHIPS ====================

// Agent relationships
// (Agent)-[:REPORTS_TO]->(Agent)
// (Agent)-[:MANAGES]->(Agent)
// (Agent)-[:COLLABORATES_WITH]->(Agent)

// Knowledge relationships
// (Knowledge)-[:RELATES_TO]->(Knowledge)
// (Knowledge)-[:DEPENDS_ON]->(Knowledge)
// (Knowledge)-[:IS_PART_OF]->(Knowledge)
// (Knowledge)-[:LEADS_TO]->(Knowledge)
// (Knowledge)-[:CONTRADICTS]->(Knowledge)

// Agent-Knowledge relationships
// (Agent)-[:KNOWS]->(Knowledge)
// (Agent)-[:CREATED]->(Knowledge)
// (Agent)-[:VERIFIED]->(Knowledge)

// Task relationships
// (Task)-[:DEPENDS_ON]->(Task)
// (Task)-[:BLOCKS]->(Task)
// (Agent)-[:ASSIGNED_TO]->(Task)
// (Agent)-[:COMPLETED]->(Task)

// ==================== INDEXES ====================

CREATE INDEX agent_type_index IF NOT EXISTS
FOR (a:Agent) ON (a.type);

CREATE INDEX agent_department_index IF NOT EXISTS
FOR (a:Agent) ON (a.department);

CREATE INDEX knowledge_domain_index IF NOT EXISTS
FOR (k:Knowledge) ON (k.domain);

CREATE INDEX knowledge_difficulty_index IF NOT EXISTS
FOR (k:Knowledge) ON (k.difficulty);

CREATE INDEX task_status_index IF NOT EXISTS
FOR (t:Task) ON (t.status);

CREATE INDEX task_priority_index IF NOT EXISTS
FOR (t:Task) ON (t.priority);
```

### 2.4 Redis Key Structure

```
# ==================== WORKING MEMORY ====================

# Agent Working Memory
agent:{agent_id}:working:{key} -> JSON
TTL: 1 hour

# Agent Session Memory
agent:{agent_id}:session:{session_id} -> Hash
TTL: 24 hours

# ==================== CACHE ====================

# Task Cache
task:{task_id} -> JSON
TTL: 5 minutes

# Agent Status Cache
agent:{agent_id}:status -> String
TTL: 30 seconds

# ==================== PUB/SUB ====================

# Channels
agent:{agent_id}:inbox
session:{session_id}:updates
project:{project_id}:events

# ==================== RATE LIMITING ====================

# Agent Rate Limit
ratelimit:agent:{agent_id}:{action} -> Counter
TTL: 1 minute

# ==================== LOCKS ====================

# Task Lock
lock:task:{task_id} -> {agent_id}
TTL: 5 minutes

# ==================== SESSIONS ====================

# WebSocket Sessions
ws:session:{session_id} -> {connection_info}
TTL: 1 hour
```

---

## 3. Security Architecture

### 3.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. AGENT REGISTRATION                                                       │
│  ═══════════════════════                                                     │
│                                                                              │
│  New Agent ──▶ Generate Key Pair ──▶ Submit CSR ──▶ CTO Signs ──▶ Certificate│
│                                                                              │
│  2. AUTHENTICATION                                                           │
│  ════════════════                                                            │
│                                                                              │
│  Agent ──▶ Present Certificate ──▶ Verify Signature ──▶ Issue JWT Token      │
│                                                                              │
│  3. AUTHORIZATION                                                            │
│  ════════════════                                                            │
│                                                                              │
│  Agent ──▶ Present JWT ──▶ Verify Claims ──▶ Check Permissions ──▶ Allow/Deny│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Authorization Matrix

```typescript
// Role-Based Access Control (RBAC)
const RBAC_MATRIX = {
  cto: {
    can_create_project: true,
    can_assign_to_department: true,
    can_review_deliverable: true,
    can_make_decision: true,
    can_escalate_issue: true,
    can_approve_changes: true,
    can_set_priority: true,
    can_generate_report: true,
    can_manage_agents: true,
    can_view_all_tasks: true
  },
  department_head: {
    can_create_project: false,
    can_assign_to_department: false,
    can_assign_to_worker: true,
    can_review_code: true,
    can_request_changes: true,
    can_report_progress: true,
    can_validate_deliverable: true,
    can_set_deadline: true,
    can_escalate_to_cto: true,
    can_view_department_tasks: true
  },
  worker: {
    can_create_project: false,
    can_assign_to_department: false,
    can_assign_to_worker: false,
    can_implement_code: true,
    can_run_tests: true,
    can_submit_task: true,
    can_request_clarification: true,
    can_update_status: true,
    can_self_validate: true,
    can_view_own_tasks: true
  }
};

// Clearance Levels
const CLEARANCE_LEVELS = {
  public: ['cto', 'department_head', 'worker'],
  internal: ['cto', 'department_head', 'worker'],
  confidential: ['cto', 'department_head'],
  restricted: ['cto']
};
```

---

## 4. Error Handling Strategy

### 4.1 Error Classification

```typescript
// Error Types
enum ErrorType {
  // Recoverable errors - can retry
  TRANSIENT_NETWORK_ERROR = 'TRANSIENT_NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  
  // Non-recoverable errors - fail fast
  INVALID_INPUT = 'INVALID_INPUT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Agent-specific errors
  AGENT_CRASHED = 'AGENT_CRASHED',
  AGENT_TIMEOUT = 'AGENT_TIMEOUT',
  AGENT_MEMORY_EXCEEDED = 'AGENT_MEMORY_EXCEEDED',
  
  // Workflow errors
  WORKFLOW_INVALID_STATE = 'WORKFLOW_INVALID_STATE',
  WORKFLOW_STEP_FAILED = 'WORKFLOW_STEP_FAILED',
  WORKFLOW_TIMEOUT = 'WORKFLOW_TIMEOUT'
}

// Error Handler
interface ErrorHandler {
  canHandle(error: AgentError): boolean;
  handle(error: AgentError, context: ErrorContext): Promise<ErrorResult>;
}

// Retry Policy by Error Type
const RETRY_POLICIES: Record<ErrorType, RetryPolicy> = {
  [ErrorType.TRANSIENT_NETWORK_ERROR]: {
    max_attempts: 5,
    backoff_strategy: 'exponential',
    initial_delay_ms: 1000,
    max_delay_ms: 30000
  },
  [ErrorType.RATE_LIMIT_EXCEEDED]: {
    max_attempts: 3,
    backoff_strategy: 'linear',
    initial_delay_ms: 5000,
    max_delay_ms: 60000
  },
  [ErrorType.SERVICE_UNAVAILABLE]: {
    max_attempts: 10,
    backoff_strategy: 'exponential',
    initial_delay_ms: 2000,
    max_delay_ms: 60000
  },
  [ErrorType.TIMEOUT]: {
    max_attempts: 3,
    backoff_strategy: 'linear',
    initial_delay_ms: 1000,
    max_delay_ms: 10000
  },
  // Non-retryable errors
  [ErrorType.INVALID_INPUT]: { max_attempts: 1 },
  [ErrorType.PERMISSION_DENIED]: { max_attempts: 1 },
  [ErrorType.RESOURCE_NOT_FOUND]: { max_attempts: 1 },
  [ErrorType.VALIDATION_FAILED]: { max_attempts: 1 }
};
```

### 4.2 Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: Date;
  
  constructor(
    private config: {
      failureThreshold: number;
      successThreshold: number;
      timeoutMs: number;
    }
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }
  
  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime.getTime() >= this.config.timeoutMs;
  }
}
```

---

## 5. Quick Fixes Checklist

### 5.1 Files to Update

- [ ] `MCP_HIERARCHICAL_AGENTS_COMPLETE_DESIGN.md` - แก้ไขจำนวน Agents เป็น 26
- [ ] `enhanced-mcp-design/00_COMPLETE_ENHANCED_DESIGN.md` - แก้ไขจำนวน Agents เป็น 26
- [ ] สร้าง `DATABASE_SCHEMA.md` - รวม Schema ทั้งหมด
- [ ] สร้าง `SECURITY_ARCHITECTURE.md` - รายละเอียด Security
- [ ] สร้าง `ERROR_HANDLING.md` - รายละเอียด Error Handling

### 5.2 Configuration Files to Create

- [ ] `.env.example` - Environment variables template
- [ ] `docker-compose.yml` - Docker orchestration
- [ ] `cline_mcp_settings.json` - Kimi CLI configuration
- [ ] `config/` folder - All configuration files

---

*สร้างเมื่อ: 2026-04-09*
*Version: 1.0*
