"""
Hierarchical Agent Workflow Implementation
MCP Agents - Corporate Structure State Management

This module provides the core implementation for hierarchical agent workflows
with state management, delegation, validation, and error handling.
"""

from enum import Enum, auto
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any, Callable, Set
from datetime import datetime, timedelta
import uuid
import json
from abc import ABC, abstractmethod
import asyncio
import random


# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class TaskStatus(Enum):
    """Task lifecycle states"""
    DRAFT = "draft"
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CLOSED = "closed"
    ERROR = "error"
    TIMEOUT = "timeout"
    CANCELLED = "cancelled"
    ARCHIVED = "archived"


class AgentLevel(Enum):
    """Agent hierarchy levels"""
    CTO = 1
    DEPARTMENT_HEAD = 2
    WORKER = 3


class Priority(Enum):
    """Task priority levels"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    URGENT = 4
    CRITICAL = 5


class ErrorType(Enum):
    """Error classification for handling strategies"""
    RECOVERABLE = "recoverable"
    VALIDATION_ERROR = "validation_error"
    EXECUTION_ERROR = "execution_error"
    CRITICAL_ERROR = "critical_error"
    UNKNOWN = "unknown"


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class TaskHistoryEntry:
    """Records a state change in task history"""
    timestamp: datetime
    from_status: TaskStatus
    to_status: TaskStatus
    reason: str
    actor_id: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp.isoformat(),
            "from_status": self.from_status.value,
            "to_status": self.to_status.value,
            "reason": self.reason,
            "actor_id": self.actor_id,
            "metadata": self.metadata
        }


@dataclass
class Task:
    """Represents a task in the workflow system"""
    id: str
    title: str
    description: str
    status: TaskStatus
    priority: Priority
    creator_id: str
    assignee_id: Optional[str] = None
    parent_id: Optional[str] = None
    acceptance_criteria: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    deadline: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    history: List[TaskHistoryEntry] = field(default_factory=list)
    subtasks: List[str] = field(default_factory=list)
    error_count: int = 0
    retry_count: int = 0
    
    def __post_init__(self):
        if not self.id:
            self.id = f"TASK-{uuid.uuid4().hex[:8].upper()}"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status.value,
            "priority": self.priority.value,
            "creator_id": self.creator_id,
            "assignee_id": self.assignee_id,
            "parent_id": self.parent_id,
            "acceptance_criteria": self.acceptance_criteria,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "metadata": self.metadata,
            "history": [h.to_dict() for h in self.history],
            "subtasks": self.subtasks,
            "error_count": self.error_count,
            "retry_count": self.retry_count
        }


@dataclass
class Agent:
    """Represents an agent in the hierarchy"""
    id: str
    name: str
    level: AgentLevel
    department: str
    skills: List[str] = field(default_factory=list)
    max_concurrent_tasks: int = 5
    current_tasks: List[str] = field(default_factory=list)
    supervisor_id: Optional[str] = None
    subordinates: List[str] = field(default_factory=list)
    performance_metrics: Dict[str, float] = field(default_factory=dict)
    is_active: bool = True
    
    def __post_init__(self):
        if not self.id:
            self.id = f"AGENT-{uuid.uuid4().hex[:8].upper()}"
    
    @property
    def available_capacity(self) -> int:
        return self.max_concurrent_tasks - len(self.current_tasks)
    
    @property
    def is_available(self) -> bool:
        return self.is_active and self.available_capacity > 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "level": self.level.name,
            "department": self.department,
            "skills": self.skills,
            "max_concurrent_tasks": self.max_concurrent_tasks,
            "current_tasks": self.current_tasks,
            "supervisor_id": self.supervisor_id,
            "subordinates": self.subordinates,
            "performance_metrics": self.performance_metrics,
            "is_active": self.is_active,
            "available_capacity": self.available_capacity
        }


@dataclass
class ValidationResult:
    """Result of quality validation"""
    score: float
    passed_criteria: List[str]
    failed_criteria: List[str]
    recommendation: str  # "APPROVE", "CONDITIONAL", "REJECT"
    feedback: str
    validator_id: str
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "score": self.score,
            "passed_criteria": self.passed_criteria,
            "failed_criteria": self.failed_criteria,
            "recommendation": self.recommendation,
            "feedback": self.feedback,
            "validator_id": self.validator_id,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class ErrorContext:
    """Context for error handling"""
    error_type: ErrorType
    error_message: str
    task_id: str
    agent_id: str
    timestamp: datetime = field(default_factory=datetime.now)
    stack_trace: Optional[str] = None
    context_data: Dict[str, Any] = field(default_factory=dict)


# ============================================================================
# STATE MANAGER
# ============================================================================

class TaskStateManager:
    """
    Manages task state transitions with validation and history tracking.
    Implements the state machine for task lifecycle management.
    """
    
    # Define valid state transitions
    STATE_TRANSITIONS: Dict[TaskStatus, List[TaskStatus]] = {
        TaskStatus.DRAFT: [TaskStatus.PENDING, TaskStatus.CANCELLED],
        TaskStatus.PENDING: [TaskStatus.ASSIGNED, TaskStatus.CANCELLED],
        TaskStatus.ASSIGNED: [TaskStatus.IN_PROGRESS, TaskStatus.REJECTED],
        TaskStatus.IN_PROGRESS: [
            TaskStatus.REVIEWING, TaskStatus.BLOCKED, 
            TaskStatus.ERROR, TaskStatus.TIMEOUT
        ],
        TaskStatus.BLOCKED: [TaskStatus.IN_PROGRESS, TaskStatus.ERROR, TaskStatus.CANCELLED],
        TaskStatus.REVIEWING: [TaskStatus.APPROVED, TaskStatus.REJECTED],
        TaskStatus.APPROVED: [TaskStatus.CLOSED, TaskStatus.ERROR],
        TaskStatus.REJECTED: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
        TaskStatus.COMPLETED: [TaskStatus.CLOSED],
        TaskStatus.CLOSED: [TaskStatus.ARCHIVED],
        TaskStatus.ERROR: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
        TaskStatus.TIMEOUT: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
        TaskStatus.CANCELLED: [TaskStatus.ARCHIVED],
        TaskStatus.ARCHIVED: []  # Terminal state
    }
    
    # State transition hooks
    _pre_transition_hooks: Dict[TaskStatus, List[Callable]] = {}
    _post_transition_hooks: Dict[TaskStatus, List[Callable]] = {}
    
    def __init__(self):
        self._tasks: Dict[str, Task] = {}
    
    def register_task(self, task: Task) -> None:
        """Register a task with the state manager"""
        self._tasks[task.id] = task
    
    def get_task(self, task_id: str) -> Optional[Task]:
        """Retrieve a task by ID"""
        return self._tasks.get(task_id)
    
    def can_transition(self, task: Task, new_status: TaskStatus) -> bool:
        """Check if a state transition is valid"""
        valid_transitions = self.STATE_TRANSITIONS.get(task.status, [])
        return new_status in valid_transitions
    
    def transition(
        self, 
        task: Task, 
        new_status: TaskStatus, 
        reason: str, 
        actor_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Task:
        """
        Perform a state transition with full validation and history tracking.
        
        Args:
            task: The task to transition
            new_status: The target state
            reason: Reason for the transition
            actor_id: ID of the agent performing the transition
            metadata: Additional context data
            
        Returns:
            Updated task object
            
        Raises:
            ValueError: If the transition is invalid
        """
        if not self.can_transition(task, new_status):
            raise ValueError(
                f"Invalid transition: {task.status.value} -> {new_status.value}. "
                f"Valid transitions from {task.status.value}: "
                f"{[s.value for s in self.STATE_TRANSITIONS.get(task.status, [])]}"
            )
        
        # Execute pre-transition hooks
        self._execute_hooks(task, new_status, "pre")
        
        old_status = task.status
        task.status = new_status
        task.updated_at = datetime.now()
        
        # Record in history
        history_entry = TaskHistoryEntry(
            timestamp=datetime.now(),
            from_status=old_status,
            to_status=new_status,
            reason=reason,
            actor_id=actor_id,
            metadata=metadata or {}
        )
        task.history.append(history_entry)
        
        # Execute post-transition hooks
        self._execute_hooks(task, new_status, "post")
        
        return task
    
    def _execute_hooks(
        self, 
        task: Task, 
        status: TaskStatus, 
        hook_type: str
    ) -> None:
        """Execute registered hooks for a state transition"""
        hooks_dict = (
            self._pre_transition_hooks if hook_type == "pre" 
            else self._post_transition_hooks
        )
        hooks = hooks_dict.get(status, [])
        for hook in hooks:
            try:
                hook(task)
            except Exception as e:
                print(f"Hook execution failed: {e}")
    
    def register_hook(
        self, 
        status: TaskStatus, 
        hook: Callable, 
        hook_type: str = "post"
    ) -> None:
        """Register a hook for state transitions"""
        hooks_dict = (
            self._pre_transition_hooks if hook_type == "pre" 
            else self._post_transition_hooks
        )
        if status not in hooks_dict:
            hooks_dict[status] = []
        hooks_dict[status].append(hook)
    
    def get_task_history(self, task_id: str) -> List[TaskHistoryEntry]:
        """Get the full history of a task"""
        task = self.get_task(task_id)
        return task.history if task else []
    
    def get_tasks_by_status(self, status: TaskStatus) -> List[Task]:
        """Get all tasks in a specific state"""
        return [t for t in self._tasks.values() if t.status == status]


# ============================================================================
# DELEGATION MANAGER
# ============================================================================

class DelegationManager:
    """
    Manages task delegation between agents in the hierarchy.
    Enforces delegation rules and tracks assignments.
    """
    
    DELEGATION_RULES: Dict[AgentLevel, Dict[str, Any]] = {
        AgentLevel.CTO: {
            "can_delegate_to": [AgentLevel.DEPARTMENT_HEAD],
            "max_delegation_depth": 2,
            "requires_approval": True,
            "max_concurrent_tasks": 20
        },
        AgentLevel.DEPARTMENT_HEAD: {
            "can_delegate_to": [AgentLevel.WORKER],
            "max_delegation_depth": 1,
            "requires_approval": False,
            "max_concurrent_tasks": 15
        },
        AgentLevel.WORKER: {
            "can_delegate_to": [],
            "max_delegation_depth": 0,
            "requires_approval": False,
            "max_concurrent_tasks": 5
        }
    }
    
    def __init__(self, state_manager: TaskStateManager):
        self.state_manager = state_manager
        self._agents: Dict[str, Agent] = {}
    
    def register_agent(self, agent: Agent) -> None:
        """Register an agent with the delegation manager"""
        self._agents[agent.id] = agent
    
    def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Retrieve an agent by ID"""
        return self._agents.get(agent_id)
    
    def can_delegate(self, from_agent: Agent, to_agent: Agent) -> bool:
        """
        Check if delegation from one agent to another is allowed.
        
        Args:
            from_agent: The delegating agent
            to_agent: The target agent
            
        Returns:
            True if delegation is allowed
        """
        rules = self.DELEGATION_RULES.get(from_agent.level)
        if not rules:
            return False
        
        # Check level compatibility
        if to_agent.level not in rules["can_delegate_to"]:
            return False
        
        # Check capacity
        if not to_agent.is_available:
            return False
        
        # Check supervisor relationship
        if to_agent.supervisor_id != from_agent.id:
            # Allow cross-department delegation for CTO
            if from_agent.level != AgentLevel.CTO:
                return False
        
        return True
    
    def delegate_task(
        self, 
        task: Task, 
        from_agent: Agent, 
        to_agent: Agent,
        reason: str = ""
    ) -> Task:
        """
        Delegate a task from one agent to another.
        
        Args:
            task: The task to delegate
            from_agent: The delegating agent
            to_agent: The target agent
            reason: Reason for delegation
            
        Returns:
            Updated task object
            
        Raises:
            PermissionError: If delegation is not allowed
            ValueError: If task cannot be delegated
        """
        if not self.can_delegate(from_agent, to_agent):
            raise PermissionError(
                f"Cannot delegate from {from_agent.level.name} ({from_agent.id}) "
                f"to {to_agent.level.name} ({to_agent.id})"
            )
        
        # Update task assignment
        old_assignee = task.assignee_id
        task.assignee_id = to_agent.id
        
        # Update agent task lists
        if task.id in from_agent.current_tasks:
            from_agent.current_tasks.remove(task.id)
        to_agent.current_tasks.append(task.id)
        
        # Transition task state
        if task.status == TaskStatus.PENDING:
            self.state_manager.transition(
                task, 
                TaskStatus.ASSIGNED, 
                f"Delegated to {to_agent.name}: {reason}",
                from_agent.id
            )
        
        return task
    
    def find_best_worker(
        self, 
        department_head: Agent, 
        required_skills: List[str]
    ) -> Optional[Agent]:
        """
        Find the best available worker for a task.
        
        Args:
            department_head: The department head looking for a worker
            required_skills: Skills required for the task
            
        Returns:
            Best matching worker or None
        """
        candidates = []
        
        for agent in self._agents.values():
            # Must be a direct subordinate
            if agent.supervisor_id != department_head.id:
                continue
            
            # Must be available
            if not agent.is_available:
                continue
            
            # Calculate skill match score
            skill_match = len(set(agent.skills) & set(required_skills))
            skill_score = skill_match / len(required_skills) if required_skills else 1.0
            
            # Consider current workload
            workload_score = agent.available_capacity / agent.max_concurrent_tasks
            
            # Combined score
            total_score = (skill_score * 0.7) + (workload_score * 0.3)
            
            candidates.append((agent, total_score))
        
        # Return the best candidate
        if candidates:
            candidates.sort(key=lambda x: x[1], reverse=True)
            return candidates[0][0]
        
        return None
    
    def escalate_task(
        self, 
        task: Task, 
        from_agent: Agent, 
        reason: str
    ) -> Task:
        """
        Escalate a task to the supervisor.
        
        Args:
            task: The task to escalate
            from_agent: The agent escalating the task
            reason: Reason for escalation
            
        Returns:
            Updated task object
        """
        if not from_agent.supervisor_id:
            raise ValueError(f"Agent {from_agent.id} has no supervisor")
        
        supervisor = self.get_agent(from_agent.supervisor_id)
        if not supervisor:
            raise ValueError(f"Supervisor {from_agent.supervisor_id} not found")
        
        # Remove from current agent
        if task.id in from_agent.current_tasks:
            from_agent.current_tasks.remove(task.id)
        
        # Assign to supervisor
        task.assignee_id = supervisor.id
        supervisor.current_tasks.append(task.id)
        
        # Update task state
        self.state_manager.transition(
            task,
            TaskStatus.BLOCKED,
            f"Escalated: {reason}",
            from_agent.id
        )
        
        return task


