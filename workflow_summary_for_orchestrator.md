# Workflow Design Summary for Orchestrator

## Overview

This document provides a concise summary of the Hierarchical Agent Workflow Design for integration with the orchestrator system.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HIERARCHICAL STRUCTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Level 1: CTO                                                │
│  ├── Strategic Planning                                      │
│  ├── Task Creation (Epic Level)                              │
│  ├── Delegation to Department Heads                          │
│  └── Final Approval & Reporting                              │
│                                                              │
│  Level 2: Department Heads                                   │
│  ├── Task Validation                                         │
│  ├── Task Decomposition                                      │
│  ├── Worker Assignment                                       │
│  ├── Quality Review                                          │
│  └── Progress Reporting to CTO                               │
│                                                              │
│  Level 3: Workers                                            │
│  ├── Task Analysis                                           │
│  ├── Execution Planning                                      │
│  ├── Task Execution                                          │
│  ├── Self-Validation                                         │
│  └── Submission for Review                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Task State Machine

### States

| State | Code | Description |
|-------|------|-------------|
| DRAFT | `draft` | Task created, not submitted |
| PENDING | `pending` | Awaiting assignment |
| ASSIGNED | `assigned` | Assigned to agent |
| IN_PROGRESS | `in_progress` | Being worked on |
| BLOCKED | `blocked` | Blocked by dependency |
| REVIEWING | `reviewing` | Awaiting review |
| APPROVED | `approved` | Passed quality check |
| REJECTED | `rejected` | Failed quality check |
| COMPLETED | `completed` | Successfully finished |
| CLOSED | `closed` | Finalized |
| ERROR | `error` | Unrecoverable error |
| ARCHIVED | `archived` | Historical record |

### State Transitions

```
DRAFT → PENDING → ASSIGNED → IN_PROGRESS → REVIEWING → APPROVED → CLOSED → ARCHIVED
                ↗           ↘              ↘            ↘
         REJECTED ←────────── BLOCKED ←─── ERROR ←──── REJECTED
```

### Valid Transitions Matrix

```python
STATE_TRANSITIONS = {
    "DRAFT": ["PENDING", "CANCELLED"],
    "PENDING": ["ASSIGNED", "CANCELLED"],
    "ASSIGNED": ["IN_PROGRESS", "REJECTED"],
    "IN_PROGRESS": ["REVIEWING", "BLOCKED", "ERROR", "TIMEOUT"],
    "BLOCKED": ["IN_PROGRESS", "ERROR", "CANCELLED"],
    "REVIEWING": ["APPROVED", "REJECTED"],
    "APPROVED": ["CLOSED", "ERROR"],
    "REJECTED": ["IN_PROGRESS", "CANCELLED"],
    "COMPLETED": ["CLOSED"],
    "CLOSED": ["ARCHIVED"],
    "ERROR": ["IN_PROGRESS", "CANCELLED"],
    "CANCELLED": ["ARCHIVED"],
    "ARCHIVED": []
}
```

---

## 3. Delegation Rules

```python
DELEGATION_RULES = {
    "CTO": {
        "can_delegate_to": ["DEPARTMENT_HEAD"],
        "max_depth": 2,
        "requires_approval": True,
        "max_concurrent_tasks": 20
    },
    "DEPARTMENT_HEAD": {
        "can_delegate_to": ["WORKER"],
        "max_depth": 1,
        "requires_approval": False,
        "max_concurrent_tasks": 15
    },
    "WORKER": {
        "can_delegate_to": [],
        "max_depth": 0,
        "requires_approval": False,
        "max_concurrent_tasks": 5
    }
}
```

---

## 4. Quality Thresholds

| Level | Threshold | Action if Below |
|-------|-----------|-----------------|
| Worker (Self) | 0.80 | Continue work |
| Department Head | 0.90 | Request rework |
| CTO | 0.85 | Escalate/Revise |

### Validation Results

| Score Range | Recommendation | Next Action |
|-------------|----------------|-------------|
| 0.90 - 1.00 | APPROVE | Close task |
| 0.70 - 0.89 | CONDITIONAL | Minor fixes |
| 0.00 - 0.69 | REJECT | Return for rework |

---

## 5. Error Handling

### Error Types

| Type | Max Retries | Action |
|------|-------------|--------|
| RECOVERABLE | 3 | Exponential backoff retry |
| VALIDATION_ERROR | 1 | Return to sender |
| EXECUTION_ERROR | 2 | Escalate if failed |
| CRITICAL_ERROR | 0 | Immediate escalation |

### Retry Configuration

```python
RETRY_CONFIG = {
    "exponential_backoff": {
        "initial_delay": 5,      # seconds
        "max_delay": 300,        # seconds
        "jitter": True,
        "jitter_range": (0.5, 1.5)
    },
    "circuit_breaker": {
        "failure_threshold": 5,
        "recovery_timeout": 60,
        "half_open_max_calls": 3
    }
}
```

---

## 6. Communication Flow

### Message Types

