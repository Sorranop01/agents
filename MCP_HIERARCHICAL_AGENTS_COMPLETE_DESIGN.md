# MCP Hierarchical Agents - Complete Design Document
## ระบบ AI Agents แบบลำดับชั้นสำหรับงานเขียนโค้ด

---

## 📋 สารบัญ

1. [ภาพรวมระบบ](#1-ภาพรวมระบบ)
2. [โครงสร้างลำดับชั้น](#2-โครงสร้างลำดับชั้น)
3. [บทบาทและความรับผิดชอบ](#3-บทบาทและความรับผิดชอบ)
4. [Workflow และ State Management](#4-workflow-และ-state-management)
5. [MCP Server Architecture](#5-mcp-server-architecture)
6. [Task Steps และ Style Guidelines](#6-task-steps-และ-style-guidelines)
7. [การติดตั้งและใช้งานกับ Kimi CLI](#7-การติดตั้งและใช้งานกับ-kimi-cli)
8. [ตัวอย่างการใช้งาน](#8-ตัวอย่างการใช้งาน)

---

## 1. ภาพรวมระบบ

### 1.1 วัตถุประสงค์

พัฒนาระบบ MCP (Model Context Protocol) Agents ที่มีโครงสร้างแบบลำดับชั้น (Hierarchical) สำหรับงานเขียนโค้ด โดยจำลองโครงสร้างองค์กรเทคโนโลยีที่มี CTO, หัวหน้าแผนก และผู้ปฏิบัติงาน

### 1.2 สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MCP Hierarchical System                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      CTO Agent (Strategic Layer)                 │   │
│  │  ├─ วิเคราะห์ความต้องการระดับสูง                                    │   │
│  │  ├─ กำหนดทิศทางโครงการ                                            │   │
│  │  ├─ จ่ายงานให้ Department Heads                                   │   │
│  │  └─ รับรายงานผลและตัดสินใจ                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              Department Head Agents (Management Layer)           │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │  Frontend   │  │   Backend   │  │   DevOps    │  ...         │   │
│  │  │    Head     │  │    Head     │  │    Head     │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │         │                │                │                      │   │
│  │         ▼                ▼                ▼                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │  Frontend   │  │   Backend   │  │   DevOps    │              │   │
│  │  │   Workers   │  │   Workers   │  │   Workers   │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   Kimi CLI Integration Layer                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. โครงสร้างลำดับชั้น

### 2.1 Organization Chart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                      ┌─────────────────────────┐                            │
│                      │      👔 CTO Agent       │                            │
│                      │   (Chief Technology     │                            │
│                      │       Officer)          │                            │
│                      └───────────┬─────────────┘                            │
│                                  │                                          │
│              ┌───────────────────┼───────────────────┐                      │
│              │                   │                   │                      │
│              ▼                   ▼                   ▼                      │
│    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │
│    │  🎨 Frontend    │ │  ⚙️ Backend     │ │  🚀 DevOps      │             │
│    │  Department     │ │  Department     │ │  Department     │             │
│    │     Head        │ │     Head        │ │     Head        │             │
│    └────────┬────────┘ └────────┬────────┘ └────────┬────────┘             │
│             │                   │                   │                       │
│      ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐               │
│      │             │     │             │     │             │               │
│      ▼             ▼     ▼             ▼     ▼             ▼               │
│  ┌───────┐   ┌───────┐ ┌───────┐   ┌───────┐ ┌───────┐   ┌───────┐        │
│  │ React │   │ Vue   │ │ API   │   │ DB    │ │ CI/CD │   │ Infra │        │
│  │ Agent │   │ Agent │ │ Agent │   │ Agent │ │ Agent │   │ Agent │        │
│  └───────┘   └───────┘ └───────┘   └───────┘ └───────┘   └───────┘        │
│                                                                             │
│    ┌─────────────────┐ ┌─────────────────┐                                 │
│    │  🧪 QA          │ │  📋 Project     │                                 │
│    │  Department     │ │  Management     │                                 │
│    │     Head        │ │  Department     │                                 │
│    └────────┬────────┘ └────────┬────────┘                                 │
│             │                   │                                           │
│      ┌──────┴──────┐     ┌──────┴──────┐                                   │
│      │             │     │             │                                   │
│      ▼             ▼     ▼             ▼                                   │
│  ┌───────┐   ┌───────┐ ┌───────┐   ┌───────┐                               │
│  │ Test  │   │ Auto  │ │ Req   │   │ Task  │                               │
│  │ Agent │   │ Test  │ │ Agent │   │ Agent │                               │
│  └───────┘   └───────┘ └───────┘   └───────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 สถิติระบบ

| Component | Count |
|-----------|-------|
| **Total Agents** | 26 Agents |
| **Hierarchy Levels** | 3 ระดับ |
| **Departments** | 5 แผนก |
| **CTO** | 1 Agent |
| **Department Heads** | 5 Agents |
| **Workers** | 20 Agents |

---

## 3. บทบาทและความรับผิดชอบ

### 3.1 Level 1: CTO Agent (Strategic Layer)

| Attribute | Description |
|-----------|-------------|
| **Level** | C-Level (Executive) |
| **Reports To** | User/Client |
| **Direct Reports** | All Department Heads |

**Core Responsibilities:**
- กำหนดทิศทางเทคโนโลยีและกลยุทธ์การพัฒนา
- รับ Requirements จากผู้ใช้และแปลงเป็น Technical Roadmap
- จัดสรรทรัพยากรและกำหนดลำดับความสำคัญของโครงการ
- ตัดสินใจเรื่องสถาปัตยกรรมระดับสูง
- อนุมัติการเปลี่ยนแปลงที่มีผลกระทบใหญ่
- ตรวจสอบและรับรองผลงานสุดท้ายก่อนส่งมอบ

**Authority Level:**
- ✅ อนุมัติโครงสร้างโครงการ
- ✅ ตัดสินใจเลือกเทคโนโลยีหลัก
- ✅ อนุมัติงบประมาณ/ทรัพยากร
- ✅ ตัดสินใจขั้นสุดท้ายในกรณีข้อขัดแย้ง

---

### 3.2 Level 2: Department Heads (Management Layer)

#### 🎨 Frontend Department Head

| Attribute | Description |
|-----------|-------------|
| **Level** | Department Head |
| **Reports To** | CTO Agent |
| **Direct Reports** | Frontend Workers (React Agent, Vue Agent, CSS Agent, UI/UX Agent) |

**Core Responsibilities:**
- รับคำสั่งจาก CTO และวิเคราะห์ความต้องการ Frontend
- ออกแบบสถาปัตยกรรม Frontend
- จัดสรรงานให้กับ Frontend Workers
- ตรวจสอบคุณภาพโค้ด Frontend
- รายงานความคืบหน้าให้ CTO
- แก้ไขปัญหา Technical ระดับแผนก

#### ⚙️ Backend Department Head

| Attribute | Description |
|-----------|-------------|
| **Level** | Department Head |
| **Reports To** | CTO Agent |
| **Direct Reports** | Backend Workers (API Agent, Database Agent, Auth Agent, Integration Agent) |

**Core Responsibilities:**
- รับคำสั่งจาก CTO และวิเคราะห์ความต้องการ Backend
- ออกแบบ Database Schema และ API Structure
- จัดสรรงานให้กับ Backend Workers
- ตรวจสอบคุณภาพโค้ด Backend
- รายงานความคืบหน้าให้ CTO
- จัดการ Integration ระหว่างระบบ

#### 🚀 DevOps Department Head

| Attribute | Description |
|-----------|-------------|
| **Level** | Department Head |
| **Reports To** | CTO Agent |
| **Direct Reports** | DevOps Workers (CI/CD Agent, Infrastructure Agent, Monitoring Agent, Security Agent) |

**Core Responsibilities:**
- รับคำสั่งจาก CTO และวิเคราะห์ความต้องการ Infrastructure
- ออกแบบ CI/CD Pipeline
- จัดสรรงานให้กับ DevOps Workers
- ตรวจสอบคุณภาพ Configuration
- รายงานสถานะ Infrastructure ให้ CTO
- จัดการ Deployment และ Monitoring

#### 🧪 QA Department Head

| Attribute | Description |
|-----------|-------------|
| **Level** | Department Head |
| **Reports To** | CTO Agent |
| **Direct Reports** | QA Workers (Test Agent, Automation Agent, Performance Agent, Security Test Agent) |

**Core Responsibilities:**
- รับคำสั่งจาก CTO และวิเคราะห์ความต้องการ Testing
- ออกแบบ Test Strategy และ Test Plans
- จัดสรรงานให้กับ QA Workers
- ตรวจสอบคุณภาพ Test Cases
- รายงาน Test Results ให้ CTO
- จัดการ Bug Tracking และ Quality Metrics

#### 📋 Project Management Department Head

| Attribute | Description |
|-----------|-------------|
| **Level** | Department Head |
| **Reports To** | CTO Agent |
| **Direct Reports** | PM Workers (Requirements Agent, Task Agent, Documentation Agent, Communication Agent) |

**Core Responsibilities:**
- รับคำสั่งจาก CTO และวิเคราะห์ความต้องการโครงการ
- จัดการ Project Timeline และ Milestones
- จัดสรรงานให้กับ PM Workers
- ตรวจสอบคุณภาพ Documentation
- รายงาน Project Status ให้ CTO
- จัดการ Communication ระหว่าง Stakeholders

---

### 3.3 Level 3: Worker Agents (Execution Layer)

#### Frontend Workers
| Agent | Specialization |
|-------|----------------|
| React Agent | React components, hooks, state management |
| Vue Agent | Vue components, composition API |
| CSS Agent | Styling, responsive design, animations |
| UI/UX Agent | User interface design, accessibility |

#### Backend Workers
| Agent | Specialization |
|-------|----------------|
| API Agent | RESTful API, GraphQL, endpoint design |
| Database Agent | Schema design, queries, optimization |
| Auth Agent | Authentication, authorization, security |
| Integration Agent | Third-party integrations, webhooks |

#### DevOps Workers
| Agent | Specialization |
|-------|----------------|
| CI/CD Agent | Pipeline design, automation |
| Infrastructure Agent | Cloud resources, Terraform |
| Monitoring Agent | Logging, metrics, alerting |
| Security Agent | Security scanning, compliance |

#### QA Workers
| Agent | Specialization |
|-------|----------------|
| Test Agent | Manual testing, test case design |
| Automation Agent | Automated test scripts |
| Performance Agent | Load testing, benchmarking |
| Security Test Agent | Vulnerability scanning |

---

## 4. Workflow และ State Management

### 4.1 Task State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐             │
│    │  DRAFT  │────▶│ PENDING │────▶│ASSIGNED │────▶│IN_PROG  │             │
│    └─────────┘     └─────────┘     └─────────┘     └────┬────┘             │
│         ▲                                               │                   │
│         │                                               ▼                   │
│         │                                          ┌─────────┐              │
│         │                                          │ BLOCKED │              │
│         │                                          └────┬────┘              │
│         │                                               │                   │
│         │          ┌─────────┐     ┌─────────┐         │                   │
│         └──────────│COMPLETED│◀────│REVIEWING│◀────────┘                   │
│                    └────┬────┘     └─────────┘                              │
│                         │                                                   │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │      APPROVED       │                                        │
│              │  (Quality Passed)   │                                        │
│              └──────────┬──────────┘                                        │
│                         │                                                   │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │       CLOSED        │                                        │
│              │  (Finalized Task)   │                                        │
│              └─────────────────────┘                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 State Definitions

| State | Code | Description | Allowed Transitions |
|-------|------|-------------|---------------------|
| **DRAFT** | `DRAFT` | Task created but not yet submitted | → PENDING, CANCELLED |
| **PENDING** | `PENDING` | Task awaiting assignment | → ASSIGNED, CANCELLED |
| **ASSIGNED** | `ASSIGNED` | Task assigned to worker | → IN_PROGRESS, REJECTED |
| **IN_PROGRESS** | `IN_PROGRESS` | Worker actively working on task | → REVIEWING, BLOCKED, ERROR |
| **BLOCKED** | `BLOCKED` | Task blocked by dependency/issue | → IN_PROGRESS, ERROR |
| **REVIEWING** | `REVIEWING` | Task completed, awaiting review | → APPROVED, REJECTED |
| **APPROVED** | `APPROVED` | Task passed quality review | → CLOSED, ERROR |
| **REJECTED** | `REJECTED` | Task failed review, needs rework | → IN_PROGRESS, CANCELLED |
| **CLOSED** | `CLOSED` | Task finalized and archived | → ARCHIVED |
| **ERROR** | `ERROR` | Task encountered unrecoverable error | → IN_PROGRESS, CANCELLED |
| **ARCHIVED** | `ARCHIVED` | Task stored for historical reference | (Terminal State) |

### 4.3 Quality Gates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        QUALITY CONTROL GATES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Gate 1: Requirements Validation                                           │
│   ├── ตรวจสอบความครบถ้วนของ requirements                                    │
│   └── ผ่านโดย: Department Head                                              │
│                         │                                                   │
│                         ▼                                                   │
│   Gate 2: Worker Self-Validation (threshold: 0.80)                          │
│   ├── ตรวจสอบโค้ดก่อนส่ง                                                    │
│   └── ผ่านโดย: Worker Agent                                                 │
│                         │                                                   │
│                         ▼                                                   │
│   Gate 3: Department Head Review (threshold: 0.90)                          │
│   ├── Code review และ quality check                                         │
│   └── ผ่านโดย: Department Head                                              │
│                         │                                                   │
│                         ▼                                                   │
│   Gate 4: CTO Final Approval (threshold: 0.85)                              │
│   ├── Final review และ approval                                             │
│   └── ผ่านโดย: CTO Agent                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Communication Protocol

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMMUNICATION FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   TOP-DOWN (Delegation)                                                     │
│   ═══════════════════════                                                   │
│   CTO → Department Head:                                                    │
│   {                                                                         │
│     "type": "TASK_ASSIGNMENT",                                              │
│     "from": "cto-agent",                                                    │
│     "to": "frontend-head",                                                  │
│     "task": { ... },                                                        │
│     "priority": "HIGH",                                                     │
│     "deadline": "2024-01-15T00:00:00Z"                                      │
│   }                                                                         │
│                                                                              │
│   Department Head → Worker:                                                 │
│   {                                                                         │
│     "type": "SUBTASK_ASSIGNMENT",                                           │
│     "from": "frontend-head",                                                │
│     "to": "react-agent",                                                    │
│     "parent_task_id": "TASK-001",                                           │
│     "subtask": { ... }                                                      │
│   }                                                                         │
│                                                                              │
│   BOTTOM-UP (Reporting)                                                     │
│   ═══════════════════════                                                   │
│   Worker → Department Head:                                                 │
│   {                                                                         │
│     "type": "TASK_SUBMISSION",                                              │
│     "from": "react-agent",                                                  │
│     "to": "frontend-head",                                                  │
│     "task_id": "TASK-001-001",                                              │
│     "status": "COMPLETED",                                                  │
│     "deliverables": [ ... ],                                                │
│     "test_report": { ... }                                                  │
│   }                                                                         │
│                                                                              │
│   Department Head → CTO:                                                    │
│   {                                                                         │
│     "type": "PROGRESS_REPORT",                                              │
│     "from": "frontend-head",                                                │
│     "to": "cto-agent",                                                      │
│     "task_id": "TASK-001",                                                  │
│     "status": "APPROVED",                                                   │
│     "summary": "All subtasks completed and reviewed"                        │
│   }                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. MCP Server Architecture

### 5.1 System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MCP SERVER ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MCP Server                                    │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │   Tools     │  │  Resources  │  │   Prompts   │                 │   │
│  │  │  (29 tools) │  │  (Schemas)  │  │  (Templates)│                 │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│           ┌────────────────────────┼────────────────────────┐               │
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  CTO Tools      │    │  Manager Tools  │    │  Worker Tools   │         │
│  │  (9 tools)      │    │  (10 tools)     │    │  (10 tools)     │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                              │
│  Core Services:                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Agent Registry  │  │ Task Manager    │  │ Message Broker  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 CTO Tools (9 Tools)

| Tool Name | Description |
|-----------|-------------|
| `create_project` | สร้างโครงการใหม่ |
| `assign_to_department` | มอบหมายงานให้แผนก |
| `review_deliverable` | ตรวจสอบผลงาน |
| `get_project_status` | ดูสถานะโครงการ |
| `make_decision` | ตัดสินใจเรื่องสำคัญ |
| `escalate_issue` | ยกระดับปัญหา |
| `approve_changes` | อนุมัติการเปลี่ยนแปลง |
| `set_priority` | กำหนดลำดับความสำคัญ |
| `generate_report` | สร้างรายงาน |

### 5.3 Manager Tools (10 Tools)

| Tool Name | Description |
|-----------|-------------|
| `analyze_requirements` | วิเคราะห์ความต้องการ |
| `breakdown_task` | แบ่งงานย่อย |
| `assign_to_worker` | มอบหมายให้ worker |
| `review_code` | ตรวจสอบโค้ด |
| `request_changes` | ขอให้แก้ไข |
| `report_progress` | รายงานความคืบหน้า |
| `coordinate_with_dept` | ประสานงานระหว่างแผนก |
| `validate_deliverable` | ตรวจสอบผลงาน |
| `set_deadline` | กำหนดเส้นตาย |
| `escalate_to_cto` | ยกระดับไป CTO |

### 5.4 Worker Tools (10 Tools)

| Tool Name | Description |
|-----------|-------------|
| `implement_code` | เขียนโค้ด |
| `run_tests` | รันการทดสอบ |
| `submit_task` | ส่งงาน |
| `request_clarification` | ขอคำชี้แจง |
| `update_status` | อัปเดตสถานะ |
| `generate_documentation` | สร้างเอกสาร |
| `self_validate` | ตรวจสอบตนเอง |
| `report_issue` | รายงานปัญหา |
| `get_task_details` | ดูรายละเอียดงาน |
| `save_checkpoint` | บันทึก checkpoint |

---

## 6. Task Steps และ Style Guidelines

### 6.1 Task Steps Definition

```json
{
  "task_steps": {
    "phase_1_analysis": {
      "name": "Analysis Phase",
      "steps": [
        "รับความต้องการจากผู้ใช้",
        "วิเคราะห์ requirements",
        "ระบุ dependencies และ constraints",
        "ประเมิน resources และ timeline"
      ]
    },
    "phase_2_planning": {
      "name": "Planning Phase",
      "steps": [
        "สร้าง project plan",
        "กำหนด milestones",
        "จัดสรรทรัพยากร",
        "กำหนด acceptance criteria"
      ]
    },
    "phase_3_delegation": {
      "name": "Delegation Phase",
      "steps": [
        "เลือก department ที่เหมาะสม",
        "สร้าง task specifications",
        "มอบหมายงานพร้อม context",
        "ตั้ง deadline และ priority"
      ]
    },
    "phase_4_execution": {
      "name": "Execution Phase",
      "steps": [
        "รับงานและวิเคราะห์",
        "วางแผนการ implement",
        "เขียนโค้ดตามมาตรฐาน",
        "ทดสอบและตรวจสอบ"
      ]
    },
    "phase_5_review": {
      "name": "Review Phase",
      "steps": [
        "ตรวจสอบ code quality",
        "ตรวจสอบ compliance",
        "ร้องขอแก้ไข (ถ้าจำเป็น)",
        "อนุมัติหรือปฏิเสธ"
      ]
    },
    "phase_6_delivery": {
      "name": "Delivery Phase",
      "steps": [
        "รวบรวม deliverables",
        "สร้าง final report",
        "ส่งมอบให้ CTO",
        "จัดเก็บ documentation"
      ]
    }
  }
}
```

### 6.2 Communication Style Guidelines

```json
{
  "communication_style": {
    "cto_level": {
      "tone": "professional",
      "detail_level": "high_level",
      "focus": "strategic",
      "language": "formal"
    },
    "manager_level": {
      "tone": "professional",
      "detail_level": "moderate",
      "focus": "tactical",
      "language": "technical"
    },
    "worker_level": {
      "tone": "direct",
      "detail_level": "detailed",
      "focus": "implementation",
      "language": "technical"
    }
  }
}
```

### 6.3 Coding Style Guidelines

```json
{
  "coding_style": {
    "general": {
      "indentation": "2 spaces",
      "max_line_length": 100,
      "naming_convention": "camelCase",
      "documentation": "JSDoc required"
    },
    "frontend": {
      "framework": "React/Vue",
      "styling": "CSS Modules / Styled Components",
      "testing": "Jest + React Testing Library"
    },
    "backend": {
      "language": "TypeScript/Node.js",
      "api_style": "RESTful / GraphQL",
      "database": "TypeORM / Prisma",
      "testing": "Jest + Supertest"
    }
  }
}
```

---

## 7. การติดตั้งและใช้งานกับ Kimi CLI

### 7.1 Prerequisites

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | macOS 12+ / Ubuntu 20.04+ / Windows 10+ | macOS 14+ / Ubuntu 22.04+ |
| RAM | 8 GB | 16 GB |
| Disk Space | 2 GB | 5 GB |
| Node.js | 18.x | 20.x LTS |
| Python | 3.9+ | 3.11+ |

### 7.2 Installation Steps

```bash
# 1. ติดตั้ง Node.js และ npm
# macOS
brew install node@20

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. ติดตั้ง Kimi CLI
npm install -g @kimi-ai/cli

# 3. Login เข้าสู่ระบบ
kimi login

# 4. สร้างโปรเจค
mkdir ~/kimi-mcp-agents
cd ~/kimi-mcp-agents
npm init -y

# 5. ติดตั้ง dependencies
npm install @modelcontextprotocol/sdk typescript ts-node

# 6. สร้างไฟล์ .env
cat > .env << 'EOF'
KIMI_API_KEY=your_kimi_api_key_here
KIMI_BASE_URL=https://api.moonshot.cn/v1
MCP_ORCHESTRATOR_PORT=3000
MCP_PLANNER_PORT=3001
MCP_CODER_PORT=3002
MCP_RESEARCH_PORT=3003
AGENT_MAX_DEPTH=3
AGENT_TIMEOUT_MS=30000
AGENT_MAX_RETRIES=3
LOG_LEVEL=info
EOF
```

### 7.3 Configuration File (cline_mcp_settings.json)

```json
{
  "mcpServers": {
    "hierarchical-agents": {
      "command": "node",
      "args": ["/path/to/mcp-hierarchical-agents/dist/server.js"],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}",
        "AGENT_MAX_DEPTH": "3",
        "AGENT_TIMEOUT_MS": "30000"
      },
      "disabled": false,
      "autoApprove": []
    },
    "cto-agent": {
      "command": "node",
      "args": ["/path/to/mcp-hierarchical-agents/dist/cto-server.js"],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}"
      },
      "disabled": false
    },
    "frontend-manager": {
      "command": "node",
      "args": ["/path/to/mcp-hierarchical-agents/dist/frontend-server.js"],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}"
      },
      "disabled": false
    },
    "backend-manager": {
      "command": "node",
      "args": ["/path/to/mcp-hierarchical-agents/dist/backend-server.js"],
      "env": {
        "KIMI_API_KEY": "${KIMI_API_KEY}"
      },
      "disabled": false
    }
  }
}
```

### 7.4 Directory Structure

```
~/kimi-mcp-agents/
├── .env                          # Environment variables
├── .env.example                  # Example environment file
├── package.json                  # Node.js dependencies
├── cline_mcp_settings.json       # Main MCP configuration
├── tsconfig.json                 # TypeScript configuration
├── src/
│   ├── server.ts                 # Main MCP Server
│   ├── schemas/                  # Data Models
│   │   ├── agent-registry.ts
│   │   ├── task-structure.ts
│   │   ├── reports.ts
│   │   └── messages.ts
│   ├── tools/                    # Tool Definitions
│   │   ├── cto-tools.ts
│   │   ├── manager-tools.ts
│   │   └── worker-tools.ts
│   ├── handlers/                 # Tool Handlers
│   │   ├── cto-handlers.ts
│   │   ├── manager-handlers.ts
│   │   └── worker-handlers.ts
│   └── services/                 # Core Services
│       ├── agent-registry.ts
│       ├── task-manager.ts
│       └── message-broker.ts
├── config/
│   └── agents/                   # Agent configurations
│       ├── cto.json
│       ├── frontend-head.json
│       ├── backend-head.json
│       └── ...
└── examples/                     # Usage examples
    └── workflow-example.md
```

---

## 8. ตัวอย่างการใช้งาน

### 8.1 ตัวอย่าง Workflow: สร้าง Web Application

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              EXAMPLE: Building a Web Application                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1: User → CTO Agent                                                   │
│  ═══════════════════════════════════                                        │
│  User: "สร้างระบบจัดการสต็อกสินค้า"                                          │
│                                                                              │
│  CTO Agent Analysis:                                                        │
│  ├── Requirements: CRUD operations, reports, user management                │
│  ├── Tech Stack: React + Node.js + PostgreSQL                               │
│  ├── Timeline: 4 weeks                                                      │
│  └── Departments needed: Frontend, Backend, QA                              │
│                                                                              │
│  CTO Output:                                                                │
│  ├── Epic: "Inventory Management System"                                    │
│  ├── Milestones: M1 (Auth), M2 (CRUD), M3 (Reports), M4 (Testing)           │
│  └── Assignments: Frontend, Backend, QA Heads                               │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 2: CTO → Department Heads                                             │
│  ═══════════════════════════════════                                        │
│                                                                              │
│  To Frontend Head:                                                          │
│  ├── Task: "Create React UI for Inventory System"                           │
│  ├── Sub-tasks: Login page, Dashboard, Product CRUD, Reports view           │
│  └── Deadline: 3 weeks                                                      │
│                                                                              │
│  To Backend Head:                                                           │
│  ├── Task: "Build Node.js API for Inventory System"                         │
│  ├── Sub-tasks: Auth API, Product API, Report API, Database schema          │
│  └── Deadline: 3 weeks                                                      │
│                                                                              │
│  To QA Head:                                                                │
│  ├── Task: "Create Test Plan for Inventory System"                          │
│  ├── Sub-tasks: Unit tests, Integration tests, E2E tests                    │
│  └── Deadline: 4 weeks (parallel with dev)                                  │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 3: Department Heads → Workers                                         │
│  ═══════════════════════════════════                                        │
│                                                                              │
│  Frontend Head → React Agent:                                               │
│  ├── Task: "Create Login Page Component"                                    │
│  ├── Specs: Form validation, error handling, responsive design              │
│  └── Deadline: 3 days                                                       │
│                                                                              │
│  Backend Head → API Agent:                                                  │
│  ├── Task: "Create Authentication Endpoints"                                │
│  ├── Specs: JWT tokens, password hashing, rate limiting                     │
│  └── Deadline: 3 days                                                       │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 4: Workers Execute & Submit                                           │
│  ═══════════════════════════════════                                        │
│                                                                              │
│  React Agent:                                                               │
│  ├── Implements LoginPage.tsx with hooks and validation                     │
│  ├── Creates unit tests (100% coverage)                                     │
│  ├── Self-validates and fixes issues                                        │
│  └── Submits to Frontend Head                                               │
│                                                                              │
│  API Agent:                                                                 │
│  ├── Implements auth.routes.ts with JWT                                     │
│  ├── Creates integration tests                                              │
│  ├── Self-validates API responses                                           │
│  └── Submits to Backend Head                                                │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 5: Department Heads Review & Report                                   │
│  ═══════════════════════════════════                                        │
│                                                                              │
│  Frontend Head Review:                                                      │
│  ├── Reviews LoginPage.tsx code quality                                     │
│  ├── Checks compliance with design system                                   │
│  ├── Approves with minor feedback                                           │
│  └── Reports to CTO: "Frontend M1 on track"                                 │
│                                                                              │
│  Backend Head Review:                                                       │
│  ├── Reviews auth API security                                              │
│  ├── Tests JWT implementation                                               │
│  ├── Approves after one fix iteration                                       │
│  └── Reports to CTO: "Backend M1 complete"                                  │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 6: CTO Final Approval & Delivery                                      │
│  ═══════════════════════════════════                                        │
│                                                                              │
│  CTO Review:                                                                │
│  ├── Reviews all department reports                                         │
│  ├── Validates milestone completion                                         │
│  ├── Approves M1 deliverables                                               │
│  └── Reports to User: "Milestone 1 complete - Auth system ready"            │
│                                                                              │
│  Process continues for M2, M3, M4...                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 ตัวอย่างการใช้งานผ่าน Kimi CLI

```bash
# เริ่มต้นโครงการใหม่
kimi mcp hierarchical-agents create_project \
  --name "inventory-system" \
  --description "ระบบจัดการสต็อกสินค้า" \
  --tech-stack "react,nodejs,postgresql"

# CTO มอบหมายงานให้แผนก
kimi mcp cto-agent assign_to_department \
  --project-id "inventory-system" \
  --department "frontend" \
  --task "Create React UI" \
  --priority "HIGH"

# ตรวจสอบสถานะโครงการ
kimi mcp cto-agent get_project_status \
  --project-id "inventory-system"

# Frontend Head มอบหมายงานย่อย
kimi mcp frontend-manager assign_to_worker \
  --worker "react-agent" \
  --task "Create Login Page" \
  --specs "login-specs.md"

# Worker ส่งงาน
kimi mcp react-agent submit_task \
  --task-id "TASK-001" \
  --files "LoginPage.tsx,LoginPage.test.tsx" \
  --test-report "test-report.json"

# Frontend Head ตรวจสอบและรายงาน
kimi mcp frontend-manager review_code \
  --submission-id "SUB-001" \
  --action "APPROVE"

kimi mcp frontend-manager report_progress \
  --to "cto-agent" \
  --message "M1 Frontend complete"
```

---

## 📁 ไฟล์ที่สร้างทั้งหมด

| ไฟล์ | รายละเอียด |
|------|-----------|
| `MCP_Hierarchical_Agents_Requirements.md` | Requirements Specification |
| `mcp_agents_organization_design.md` | Organization Design |
| `hierarchical_agent_workflow_design.md` | Workflow & State Management |
| `kimi-cli-hierarchical-mcp-integration-guide.md` | Integration Guide |
| `MCP_HIERARCHICAL_AGENTS_COMPLETE_DESIGN.md` | **เอกสารสรุปฉบับสมบูรณ์** |

---

## 🎯 สรุป

ระบบ MCP Hierarchical Agents นี้ออกแบบตามโครงสร้างบริษัทเทคโนโลยีจริง ประกอบด้วย:

1. **CTO Agent** - กำหนดทิศทางและจ่ายงาน
2. **Department Heads** - 5 แผนก (Frontend, Backend, DevOps, QA, PM)
3. **Worker Agents** - 20 Agents เฉพาะทาง

**จุดเด่น:**
- ✅ โครงสร้างลำดับชั้นชัดเจน
- ✅ Quality Gates 4 ระดับ
- ✅ State Machine ครอบคลุม
- ✅ Communication Protocol มาตรฐาน
- ✅ พร้อมใช้งานกับ Kimi CLI

**ขั้นตอนถัดไป:**
1. ติดตั้ง dependencies ตาม Installation Guide
2. ตั้งค่า environment variables
3. สร้าง MCP configuration
4. เริ่มต้น MCP Servers
5. ทดสอบด้วยตัวอย่าง workflow

---

*สร้างเมื่อ: 2026-04-09*
*Version: 1.0*