# ============================================================================
# QUALITY VALIDATOR
# ============================================================================

class QualityValidator:
    """
    Validates task completion quality against acceptance criteria.
    Implements quality gates at each level of the hierarchy.
    """
    
    QUALITY_THRESHOLDS: Dict[AgentLevel, float] = {
        AgentLevel.WORKER: 0.80,
        AgentLevel.DEPARTMENT_HEAD: 0.90,
        AgentLevel.CTO: 0.85
    }
    
    def __init__(self, state_manager: TaskStateManager):
        self.state_manager = state_manager
    
    def validate(
        self, 
        task: Task, 
        validator_level: AgentLevel,
        validator_id: str,
        custom_checks: Optional[List[Callable]] = None
    ) -> ValidationResult:
        """
        Validate a task against its acceptance criteria.
        
        Args:
            task: The task to validate
            validator_level: Level of the validating agent
            validator_id: ID of the validating agent
            custom_checks: Optional custom validation functions
            
        Returns:
            ValidationResult with score and recommendation
        """
        passed = []
        failed = []
        
        # Check each acceptance criterion
        for criterion in task.acceptance_criteria:
            # Default validation - can be extended
            is_met = self._check_criterion(task, criterion)
            if is_met:
                passed.append(criterion)
            else:
                failed.append(criterion)
        
        # Run custom checks if provided
        if custom_checks:
            for check in custom_checks:
                try:
                    check_result = check(task)
                    if check_result:
                        passed.append(f"custom_check_{len(passed)}")
                    else:
                        failed.append(f"custom_check_{len(failed)}")
                except Exception as e:
                    failed.append(f"custom_check_error: {str(e)}")
        
        # Calculate score
        total = len(passed) + len(failed)
        score = len(passed) / total if total > 0 else 1.0
        
        # Determine recommendation
        threshold = self.QUALITY_THRESHOLDS[validator_level]
        
        if score >= threshold:
            recommendation = "APPROVE"
            feedback = f"Task meets quality standards. Score: {score:.2%}"
        elif score >= threshold * 0.8:
            recommendation = "CONDITIONAL"
            feedback = f"Task meets minimum standards with minor issues. Score: {score:.2%}"
        else:
            recommendation = "REJECT"
            feedback = f"Task does not meet quality standards. Score: {score:.2%}. "
            feedback += f"Failed criteria: {', '.join(failed[:3])}"
        
        return ValidationResult(
            score=score,
            passed_criteria=passed,
            failed_criteria=failed,
            recommendation=recommendation,
            feedback=feedback,
            validator_id=validator_id
        )
    
    def _check_criterion(self, task: Task, criterion: str) -> bool:
        """
        Check if a specific acceptance criterion is met.
        Override this method for custom validation logic.
        """
        # Placeholder implementation
        # In real implementation, this would check actual deliverables
        return True
    
    def apply_validation_result(
        self, 
        task: Task, 
        result: ValidationResult,
        actor_id: str
    ) -> Task:
        """
        Apply a validation result to a task, transitioning its state.
        
        Args:
            task: The task to update
            result: The validation result
            actor_id: ID of the agent applying the result
            
        Returns:
            Updated task object
        """
        if result.recommendation == "APPROVE":
            self.state_manager.transition(
                task,
                TaskStatus.APPROVED,
                f"Quality validation passed. Score: {result.score:.2%}",
                actor_id,
                {"validation": result.to_dict()}
            )
        elif result.recommendation == "REJECT":
            self.state_manager.transition(
                task,
                TaskStatus.REJECTED,
                f"Quality validation failed. Score: {result.score:.2%}. {result.feedback}",
                actor_id,
                {"validation": result.to_dict()}
            )
        else:  # CONDITIONAL
            self.state_manager.transition(
                task,
                TaskStatus.REVIEWING,
                f"Quality validation conditional. Score: {result.score:.2%}. Minor fixes required.",
                actor_id,
                {"validation": result.to_dict()}
            )
        
        return task


