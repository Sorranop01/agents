# Hierarchical Agent Workflow Design

## สรุปผลงาน (Deliverables)

เอกสารชุดนี้ประกอบด้วยการออกแบบ Workflow และ State Management สำหรับ Hierarchical Agents ที่มีโครงสร้างเป็นลำดับชั้นเหมือนบริษัทเทคโนโลยี

---

## 📁 ไฟล์ที่สร้าง (Generated Files)

| ไฟล์ | คำอธิบาย |
|------|----------|
| `hierarchical_agent_workflow_design.md` | เอกสารออกแบบ Workflow ฉบับสมบูรณ์ |
| `workflow_implementation.py` | Python Implementation สำหรับนำไปใช้งาน |
| `workflow_summary_for_orchestrator.md` | สรุปสำหรับ Orchestrator Integration |
| `state_diagrams.mmd` | Mermaid Diagrams สำหรับ Visual Representation |
| `README.md` | ไฟล์นี้ |

---

## 🏗️ สถาปัตยกรรมระบบ (System Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    HIERARCHICAL STRUCTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Level 1: CTO (Chief Technology Officer)                     │
│  ├── กำหนดทิศทางกลยุทธ์ (Strategic Planning)                 │
│  ├── สร้าง Epic Tasks                                        │
│  ├── จ่ายงานให้ Department Heads                             │
│  └── อนุมัติและรายงานผลสุดท้าย                               │
│                                                              │
│  Level 2: Department Heads (หัวหน้าแผนก)                     │
│  ├── ตรวจสอบความถูกต้องของงาน (Validation)                  │
│  ├── แยกงานออกเป็นส่วนย่อย (Decomposition)                   │
│  ├── จ่ายงานให้ Workers                                      │
│  ├── ตรวจสอบคุณภาพ (Quality Review)                          │
│  └── รายงานผลให้ CTO                                         │
│                                                              │
│  Level 3: Workers (ผู้ปฏิบัติงาน)                             │
│  ├── วิเคราะห์ความต้องการ                                     │
│  ├── วางแผนการทำงาน                                          │
│  ├── ดำเนินการตามงานที่ได้รับ                                 │
│  ├── ตรวจสอบความถูกต้องด้วยตนเอง                            │
│  └── ส่งมอบงานเพื่อตรวจสอบ                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Machine (สถานะของงาน)

### สถานะทั้งหมด (14 States)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  DRAFT  │───▶│ PENDING │───▶│ASSIGNED │───▶│IN_PROG  │
└─────────┘    └─────────┘    └─────────┘    └────┬────┘
     ▲                                              │
     │                                         ┌────┴────┐
     │                                         │ BLOCKED │
     │                                         └────┬────┘
     │                                              │
     │                                         ┌────┴────┐
     │                                         │REVIEWING│
     │                                         └────┬────┘
     │                                         ┌────┴────┐
     │                                    ┌────┤ APPROVED│
     │                                    │    └────┬────┘
     │                                    │    ┌────┴────┐
     │                                    │    │REJECTED │
     │                                    │    └────┬────┘
     │                                    │    ┌────┴────┐
     │                                    └───▶│COMPLETED│
     │                                         └────┬────┘
     │                                         ┌────┴────┐
     └─────────────────────────────────────────│ CLOSED  │
                                               └────┬────┘
                                               ┌────┴────┐
                                               │ARCHIVED │
                                               └─────────┘
