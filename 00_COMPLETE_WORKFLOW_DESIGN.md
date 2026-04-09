# Complete Workflow & Self-Learning Design
## ระบบ Workflow และการเรียนรู้แบบครอบคลุนสำหรับ MCP Agents

---

## 📋 สารบัญ

1. [ภาพรวมระบบ](#1-ภาพรวมระบบ)
2. [Comprehensive Workflow](#2-comprehensive-workflow)
3. [Self-Learning Loop](#3-self-learning-loop)
4. [Agent Sandbox with Working Memory](#4-agent-sandbox-with-working-memory)
5. [Integration Architecture](#5-integration-architecture)
6. [GitHub References](#6-github-references)

---

## 1. ภาพรวมระบบ

### 1.1 สถาปัตยกรรมรวม

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE WORKFLOW & LEARNING SYSTEM                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 1: USER INTERFACE                                             │   │
│  │  • Kimi CLI Commands                                                 │   │
│  │  • TUI Dashboard (Real-time)                                         │   │
│  │  • Web Dashboard                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 2: WORKFLOW ENGINE                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │  Sequential  │  │   Parallel   │  │   Event-     │              │   │
│  │  │   Workflow   │  │   Workflow   │  │   Driven     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   State      │  │   Agent      │  │   Quality    │              │   │
│  │  │   Machine    │  │   Router     │  │   Gates      │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 3: LEARNING SYSTEM                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Feedback   │  │    Skill     │  │    Meta-     │              │   │
│  │  │   Processor  │  │   Library    │  │   Learner    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Self-      │  │   Knowledge  │  │   Pattern    │              │   │
│  │  │   Evaluator  │  │   Sharing    │  │   Recognizer │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LAYER 4: SANDBOX & MEMORY                                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Sandbox    │  │   Working    │  │  Checkpoint  │              │   │
│  │  │   Container  │  │   Memory     │  │   Reread     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Draft      │  │   Blueprint  │  │   Real-Time  │              │   │
│  │  │   Stream     │  │   Generator  │  │   Dashboard  │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Workflow

### 2.1 4 ประเภทของ Workflow

| Type | ลักษณะ | ใช้เมื่อ |
|------|--------|----------|
| **Sequential** | ทำตามลำดับขั้น | งานที่มี dependency |
| **Parallel** | ทำพร้อมกัน | งานที่แยก sub-tasks ได้ |
| **Iterative** | วนซ้ำปรับปรุง | Agile development |
| **Event-Driven** | ตอบสนองเหตุการณ์ | CI/CD, monitoring |

### 2.2 State Machine

```
IDLE → PENDING → ASSIGNED → IN_PROGRESS → COMPLETED → CLOSED
                          ↓
                    BLOCKED/REJECTED → (retry)
```

---

## 3. Self-Learning Loop

### 3.1 4-Phase Learning Cycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ EXECUTE │───▶│ OBSERVE │───▶│ REFLECT │───▶│ IMPROVE │
│  TASK   │    │ OUTCOME │    │  &      │    │  &      │
│         │    │         │    │ LEARN   │    │ ADAPT   │
└─────────┘    └─────────┘    └─────────┘    └────┬────┘
     ▲                                            │
     └────────────────────────────────────────────┘
```

### 3.2 Multi-Source Feedback

- **Automated Metrics** - Test results, code quality, performance
- **Peer Review** - Code review, architecture review
- **Human Feedback** - Direct ratings, comments
- **Self-Assessment** - Confidence score, self-critique

---

## 4. Agent Sandbox with Working Memory

### 4.1 Core Files

| File | จุดประสงค์ |
|------|------------|
| `ANALYSIS_RESULT_DRAFT.md` | Working Memory ระหว่างทำงาน |
| `CHECKPOINT_STATE.json` | สถานะล่าสุดสำหรับ resume |
| `BLUEPRINT_PROMPT.md` | Technical Specification |
| `FACTS_LOG.json` | Facts ที่ยืนยันแล้ว |
| `HYPOTHESES_LOG.json` | Hypotheses ที่รอตรวจสอบ |

### 4.2 Checkpoint Reread (ทุก 4 Turns)

1. **Fact Verification** - ยืนยันว่า Facts ถูกต้อง
2. **Hallucination Detection** - ตรวจหาข้อมูลไม่มีแหล่งที่มา
3. **Gap Analysis** - ระบุข้อมูลที่ขาด
4. **Confidence Update** - อัปเดตความมั่นใจ

---

## 5. Integration Architecture

```
User → Kimi CLI → Workflow Engine → Agent Sandbox → Working Memory
                                          ↓
                                    Self-Learning Loop
                                          ↓
                                    Skill Library
```

---

## 6. GitHub References

### 6.1 Repositories Referenced

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

4. **Self-Evolving Agents** (OpenAI)
   - GEPA (Genetic-Pareto) optimization
   - Automated prompt improvement
   - https://developers.openai.com/cookbook/examples/partners/self_evolving_agents

5. **Self-Improving AI Agent** (nomannayeem)
   - Feedback loop implementation
   - Skill library system
   - https://medium.com/@nomannayeem/lets-build-a-self-improving-ai-agent

---

## 7. Files Generated

| File | ขนาด | รายละเอียด |
|------|------|-----------|
| `00_COMPLETE_WORKFLOW_DESIGN.md` | - | เอกสารสรุปฉบับสมบูรณ์ |
| `01_COMPREHENSIVE_WORKFLOW.md` | 20 KB | Workflow 4 ประเภท |
| `02_SELF_LEARNING_LOOP.md` | 28 KB | ระบบการเรียนรู้ |
| `03_AGENT_SANDBOX_MEMORY.md` | 26 KB | Sandbox + Working Memory |

---

*สร้างเมื่อ: 2026-04-09*
*Version: 1.0*