| Type | Direction | Priority | Requires ACK |
|------|-----------|----------|--------------|
| TASK_ASSIGNMENT | Downward | HIGH | Yes |
| PROGRESS_UPDATE | Upward | NORMAL | No |
| COMPLETION_REPORT | Upward | HIGH | Yes |
| ESCALATION | Upward | URGENT | Yes |
| APPROVAL_REQUEST | Upward | HIGH | Yes |
| FEEDBACK | Downward | NORMAL | Yes |

### Flow Diagram

```
Delegation (Downward):
  CTO ──[TASK_ASSIGNMENT]──▶ Dept Head ──[TASK_ASSIGNMENT]──▶ Worker

Reporting (Upward):
  Worker ──[COMPLETION_REPORT]──▶ Dept Head ──[COMPLETION_REPORT]──▶ CTO
  Worker ──[ESCALATION]─────────▶ Dept Head ──[ESCALATION]─────────▶ CTO
```

---

## 7. Key Classes for Implementation

### Core Classes

```python
# Task representation
class Task:
    - id: str
    - status: TaskStatus
    - assignee_id: Optional[str]
    - parent_id: Optional[str]
    - acceptance_criteria: List[str]
    - history: List[TaskHistoryEntry]

# Agent representation
class Agent:
    - id: str
    - level: AgentLevel
    - supervisor_id: Optional[str]
    - subordinates: List[str]
    - current_tasks: List[str]
    - max_concurrent_tasks: int

# State management
class TaskStateManager:
    - register_task(task: Task)
    - can_transition(task, new_status) -> bool
    - transition(task, new_status, reason, actor_id) -> Task
    - get_tasks_by_status(status) -> List[Task]

# Delegation
class DelegationManager:
    - can_delegate(from_agent, to_agent) -> bool
    - delegate_task(task, from_agent, to_agent) -> Task
    - escalate_task(task, from_agent, reason) -> Task

# Quality validation
class QualityValidator:
    - validate(task, validator_level, validator_id) -> ValidationResult
    - apply_validation_result(task, result, actor_id) -> Task

# Error handling
class ErrorHandler:
    - classify_error(error) -> ErrorType
    - handle_error(error_context, task, agent) -> Dict
```

---

## 8. Workflow Steps

### Complete Task Lifecycle

```
1. CREATE
   CTO creates task → Status: DRAFT

2. SUBMIT
   CTO submits task → Status: PENDING

3. ASSIGN (Level 1 → Level 2)
   CTO assigns to Dept Head → Status: ASSIGNED

4. DECOMPOSE
   Dept Head breaks into subtasks

5. ASSIGN (Level 2 → Level 3)
   Dept Head assigns to Worker → Status: ASSIGNED

6. START
   Worker begins execution → Status: IN_PROGRESS

7. EXECUTE
   Worker performs task with progress updates

8. SUBMIT FOR REVIEW
   Worker completes work → Status: REVIEWING

9. REVIEW (Level 3 → Level 2)
   Dept Head validates quality
   → APPROVED or REJECTED

10. REPORT (Level 2 → Level 1)
    Dept Head reports to CTO

11. FINAL REVIEW (Level 1)
    CTO reviews aggregated results
    → COMPLETED or REJECTED

12. CLOSE
    CTO closes task → Status: CLOSED

13. ARCHIVE
    Task archived → Status: ARCHIVED
```

---

## 9. Integration Points

### For Orchestrator Integration

1. **Task Creation**: `orchestrator.create_task(...)`
2. **State Transition**: `orchestrator.state_manager.transition(...)`
3. **Task Assignment**: `orchestrator.assign_task(...)`
4. **Quality Review**: `orchestrator.review_task(...)`
5. **Error Handling**: `orchestrator.error_handler.handle_error(...)`
6. **Status Query**: `orchestrator.get_task_status_summary()`

### Event Hooks

```python
# Register hooks for state transitions
orchestrator.state_manager.register_hook(
    TaskStatus.COMPLETED,
    callback_function,
    hook_type="post"
)
```

---

## 10. Files Generated

| File | Description |
|------|-------------|
| `hierarchical_agent_workflow_design.md` | Complete workflow design documentation |
| `workflow_implementation.py` | Python implementation of all workflow components |
| `workflow_summary_for_orchestrator.md` | This summary document |

---

## Quick Reference

### State Transition Codes

```
DRAFT → PENDING: "submit"
PENDING → ASSIGNED: "assign"
ASSIGNED → IN_PROGRESS: "start"
IN_PROGRESS → REVIEWING: "submit"
REVIEWING → APPROVED: "approve"
REVIEWING → REJECTED: "reject"
APPROVED → CLOSED: "close"
REJECTED → IN_PROGRESS: "rework"
ANY → BLOCKED: "block"
BLOCKED → IN_PROGRESS: "unblock"
ANY → ERROR: "error"
```

### Priority Levels

```
1 = LOW
2 = NORMAL
3 = HIGH
4 = URGENT
5 = CRITICAL
```

---

*Generated for Hierarchical Agent Workflow System*
*Version: 1.0*