```

### การเปลี่ยนสถานะที่สำคัญ

| จากสถานะ | ถึงสถานะ | การกระทำ |
|----------|----------|----------|
| DRAFT | PENDING | ส่งงาน |
| PENDING | ASSIGNED | มอบหมายงาน |
| ASSIGNED | IN_PROGRESS | เริ่มทำงาน |
| IN_PROGRESS | REVIEWING | ส่งตรวจสอบ |
| REVIEWING | APPROVED | อนุมัติ |
| REVIEWING | REJECTED | ตีกลับ |
| APPROVED | CLOSED | ปิดงาน |

---

## 📋 Workflow แต่ละระดับ

### CTO Level Workflow

```
1. รับ Business Goals
2. วิเคราะห์เป้าหมายและความต้องการ
3. สร้าง Epic Tasks
4. จัดลำดับความสำคัญและกำหนดเวลา
5. มอบหมายให้ Department Heads
6. ติดตามความคืบหน้า
7. จัดการปัญหาที่เกิดขึ้น
8. รายงานผลให้ Stakeholders
```

### Department Head Level Workflow

```
1. รับงานจาก CTO
2. ตรวจสอบความถูกต้องของความต้องการ
3. แยกงานออกเป็นส่วนย่อย (Subtasks)
4. ประเมินและวางแผนทรัพยากร
5. มอบหมายให้ Workers
6. ติดตามความคืบหน้า
7. ตรวจสอบคุณภาพงานที่เสร็จสิ้น
8. รายงานผลรวมให้ CTO
```

### Worker Level Workflow

```
1. รับงานที่มอบหมาย
2. วิเคราะห์ความต้องการ
3. วางแผนการดำเนินงาน
4. ดำเนินการตามแผน (พร้อม Progress Updates)
5. ตรวจสอบความถูกต้องด้วยตนเอง
6. ส่งมอบงานเพื่อตรวจสอบ
```

---

## ✅ Quality Gates (ประตูตรวจสอบคุณภาพ)

### Gate 1: Requirements Validation
- มี Acceptance Criteria ที่ชัดเจน
- ระบุ Dependencies ที่จำเป็น
- จัดสรรทรัพยากรเรียบร้อย
- กำหนดเวลาที่เหมาะสม

### Gate 2: Worker Self-Validation
- ผ่าน Acceptance Criteria ทั้งหมด
- Unit Tests ผ่าน
- เอกสารครบถ้วน
- ไม่มีข้อผิดพลาดร้ายแรง

### Gate 3: Department Head Review
- คุณภาพงานตามมาตรฐาน
- ความต้องการครบถ้วน
- การทดสอบเพียงพอ
- เอกสารผ่านการตรวจสอบ

**เกณฑ์การให้คะแนน:**
- 0.90-1.00: APPROVE → รายงาน CTO
- 0.70-0.89: CONDITIONAL → แก้ไขเล็กน้อย
- 0.00-0.69: REJECT → ส่งกลับแก้ไข

### Gate 4: CTO Final Approval
- Subtasks ทั้งหมดเสร็จสิ้น
- ตัวชี้วัดคุณภาพตามเป้าหมาย
- Integration สำเร็จ
- บรรลุวัตถุประสงค์ทางธุรกิจ

---

## ⚠️ Error Handling & Retry Mechanism

### ประเภทข้อผิดพลาด

| ประเภท | จำนวน Retry | การดำเนินการ |
|--------|-------------|--------------|
| RECOVERABLE | 3 | Exponential backoff retry |
| VALIDATION_ERROR | 1 | ส่งกลับให้ผู้มอบหมาย |
| EXECUTION_ERROR | 2 | Escalate หากล้มเหลว |
| CRITICAL_ERROR | 0 | Escalate ทันที |

### Retry Configuration

```python
{
    "initial_delay": 5,      # วินาที
    "max_delay": 300,        # วินาที
    "backoff": "exponential", # 2^n
    "jitter": True           # สุ่มค่า ±50%
}
```

---

## 🔌 Integration Points

### สำหรับ Orchestrator

```python
# 1. สร้างงานใหม่
task = orchestrator.create_task(
    title="Task Name",
    description="Task Description",
    creator_id="AGENT-CTO-001",
    priority=Priority.HIGH
)

# 2. เปลี่ยนสถานะงาน
orchestrator.state_manager.transition(
    task, 
    TaskStatus.IN_PROGRESS,
    reason="Start working",
    actor_id="AGENT-DEV-001"
)

# 3. มอบหมายงาน
orchestrator.assign_task(
    task,
    from_agent_id="AGENT-TL-001",
    to_agent_id="AGENT-DEV-001"
)

# 4. ตรวจสอบคุณภาพ
result = orchestrator.review_task(task, reviewer_id="AGENT-TL-001")

# 5. จัดการข้อผิดพลาด
orchestrator.error_handler.handle_error(
    error_context,
    task,
    agent
)

# 6. ตรวจสอบสถานะ
summary = orchestrator.get_task_status_summary()
```

---

## 📊 Key Metrics

| Metric | Threshold | Description |
|--------|-----------|-------------|
| Quality Score | ≥0.90 | สำหรับ Department Head |
| Worker Quality | ≥0.80 | สำหรับ Self-validation |
| CTO Quality | ≥0.85 | สำหรับ Final approval |
| Max Retries | 3 | สำหรับ Recoverable errors |
| Timeout | 24-48h | ตามระดับ Agent |

---

## 🚀 Quick Start

```python
from workflow_implementation import *

# สร้าง Orchestrator
orchestrator = WorkflowOrchestrator()

# สร้าง Agents
cto = Agent(id="CTO-001", name="CTO", level=AgentLevel.CTO, department="EXEC")
tech_lead = Agent(id="TL-001", name="Tech Lead", level=AgentLevel.DEPARTMENT_HEAD, 
                  department="ENG", supervisor_id="CTO-001")
developer = Agent(id="DEV-001", name="Developer", level=AgentLevel.WORKER,
                  department="ENG", supervisor_id="TL-001")

# ลงทะเบียน Agents
orchestrator.delegation_manager.register_agent(cto)
orchestrator.delegation_manager.register_agent(tech_lead)
orchestrator.delegation_manager.register_agent(developer)

# สร้างและดำเนินการงาน
task = orchestrator.create_task(
    title="Implement Feature",
    description="Build new feature",
    creator_id=cto.id
)

orchestrator.submit_task(task, cto.id)
orchestrator.assign_task(task, cto.id, tech_lead.id)
orchestrator.assign_task(task, tech_lead.id, developer.id)
orchestrator.start_task(task, developer.id)
# ... continue workflow
```

---

## 📚 References

- `hierarchical_agent_workflow_design.md` - รายละเอียดเต็ม
- `workflow_implementation.py` - โค้ด Python
- `workflow_summary_for_orchestrator.md` - สรุปสำหรับ Orchestrator
- `state_diagrams.mmd` - Mermaid Diagrams

---

*Generated by Workflow Engineer*
*Version 1.0*