# ============================================================================
# ERROR HANDLER
# ============================================================================

class ErrorHandler:
    """
    Handles errors with retry logic and escalation.
    Implements different strategies based on error type.
    """
    
    RETRY_POLICIES: Dict[ErrorType, Dict[str, Any]] = {
        ErrorType.RECOVERABLE: {
            "max_retries": 3,
            "backoff_strategy": "exponential",
            "initial_delay": 5,
            "max_delay": 300,
            "jitter": True
        },
        ErrorType.VALIDATION_ERROR: {
            "max_retries": 1,
            "action": "return_to_sender"
        },
        ErrorType.EXECUTION_ERROR: {
            "max_retries": 2,
            "action": "escalate_if_failed"
        },
        ErrorType.CRITICAL_ERROR: {
            "max_retries": 0,
            "action": "immediate_escalation"
        },
        ErrorType.UNKNOWN: {
            "max_retries": 1,
            "action": "escalate_if_failed"
        }
    }
    
    def __init__(
        self, 
        state_manager: TaskStateManager,
        delegation_manager: DelegationManager
    ):
        self.state_manager = state_manager
        self.delegation_manager = delegation_manager
        self._error_counts: Dict[str, int] = {}  # task_id -> error count
        self._retry_delays: Dict[str, List[float]] = {}  # task_id -> delay history
    
    def classify_error(self, error: Exception) -> ErrorType:
        """
        Classify an error into a known type.
        
        Args:
            error: The exception to classify
            
        Returns:
            ErrorType classification
        """
        error_name = type(error).__name__
        
        recoverable_errors = [
            "TimeoutError", "ConnectionError", "TemporaryFailure",
            "ResourceUnavailable", "ServiceUnavailable"
        ]
        validation_errors = [
            "ValidationError", "ValueError", "TypeError"
        ]
        execution_errors = [
            "RuntimeError", "IOError", "OSError"
        ]
        critical_errors = [
            "SystemError", "SecurityError", "DataCorruptionError"
        ]
        
        if error_name in recoverable_errors:
            return ErrorType.RECOVERABLE
        elif error_name in validation_errors:
            return ErrorType.VALIDATION_ERROR
        elif error_name in execution_errors:
            return ErrorType.EXECUTION_ERROR
        elif error_name in critical_errors:
            return ErrorType.CRITICAL_ERROR
        else:
            return ErrorType.UNKNOWN
    
    def handle_error(
        self, 
        error_context: ErrorContext,
        task: Task,
        agent: Agent
    ) -> Dict[str, Any]:
        """
        Handle an error according to its type and retry policy.
        
        Args:
            error_context: Context information about the error
            task: The task that encountered the error
            agent: The agent that encountered the error
            
        Returns:
            Dict with action taken and next steps
        """
        error_type = error_context.error_type
        policy = self.RETRY_POLICIES.get(error_type, self.RETRY_POLICIES[ErrorType.UNKNOWN])
        
        # Update error count
        task.error_count += 1
        
        result = {
            "error_type": error_type.value,
            "action_taken": "",
            "can_retry": False,
            "next_steps": []
        }
        
        # Handle critical errors immediately
        if error_type == ErrorType.CRITICAL_ERROR:
            self.state_manager.transition(
                task,
                TaskStatus.ERROR,
                f"Critical error: {error_context.error_message}",
                agent.id,
                {"error": error_context.to_dict() if hasattr(error_context, 'to_dict') else str(error_context)}
            )
            result["action_taken"] = "immediate_escalation"
            result["next_steps"] = ["escalate_to_supervisor", "notify_cto"]
            return result
        
        # Check retry limit
        max_retries = policy.get("max_retries", 0)
        if task.retry_count < max_retries:
            task.retry_count += 1
            result["can_retry"] = True
            
            # Calculate retry delay
            delay = self._calculate_retry_delay(task.id, policy)
            result["retry_delay"] = delay
            
            # Transition to appropriate state for retry
            if error_type == ErrorType.RECOVERABLE:
                self.state_manager.transition(
                    task,
                    TaskStatus.IN_PROGRESS,
                    f"Retry {task.retry_count}/{max_retries} after recoverable error",
                    agent.id
                )
                result["action_taken"] = "scheduled_retry"
                result["next_steps"] = [f"wait_{delay}s", "retry_task"]
            else:
                self.state_manager.transition(
                    task,
                    TaskStatus.BLOCKED,
                    f"Error requires attention: {error_context.error_message}",
                    agent.id
                )
                result["action_taken"] = "blocked_for_review"
                result["next_steps"] = ["review_error", "determine_next_action"]
        else:
            # Max retries exceeded
            result["can_retry"] = False
            
            action = policy.get("action", "escalate_if_failed")
            if action == "escalate_if_failed":
                self.delegation_manager.escalate_task(
                    task,
                    agent,
                    f"Max retries ({max_retries}) exceeded: {error_context.error_message}"
                )
                result["action_taken"] = "escalated_to_supervisor"
                result["next_steps"] = ["supervisor_review", "reassign_or_cancel"]
            elif action == "return_to_sender":
                result["action_taken"] = "returned_to_sender"
                result["next_steps"] = ["request_clarification", "revise_requirements"]
            else:
                self.state_manager.transition(
                    task,
                    TaskStatus.ERROR,
                    f"Unrecoverable error after {max_retries} retries",
                    agent.id
                )
                result["action_taken"] = "marked_as_error"
                result["next_steps"] = ["manual_intervention_required"]
        
        return result
    
    def _calculate_retry_delay(self, task_id: str, policy: Dict[str, Any]) -> float:
        """Calculate retry delay with exponential backoff and jitter"""
        initial_delay = policy.get("initial_delay", 5)
        max_delay = policy.get("max_delay", 300)
        use_jitter = policy.get("jitter", True)
        
        # Get retry count for this task
        retry_count = len(self._retry_delays.get(task_id, []))
        
        # Exponential backoff
        delay = min(initial_delay * (2 ** retry_count), max_delay)
        
        # Add jitter
        if use_jitter:
            jitter_range = policy.get("jitter_range", (0.5, 1.5))
            jitter = random.uniform(*jitter_range)
            delay *= jitter
        
        # Store delay history
        if task_id not in self._retry_delays:
            self._retry_delays[task_id] = []
        self._retry_delays[task_id].append(delay)
        
        return delay
    
    def reset_retry_count(self, task_id: str) -> None:
        """Reset retry count for a task"""
        if task_id in self._retry_delays:
            del self._retry_delays[task_id]


# ============================================================================
# WORKFLOW ORCHESTRATOR
# ============================================================================

class WorkflowOrchestrator:
    """
    Main orchestrator that coordinates all workflow components.
    Provides high-level workflow operations.
    """
    
    def __init__(self):
        self.state_manager = TaskStateManager()
        self.delegation_manager = DelegationManager(self.state_manager)
        self.quality_validator = QualityValidator(self.state_manager)
        self.error_handler = ErrorHandler(self.state_manager, self.delegation_manager)
        
        # Register default hooks
        self._register_default_hooks()
    
    def _register_default_hooks(self) -> None:
        """Register default state transition hooks"""
        # Hook for when task is completed
        def on_completed(task: Task) -> None:
            print(f"Task {task.id} completed! Notifying stakeholders...")
        
        self.state_manager.register_hook(TaskStatus.COMPLETED, on_completed)
        
        # Hook for when task errors
        def on_error(task: Task) -> None:
            print(f"Task {task.id} encountered an error. Review required.")
        
        self.state_manager.register_hook(TaskStatus.ERROR, on_error)
    
    def create_task(
        self,
        title: str,
        description: str,
        creator_id: str,
        priority: Priority = Priority.NORMAL,
        acceptance_criteria: Optional[List[str]] = None,
        deadline: Optional[datetime] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Task:
        """
        Create a new task in DRAFT state.
        
        Args:
            title: Task title
            description: Task description
            creator_id: ID of the creating agent
            priority: Task priority
            acceptance_criteria: List of acceptance criteria
            deadline: Optional deadline
            metadata: Optional metadata
            
        Returns:
            Created Task object
        """
        task = Task(
            id=f"TASK-{uuid.uuid4().hex[:8].upper()}",
            title=title,
            description=description,
            status=TaskStatus.DRAFT,
            priority=priority,
            creator_id=creator_id,
            acceptance_criteria=acceptance_criteria or [],
            deadline=deadline,
            metadata=metadata or {}
        )
        
        self.state_manager.register_task(task)
        return task
    
    def submit_task(self, task: Task, actor_id: str) -> Task:
        """
        Submit a task for assignment (DRAFT -> PENDING).
        
        Args:
            task: The task to submit
            actor_id: ID of the agent submitting
            
        Returns:
            Updated Task object
        """
        return self.state_manager.transition(
            task,
            TaskStatus.PENDING,
            "Task submitted for assignment",
            actor_id
        )
    
    def assign_task(
        self, 
        task: Task, 
        from_agent_id: str, 
        to_agent_id: str,
        reason: str = ""
    ) -> Task:
        """
        Assign a task to an agent.
        
        Args:
            task: The task to assign
            from_agent_id: ID of the delegating agent
            to_agent_id: ID of the target agent
            reason: Reason for assignment
            
        Returns:
            Updated Task object
        """
        from_agent = self.delegation_manager.get_agent(from_agent_id)
        to_agent = self.delegation_manager.get_agent(to_agent_id)
        
        if not from_agent or not to_agent:
            raise ValueError("Agent not found")
        
        return self.delegation_manager.delegate_task(
            task, from_agent, to_agent, reason
        )
    
    def start_task(self, task: Task, worker_id: str) -> Task:
        """
        Mark a task as in progress.
        
        Args:
            task: The task to start
            worker_id: ID of the worker starting the task
            
        Returns:
            Updated Task object
        """
        return self.state_manager.transition(
            task,
            TaskStatus.IN_PROGRESS,
            "Task execution started",
            worker_id
        )
    
    def submit_for_review(self, task: Task, worker_id: str) -> Task:
        """
        Submit a task for review.
        
        Args:
            task: The task to submit
            worker_id: ID of the worker submitting
            
        Returns:
            Updated Task object
        """
        return self.state_manager.transition(
            task,
            TaskStatus.REVIEWING,
            "Task completed, awaiting review",
            worker_id
        )
    
    def review_task(
        self, 
        task: Task, 
        reviewer_id: str,
        custom_checks: Optional[List[Callable]] = None
    ) -> ValidationResult:
        """
        Review a task and determine approval status.
        
        Args:
            task: The task to review
            reviewer_id: ID of the reviewing agent
            custom_checks: Optional custom validation functions
            
        Returns:
            ValidationResult with decision
        """
        reviewer = self.delegation_manager.get_agent(reviewer_id)
        if not reviewer:
            raise ValueError(f"Reviewer {reviewer_id} not found")
        
        result = self.quality_validator.validate(
            task,
            reviewer.level,
            reviewer_id,
            custom_checks
        )
        
        self.quality_validator.apply_validation_result(task, result, reviewer_id)
        
        return result
    
    def complete_task(self, task: Task, actor_id: str) -> Task:
        """
        Mark a task as completed.
        
        Args:
            task: The task to complete
            actor_id: ID of the agent completing
            
        Returns:
            Updated Task object
        """
        return self.state_manager.transition(
            task,
            TaskStatus.COMPLETED,
            "Task successfully completed",
            actor_id
        )
    
    def close_task(self, task: Task, actor_id: str) -> Task:
        """
        Close a task (final state before archiving).
        
        Args:
            task: The task to close
            actor_id: ID of the agent closing
            
        Returns:
            Updated Task object
        """
        return self.state_manager.transition(
            task,
            TaskStatus.CLOSED,
            "Task closed",
            actor_id
        )
    
    def archive_task(self, task: Task, actor_id: str) -> Task:
        """
        Archive a task (terminal state).
        
        Args:
            task: The task to archive
            actor_id: ID of the agent archiving
            
        Returns:
            Updated Task object
        """
        return self.state_manager.transition(
            task,
            TaskStatus.ARCHIVED,
            "Task archived for historical reference",
            actor_id
        )
    
    def get_task_status_summary(self) -> Dict[str, int]:
        """Get a summary of tasks by status"""
        summary = {}
        for status in TaskStatus:
            count = len(self.state_manager.get_tasks_by_status(status))
            summary[status.value] = count
        return summary
    
    def get_agent_workload(self, agent_id: str) -> Dict[str, Any]:
        """Get workload information for an agent"""
        agent = self.delegation_manager.get_agent(agent_id)
        if not agent:
            return {}
        
        tasks = [
            self.state_manager.get_task(tid) 
            for tid in agent.current_tasks
        ]
        
        return {
            "agent": agent.to_dict(),
            "active_tasks": [t.to_dict() for t in tasks if t],
            "task_count_by_status": {}
        }


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

def example_workflow():
    """Example of using the workflow system"""
    
    # Initialize orchestrator
    orchestrator = WorkflowOrchestrator()
    
    # Create agents
    cto = Agent(
        id="AGENT-CTO-001",
        name="Chief Technology Officer",
        level=AgentLevel.CTO,
        department="EXECUTIVE",
        max_concurrent_tasks=20
    )
    
    tech_lead = Agent(
        id="AGENT-TL-001",
        name="Tech Lead",
        level=AgentLevel.DEPARTMENT_HEAD,
        department="ENGINEERING",
        supervisor_id=cto.id,
        skills=["architecture", "python", "system_design"],
        max_concurrent_tasks=15
    )
    
    developer = Agent(
        id="AGENT-DEV-001",
        name="Senior Developer",
        level=AgentLevel.WORKER,
        department="ENGINEERING",
        supervisor_id=tech_lead.id,
        skills=["python", "javascript", "database"],
        max_concurrent_tasks=5
    )
    
    # Register agents
    orchestrator.delegation_manager.register_agent(cto)
    orchestrator.delegation_manager.register_agent(tech_lead)
    orchestrator.delegation_manager.register_agent(developer)
    
    # Set up hierarchy
    cto.subordinates = [tech_lead.id]
    tech_lead.subordinates = [developer.id]
    
    # Create a task
    task = orchestrator.create_task(
        title="Implement User Authentication",
        description="Create a secure user authentication system",
        creator_id=cto.id,
        priority=Priority.HIGH,
        acceptance_criteria=[
            "User can register with email and password",
            "User can login with credentials",
            "Passwords are hashed securely",
            "Session management is implemented"
        ],
        deadline=datetime.now() + timedelta(days=7)
    )
    
    print(f"Created task: {task.id}")
    print(f"Initial status: {task.status.value}")
    
    # Submit task
    orchestrator.submit_task(task, cto.id)
    print(f"After submit: {task.status.value}")
    
    # Assign to tech lead
    orchestrator.assign_task(task, cto.id, tech_lead.id, "Engineering task")
    print(f"After assignment to tech lead: {task.status.value}")
    
    # Tech lead assigns to developer
    orchestrator.assign_task(task, tech_lead.id, developer.id, "Implementation task")
    print(f"After assignment to developer: {task.status.value}")
    
    # Developer starts work
    orchestrator.start_task(task, developer.id)
    print(f"After starting: {task.status.value}")
    
    # Developer submits for review
    orchestrator.submit_for_review(task, developer.id)
    print(f"After submission: {task.status.value}")
    
    # Tech lead reviews
    result = orchestrator.review_task(task, tech_lead.id)
    print(f"Review result: {result.recommendation}")
    print(f"After review: {task.status.value}")
    
    # If approved, complete the task
    if result.recommendation == "APPROVE":
        orchestrator.complete_task(task, tech_lead.id)
        print(f"After completion: {task.status.value}")
        
        orchestrator.close_task(task, cto.id)
        print(f"After closing: {task.status.value}")
        
        orchestrator.archive_task(task, cto.id)
        print(f"After archiving: {task.status.value}")
    
    # Print task history
    print("\nTask History:")
    for entry in task.history:
        print(f"  {entry.timestamp}: {entry.from_status.value} -> {entry.to_status.value}")
    
    # Print status summary
    print("\nTask Status Summary:")
    summary = orchestrator.get_task_status_summary()
    for status, count in summary.items():
        print(f"  {status}: {count}")


if __name__ == "__main__":
    example_workflow()
