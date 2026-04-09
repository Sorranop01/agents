# Agent Sandbox with Working Memory
## ระบบ Sandbox และ Working Memory สำหรับ Agents (ตามบทความ 1.1.6)

---

## 1. ภาพรวมระบบ

### 1.1 แนวคิดหลักจากบทความ

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENT SANDBOX WITH WORKING MEMORY                         │
│                    (ตามบทความ 1.1.6 อัพเดท)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PROBLEM: Agent พึ่งพา Context Window ของโมเดลอย่างเดียว                    │
│  → เกิด Hallucination สะสม                                                  │
│  → ขาดการตรวจสอบย้อนกลับ                                                    │
│  → ผลลัพธ์ไม่คงที                                                           │
│                                                                              │
│  SOLUTION: ระบบ Working Memory ที่ Agent จดบันทึกระหว่างทำงาน               │
│  → แยก Facts จาก Hypotheses                                                 │
│  → Checkpoint Reread ทุก 4 Turns                                             │
│  → Stream Draft แบบ Real-time                                               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SANDBOX ARCHITECTURE                              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │   │
│  │  │   AGENT      │    │   WORKING    │    │   OUTPUT     │          │   │
│  │  │   EXECUTION  │◀──▶│   MEMORY     │───▶│   STREAM     │          │   │
│  │  │              │    │   SYSTEM     │    │   DASHBOARD  │          │   │
│  │  └──────────────┘    └──────────────┘    └──────────────┘          │   │
│  │         │                   │                   │                  │   │
│  │         │                   │                   │                  │   │
│  │         ▼                   ▼                   ▼                  │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    FILE SYSTEM                               │   │   │
│  │  │  • ANALYSIS_RESULT_DRAFT.md  (Working Memory)               │   │   │
│  │  │  • CHECKPOINT_STATE.json     (Checkpoint Data)              │   │   │
│  │  │  • BLUEPRINT_PROMPT.md       (Final Output)                 │   │   │
│  │  │  • FACTS_LOG.json            (Verified Facts)               │   │   │
│  │  │  • HYPOTHESES_LOG.json       (Pending Hypotheses)           │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Working Memory System

### 2.1 โครงสร้าง Working Memory

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WORKING MEMORY STRUCTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ANALYSIS_RESULT_DRAFT.md                                            │   │
│  │  ════════════════════════                                            │   │
│  │                                                                      │   │
│  │  ไฟล์ Working Memory ที่ Agent จดบันทึกระหว่างทำงาน                   │   │
│  │  แต่ละ Section แยกข้อเท็จจริงที่มีหลักฐาน (Facts)                     │   │
│  │  ออกจากข้อสันนิษฐาน (Hypotheses)                                      │   │
│  │                                                                      │   │
│  │  Structure:                                                          │   │
│  │  ```markdown                                                         │   │
│  │  # Analysis Result Draft                                             │   │
│  │  Session: <session_id>                                               │   │
│  │  Started: <timestamp>                                                │   │
│  │  Last Updated: <timestamp>                                           │   │
│  │  Turn: <current_turn>/<max_turns>                                    │   │
│  │                                                                      │   │
│  │  ## 1. Verified Facts (มีหลักฐานยืนยัน)                              │   │
│  │  | Fact | Evidence | Confidence | Source |                           │   │
│  │  |-------|----------|------------|--------|                           │   │
│  │  | ... | ... | ... | ... |                                          │   │
│  │                                                                      │   │
│  │  ## 2. Working Hypotheses (ข้อสันนิษฐานที่กำลังตรวจสอบ)              │   │
│  │  | Hypothesis | Test Method | Status | Confidence |                   │   │
│  │  |-------------|---------------|--------|------------|                 │   │
│  │  | ... | ... | pending | ... |                                       │   │
│  │                                                                      │   │
│  │  ## 3. Analysis Log (บันทึกการวิเคราะห์แต่ละ Turn)                    │   │
│  │  ### Turn 1                                                          │   │
│  │  - Action: ...                                                       │   │
│  │  - Finding: ...                                                      │   │
│  │  - Confidence: ...                                                   │   │
│  │                                                                      │   │
│  │  ### Turn 2                                                          │   │
│  │  - Action: ...                                                       │   │
│  │  - Finding: ...                                                      │   │
│  │  - Verification: ...                                                 │   │
│  │                                                                      │   │
│  │  ## 4. Open Questions (คำถามที่ยังไม่ได้คำตอบ)                        │   │
│  │  - [ ] Question 1                                                    │   │
│  │  - [ ] Question 2                                                    │   │
│  │                                                                      │   │
│  │  ## 5. Next Actions (สิ่งที่ต้องทำต่อ)                                │   │
│  │  1. ...                                                              │   │
│  │  2. ...                                                              │   │
│  │  ```                                                                 │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CHECKPOINT_STATE.json                                               │   │
│  │  ═════════════════════                                               │   │
│  │                                                                      │   │
│  │  เก็บสถานะล่าสุดของการวิเคราะห์สำหรับการกลับมาทำต่อ                   │   │
│  │                                                                      │   │
│  │  ```json                                                             │   │
│  │  {                                                                   │   │
│  │    "session_id": "sess-2024-001",                                    │   │
│  │    "current_turn": 5,                                                │   │
│  │    "checkpoint_turns": [1, 4],                                       │   │
│  │    "facts_count": 12,                                                │   │
│  │    "hypotheses_count": 5,                                            │   │
│  │    "verified_facts": ["fact-1", "fact-2", ...],                      │   │
│  │    "pending_hypotheses": ["hyp-1", "hyp-2", ...],                    │   │
│  │    "last_checkpoint_at": "2024-01-15T10:30:00Z",                     │   │
│  │    "context_window_usage": 0.65,                                     │   │
│  │    "confidence_trend": "increasing",                                 │   │
│  │    "flags": {                                                        │   │
│  │      "needs_verification": true,                                     │   │
│  │      "hallucination_detected": false,                                │   │
│  │      "ready_for_blueprint": false                                    │   │
│  │    }                                                                 │   │
│  │  }                                                                   │   │
│  │  ```                                                                 │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BLUEPRINT_PROMPT.md                                                 │   │
│  │  ═══════════════════                                                 │   │
│  │                                                                      │   │
│  │  ผลลัพธ์ปลายทางที่ Agent จะ Rewrite Draft ให้เป็น                      │   │
│  │  Technical Specification ที่ครอบคลุม                                   │   │
│  │  พร้อมส่งต่อให้ Coder AI โดยตรง                                      │   │
│  │                                                                      │   │
│  │  Structure:                                                          │   │
│  │  ```markdown                                                         │   │
│  │  # Technical Specification                                           │   │
│  │  Generated from: ANALYSIS_RESULT_DRAFT.md                            │   │
│  │  Session: <session_id>                                               │   │
│  │  Confidence Score: <score>                                           │   │
│  │                                                                      │   │
│  │  ## 1. Overview                                                      │   │
│  │  Summary of what needs to be built                                   │   │
│  │                                                                      │   │
│  │  ## 2. Data Structures                                               │   │
│  │  ```typescript                                                       │   │
│  │  // Type definitions based on verified facts                         │   │
│  │  ```                                                                 │   │
│  │                                                                      │   │
│  │  ## 3. Business Logic                                                │   │
│  │  - Rule 1 (verified)                                                 │   │
│  │  - Rule 2 (verified)                                                 │   │
│  │                                                                      │   │
│  │  ## 4. Module Relationships                                          │   │
│  │  ```mermaid                                                          │   │
│  │  graph TD                                                            │   │
│  │    A[Module A] --> B[Module B]                                       │   │
│  │  ```                                                                 │   │
│  │                                                                      │   │
│  │  ## 5. Implementation Notes                                          │   │
│  │  - Verified facts only                                               │   │
│  │  - Assumptions that need validation                                  │   │
│  │  ```                                                                 │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Checkpoint Reread System

### 3.1 Checkpoint Mechanism

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHECKPOINT REREAD SYSTEM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONCEPT: ทุก 4 Turns Agent จะอ่าน Draft ย้อนกลับ                          │
│  เพื่อตรวจสอบช่องโหว่และกำหนดสิ่งที่ต้องวิเคราะห์ต่อ                       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CHECKPOINT FLOW                                   │   │
│  │                                                                      │   │
│  │  Turn 1    Turn 2    Turn 3    Turn 4    [CHECKPOINT]              │   │
│  │     │         │         │         │          │                      │   │
│  │     ▼         ▼         ▼         ▼          ▼                      │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   ┌───────────┐              │   │
│  │  │Analyze│  │Analyze│  │Analyze│  │Analyze│   │  REREAD   │              │   │
│  │  │  +   │  │  +   │  │  +   │  │  +   │   │   DRAFT   │              │   │
│  │  │Write │  │Write │  │Write │  │Write │   │           │              │   │
│  │  │ Draft│  │ Draft│  │ Draft│  │ Draft│   │ • Review  │              │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘   │   facts     │              │   │
│  │                                         │ • Identify  │              │   │
│  │                                         │   gaps      │              │   │
│  │                                         │ • Check for │              │   │
│  │                                         │   hallucinat│              │   │
│  │                                         │ • Update    │              │   │
│  │                                         │   confidence│              │   │
│  │                                         │ • Plan next │              │   │
│  │                                         │   actions   │              │   │
│  │                                         └──────┬──────┘              │   │
│  │                                                │                      │   │
│  │                                                ▼                      │   │
│  │                                         ┌───────────┐              │   │
│  │                                         │  Turn 5   │              │   │
│  │                                         │ (continue)│              │   │
│  │                                         └───────────┘              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  CHECKPOINT ACTIONS:                                                         │
│  ═══════════════════                                                         │
│                                                                              │
│  1. FACT VERIFICATION                                                        │
│     • ตรวจสอบว่า Facts ยังถูกต้องตามหลักฐาน                                │
│     • ย้าย Hypotheses ที่ยืนยันแล้วไป Facts                                 │
│     • ลบ Facts ที่ไม่มีหลักฐานสนับสนุน                                       │
│                                                                              │
│  2. HALLUCINATION DETECTION                                                  │
│     • ตรวจหาข้อมูลที่ไม่มีแหล่งที่มา                                        │
│     • ตรวจหาความขัดแย้งภายใน                                                │
│     • ตรวจหาข้อมูลที่ฟังดูน่าสงสัย                                          │
│                                                                              │
│  3. GAP ANALYSIS                                                             │
│     • ระบุคำถามที่ยังไม่ได้คำตอบ                                            │
│     • ระบุ Facts ที่ยังไม่สมบูรณ์                                            │
│     • วางแผนการวิเคราะห์ต่อไป                                               │
│                                                                              │
│  4. CONFIDENCE UPDATE                                                        │
│     • คำนวณ Confidence Score ใหม่                                           │
│     • ปรับระดับความเชื่อมั่นตามหลักฐาน                                     │
│     • ตัดสินใจว่าพร้อมสร้าง Blueprint หรือยัง                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Checkpoint Implementation

```typescript
// ==================== CHECKPOINT REREAD SYSTEM ====================

interface CheckpointConfig {
  checkpoint_interval: number; // ทุกกี่ turns (default: 4)
  min_facts_before_blueprint: number; // ต้องมีกี่ facts (default: 5)
  min_confidence_threshold: number; // ความมั่นใจขั้นต่ำ (default: 0.8)
  max_turns: number; // จำนวน turns สูงสุด (default: 20)
}

class CheckpointRereadSystem {
  private config: CheckpointConfig;
  private draftManager: DraftManager;
  private factVerifier: FactVerifier;
  private hallucinationDetector: HallucinationDetector;
  
  constructor(config: Partial<CheckpointConfig> = {}) {
    this.config = {
      checkpoint_interval: 4,
      min_facts_before_blueprint: 5,
      min_confidence_threshold: 0.8,
      max_turns: 20,
      ...config
    };
    
    this.draftManager = new DraftManager();
    this.factVerifier = new FactVerifier();
    this.hallucinationDetector = new HallucinationDetector();
  }
  
  // Main execution loop with checkpoints
  async executeWithCheckpoints(
    task: AnalysisTask,
    maxTurns: number = this.config.max_turns
  ): Promise<BlueprintResult> {
    const sessionId = generateUUID();
    let currentTurn = 0;
    
    // Initialize draft
    await this.draftManager.initializeDraft(sessionId, task);
    
    while (currentTurn < maxTurns) {
      currentTurn++;
      
      console.log(`[CheckpointSystem] Turn ${currentTurn}/${maxTurns}`);
      
      // Execute analysis turn
      const turnResult = await this.executeTurn(sessionId, currentTurn, task);
      
      // Update draft
      await this.draftManager.appendTurn(sessionId, currentTurn, turnResult);
      
      // Check if checkpoint needed
      if (currentTurn % this.config.checkpoint_interval === 0) {
        console.log(`[CheckpointSystem] Checkpoint at turn ${currentTurn}`);
        
        const checkpointResult = await this.runCheckpoint(sessionId);
        
        // Update checkpoint state
        await this.draftManager.updateCheckpointState(sessionId, {
          checkpoint_turns: [...(await this.draftManager.getCheckpointTurns(sessionId)), currentTurn],
          last_checkpoint_at: new Date().toISOString()
        });
        
        // Check if ready for blueprint
        if (checkpointResult.ready_for_blueprint) {
          console.log(`[CheckpointSystem] Ready for blueprint generation`);
          return await this.generateBlueprint(sessionId);
        }
        
        // Check if should continue
        if (!checkpointResult.should_continue) {
          console.log(`[CheckpointSystem] Stopping: ${checkpointResult.stop_reason}`);
          break;
        }
      }
    }
    
    // Generate blueprint with current state
    return await this.generateBlueprint(sessionId);
  }
  
  // Execute single analysis turn
  private async executeTurn(
    sessionId: string,
    turn: number,
    task: AnalysisTask
  ): Promise<TurnResult> {
    // Read current draft
    const draft = await this.draftManager.readDraft(sessionId);
    
    // Determine next action based on draft state
    const nextAction = this.determineNextAction(draft);
    
    // Execute action
    const actionResult = await this.executeAction(nextAction, task);
    
    // Classify findings
    const findings = this.classifyFindings(actionResult.findings);
    
    return {
      turn,
      action: nextAction,
      findings,
      new_facts: findings.filter(f => f.type === 'fact'),
      new_hypotheses: findings.filter(f => f.type === 'hypothesis'),
      confidence: actionResult.confidence,
      timestamp: new Date()
    };
  }
  
  // Run checkpoint review
  private async runCheckpoint(sessionId: string): Promise<CheckpointResult> {
    console.log(`[Checkpoint] Running checkpoint review...`);
    
    const draft = await this.draftManager.readDraft(sessionId);
    const checkpoint: CheckpointResult = {
      verified_facts: [],
      rejected_facts: [],
      confirmed_hypotheses: [],
      rejected_hypotheses: [],
      gaps_identified: [],
      hallucinations_found: [],
      confidence_score: 0,
      ready_for_blueprint: false,
      should_continue: true,
      stop_reason: null,
      next_actions: []
    };
    
    // 1. Verify all facts
    console.log(`[Checkpoint] Verifying ${draft.facts.length} facts...`);
    for (const fact of draft.facts) {
      const verification = await this.factVerifier.verify(fact);
      if (verification.valid) {
        checkpoint.verified_facts.push(fact);
      } else {
        checkpoint.rejected_facts.push({
          ...fact,
          rejection_reason: verification.reason
        });
      }
    }
    
    // 2. Check hypotheses
    console.log(`[Checkpoint] Checking ${draft.hypotheses.length} hypotheses...`);
    for (const hypothesis of draft.hypotheses) {
      const check = await this.checkHypothesis(hypothesis, draft);
      if (check.confirmed) {
        checkpoint.confirmed_hypotheses.push({
          ...hypothesis,
          confidence: check.confidence
        });
      } else if (check.rejected) {
        checkpoint.rejected_hypotheses.push({
          ...hypothesis,
          rejection_reason: check.reason
        });
      }
    }
    
    // 3. Detect hallucinations
    console.log(`[Checkpoint] Detecting hallucinations...`);
    checkpoint.hallucinations_found = await this.hallucinationDetector.detect(draft);
    
    // 4. Identify gaps
    console.log(`[Checkpoint] Identifying gaps...`);
    checkpoint.gaps_identified = this.identifyGaps(draft);
    
    // 5. Calculate confidence
    checkpoint.confidence_score = this.calculateConfidenceScore(
      checkpoint.verified_facts.length,
      draft.hypotheses.length - checkpoint.confirmed_hypotheses.length,
      checkpoint.hallucinations_found.length
    );
    
    // 6. Determine next steps
    checkpoint.ready_for_blueprint = this.checkReadyForBlueprint(checkpoint);
    checkpoint.should_continue = !checkpoint.ready_for_blueprint && 
                                  checkpoint.gaps_identified.length > 0;
    
    if (!checkpoint.should_continue && !checkpoint.ready_for_blueprint) {
      checkpoint.stop_reason = 'No clear path forward';
    }
    
    checkpoint.next_actions = this.planNextActions(checkpoint);
    
    // Update draft with checkpoint results
    await this.draftManager.updateWithCheckpoint(sessionId, checkpoint);
    
    console.log(`[Checkpoint] Completed. Confidence: ${checkpoint.confidence_score.toFixed(2)}`);
    console.log(`[Checkpoint] Verified facts: ${checkpoint.verified_facts.length}`);
    console.log(`[Checkpoint] Gaps: ${checkpoint.gaps_identified.length}`);
    console.log(`[Checkpoint] Ready for blueprint: ${checkpoint.ready_for_blueprint}`);
    
    return checkpoint;
  }
  
  // Generate blueprint from draft
  private async generateBlueprint(sessionId: string): Promise<BlueprintResult> {
    console.log(`[Blueprint] Generating blueprint...`);
    
    const draft = await this.draftManager.readDraft(sessionId);
    
    // Only use verified facts
    const verifiedFacts = draft.facts.filter(f => f.verified);
    
    const blueprint: BlueprintResult = {
      session_id: sessionId,
      generated_at: new Date(),
      confidence_score: this.calculateConfidenceScore(
        verifiedFacts.length,
        draft.hypotheses.filter(h => !h.confirmed).length,
        0
      ),
      specification: {
        overview: this.generateOverview(draft),
        data_structures: this.generateDataStructures(verifiedFacts),
        business_logic: this.generateBusinessLogic(verifiedFacts),
        module_relationships: this.generateModuleRelationships(verifiedFacts),
        implementation_notes: this.generateImplementationNotes(draft)
      },
      source_facts: verifiedFacts,
      assumptions: draft.hypotheses.filter(h => !h.confirmed).map(h => ({
        hypothesis: h.statement,
        confidence: h.confidence,
        needs_validation: true
      }))
    };
    
    // Write blueprint file
    await this.draftManager.writeBlueprint(sessionId, blueprint);
    
    console.log(`[Blueprint] Generated with ${verifiedFacts.length} verified facts`);
    console.log(`[Blueprint] Confidence: ${blueprint.confidence_score.toFixed(2)}`);
    
    return blueprint;
  }
  
  // Helper methods
  private determineNextAction(draft: Draft): Action {
    // Logic to determine what to do next
    if (draft.hypotheses.length === 0) {
      return { type: 'explore', target: 'initial_analysis' };
    }
    
    const unverifiedHypotheses = draft.hypotheses.filter(h => !h.verified);
    if (unverifiedHypotheses.length > 0) {
      return { 
        type: 'verify', 
        target: unverifiedHypotheses[0].id 
      };
    }
    
    return { type: 'explore', target: 'deeper_analysis' };
  }
  
  private classifyFindings(rawFindings: RawFinding[]): ClassifiedFinding[] {
    return rawFindings.map(f => ({
      ...f,
      type: f.evidence ? 'fact' : 'hypothesis',
      confidence: f.confidence || 0.5,
      needs_verification: !f.evidence
    }));
  }
  
  private async checkHypothesis(
    hypothesis: Hypothesis, 
    draft: Draft
  ): Promise<HypothesisCheck> {
    // Logic to check if hypothesis is confirmed or rejected
    // This could involve searching for evidence, running tests, etc.
    return {
      confirmed: false,
      rejected: false,
      confidence: hypothesis.confidence
    };
  }
  
  private identifyGaps(draft: Draft): Gap[] {
    const gaps: Gap[] = [];
    
    // Check for missing information
    if (draft.facts.length < this.config.min_facts_before_blueprint) {
      gaps.push({
        type: 'insufficient_facts',
        description: `Only ${draft.facts.length} facts collected, need at least ${this.config.min_facts_before_blueprint}`,
        priority: 'high'
      });
    }
    
    // Check for unverified critical hypotheses
    const criticalHypotheses = draft.hypotheses.filter(h => h.critical && !h.verified);
    if (criticalHypotheses.length > 0) {
      gaps.push({
        type: 'unverified_critical_hypotheses',
        description: `${criticalHypotheses.length} critical hypotheses need verification`,
        priority: 'high',
        items: criticalHypotheses
      });
    }
    
    return gaps;
  }
  
  private calculateConfidenceScore(
    verifiedFacts: number,
    pendingHypotheses: number,
    hallucinations: number
  ): number {
    const factScore = Math.min(1, verifiedFacts / this.config.min_facts_before_blueprint);
    const hypothesisPenalty = Math.min(0.5, pendingHypotheses * 0.1);
    const hallucinationPenalty = Math.min(0.5, hallucinations * 0.2);
    
    return Math.max(0, factScore - hypothesisPenalty - hallucinationPenalty);
  }
  
  private checkReadyForBlueprint(checkpoint: CheckpointResult): boolean {
    return checkpoint.confidence_score >= this.config.min_confidence_threshold &&
           checkpoint.verified_facts.length >= this.config.min_facts_before_blueprint &&
           checkpoint.gaps_identified.length === 0;
  }
  
  private planNextActions(checkpoint: CheckpointResult): Action[] {
    const actions: Action[] = [];
    
    if (checkpoint.gaps_identified.length > 0) {
      const highestPriorityGap = checkpoint.gaps_identified
        .sort((a, b) => this.priorityWeight(b.priority) - this.priorityWeight(a.priority))[0];
      
      actions.push({
        type: 'address_gap',
        target: highestPriorityGap.type,
        description: highestPriorityGap.description
      });
    }
    
    if (checkpoint.hallucinations_found.length > 0) {
      actions.push({
        type: 'verify',
        target: 'hallucinated_content',
        description: `Verify ${checkpoint.hallucinations_found.length} potential hallucinations`
      });
    }
    
    return actions;
  }
  
  private priorityWeight(priority: string): number {
    const weights = { critical: 4, high: 3, medium: 2, low: 1 };
    return weights[priority] || 0;
  }
  
  // Blueprint generation helpers
  private generateOverview(draft: Draft): string {
    return `Analysis of ${draft.task_description}. ` +
           `Verified ${draft.facts.filter(f => f.verified).length} facts ` +
           `with ${(this.calculateConfidenceScore(draft.facts.length, 0, 0) * 100).toFixed(0)}% confidence.`;
  }
  
  private generateDataStructures(facts: Fact[]): DataStructure[] {
    // Extract type definitions from facts
    return facts
      .filter(f => f.category === 'data_structure')
      .map(f => ({
        name: f.name,
        type: f.data_type,
        fields: f.fields,
        source: f.evidence
      }));
  }
  
  private generateBusinessLogic(facts: Fact[]): BusinessRule[] {
    return facts
      .filter(f => f.category === 'business_rule')
      .map(f => ({
        rule: f.statement,
        condition: f.condition,
        action: f.action,
        source: f.evidence
      }));
  }
  
  private generateModuleRelationships(facts: Fact[]): ModuleRelationship[] {
    return facts
      .filter(f => f.category === 'relationship')
      .map(f => ({
        from: f.from_module,
        to: f.to_module,
        type: f.relationship_type,
        description: f.description
      }));
  }
  
  private generateImplementationNotes(draft: Draft): string[] {
    const notes: string[] = [];
    
    notes.push('Based on verified facts only');
    
    const unverifiedAssumptions = draft.hypotheses.filter(h => !h.confirmed);
    if (unverifiedAssumptions.length > 0) {
      notes.push(`Note: ${unverifiedAssumptions.length} assumptions need validation`);
    }
    
    return notes;
  }
}
```

---

## 4. Real-Time Draft Streaming

### 4.1 Stream Implementation

```typescript
// ==================== REAL-TIME DRAFT STREAMING ====================

interface StreamConfig {
  update_interval_ms: number; // อัปเดตทุกกี่ ms
  batch_size: number; // ส่งกี่รายการต่อครั้ง
  compression: boolean; // บีบอัดข้อมูล
}

class DraftStreamManager {
  private config: StreamConfig;
  private subscribers: Map<string, DraftSubscriber[]>;
  private updateQueue: Map<string, DraftUpdate[]>;
  
  constructor(config: Partial<StreamConfig> = {}) {
    this.config = {
      update_interval_ms: 500,
      batch_size: 10,
      compression: true,
      ...config
    };
    
    this.subscribers = new Map();
    this.updateQueue = new Map();
    
    // Start streaming loop
    this.startStreamingLoop();
  }
  
  // Subscribe to draft updates
  subscribe(
    sessionId: string, 
    subscriber: DraftSubscriber
  ): () => void {
    if (!this.subscribers.has(sessionId)) {
      this.subscribers.set(sessionId, []);
    }
    
    this.subscribers.get(sessionId)!.push(subscriber);
    
    // Send current state immediately
    this.sendCurrentState(sessionId, subscriber);
    
    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(sessionId);
      if (subs) {
        const index = subs.indexOf(subscriber);
        if (index > -1) {
          subs.splice(index, 1);
        }
      }
    };
  }
  
  // Queue an update
  queueUpdate(sessionId: string, update: DraftUpdate): void {
    if (!this.updateQueue.has(sessionId)) {
      this.updateQueue.set(sessionId, []);
    }
    
    this.updateQueue.get(sessionId)!.push({
      ...update,
      timestamp: new Date()
    });
  }
  
  // Start streaming loop
  private startStreamingLoop(): void {
    setInterval(() => {
      this.processUpdates();
    }, this.config.update_interval_ms);
  }
  
  // Process queued updates
  private async processUpdates(): Promise<void> {
    for (const [sessionId, updates] of this.updateQueue.entries()) {
      if (updates.length === 0) continue;
      
      // Batch updates
      const batch = updates.splice(0, this.config.batch_size);
      
      // Compress if enabled
      const payload = this.config.compression 
        ? await this.compress(batch)
        : batch;
      
      // Send to subscribers
      const subscribers = this.subscribers.get(sessionId) || [];
      for (const subscriber of subscribers) {
        try {
          subscriber.onUpdate({
            session_id: sessionId,
            updates: payload,
            total_pending: updates.length
          });
        } catch (error) {
          console.error(`[DraftStream] Error sending to subscriber:`, error);
        }
      }
    }
  }
  
  // Send current state to new subscriber
  private async sendCurrentState(
    sessionId: string, 
    subscriber: DraftSubscriber
  ): Promise<void> {
    try {
      const draft = await this.loadDraft(sessionId);
      
      subscriber.onUpdate({
        session_id: sessionId,
        type: 'full_state',
        data: draft,
        timestamp: new Date()
      });
    } catch (error) {
      subscriber.onError?.(error);
    }
  }
  
  // Compress updates
  private async compress(updates: DraftUpdate[]): Promise<Buffer> {
    const json = JSON.stringify(updates);
    // Use zlib or similar for compression
    return Buffer.from(json); // Simplified
  }
  
  // Load draft (placeholder)
  private async loadDraft(sessionId: string): Promise<Draft> {
    // Implementation
    return {} as Draft;
  }
}

// TUI Dashboard Integration
class TUIDashboard {
  private streamManager: DraftStreamManager;
  private screen: any; // blessed screen or similar
  
  constructor(streamManager: DraftStreamManager) {
    this.streamManager = streamManager;
    this.setupScreen();
  }
  
  // Setup TUI screen
  private setupScreen(): void {
    // Using blessed or similar TUI library
    // Setup layout with:
    // - Facts panel
    // - Hypotheses panel
    // - Log panel
    // - Status bar
  }
  
  // Display draft for session
  displaySession(sessionId: string): void {
    const unsubscribe = this.streamManager.subscribe(sessionId, {
      onUpdate: (update) => {
        this.renderUpdate(update);
      },
      onError: (error) => {
        this.showError(error);
      }
    });
    
    // Store unsubscribe for cleanup
  }
  
  // Render update to screen
  private renderUpdate(update: StreamUpdate): void {
    if (update.type === 'full_state') {
      this.renderFullState(update.data);
    } else {
      this.renderIncrementalUpdate(update.updates);
    }
  }
  
  private renderFullState(draft: Draft): void {
    // Render complete draft
  }
  
  private renderIncrementalUpdate(updates: DraftUpdate[]): void {
    // Render only changes
    for (const update of updates) {
      switch (update.type) {
        case 'new_fact':
          this.addFactToDisplay(update.data);
          break;
        case 'new_hypothesis':
          this.addHypothesisToDisplay(update.data);
          break;
        case 'verified_fact':
          this.markFactAsVerified(update.data);
          break;
        case 'checkpoint':
          this.showCheckpoint(update.data);
          break;
      }
    }
  }
  
  private addFactToDisplay(fact: Fact): void {
    // Add to facts panel
  }
  
  private addHypothesisToDisplay(hypothesis: Hypothesis): void {
    // Add to hypotheses panel
  }
  
  private markFactAsVerified(fact: Fact): void {
    // Update fact display with verification mark
  }
  
  private showCheckpoint(data: CheckpointData): void {
    // Show checkpoint notification
  }
  
  private showError(error: Error): void {
    // Show error in status bar
  }
}

// Web Dashboard Integration
class WebDashboard {
  private streamManager: DraftStreamManager;
  private wss: WebSocketServer;
  
  constructor(streamManager: DraftStreamManager, port: number) {
    this.streamManager = streamManager;
    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();
  }
  
  private setupWebSocket(): void {
    this.wss.on('connection', (ws, req) => {
      const sessionId = this.extractSessionId(req);
      
      const unsubscribe = this.streamManager.subscribe(sessionId, {
        onUpdate: (update) => {
          ws.send(JSON.stringify(update));
        },
        onError: (error) => {
          ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
      });
      
      ws.on('close', () => {
        unsubscribe();
      });
    });
  }
  
  private extractSessionId(req: IncomingMessage): string {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    return url.searchParams.get('session') || 'default';
  }
}
```

---

## 5. Sandbox Environment

### 5.1 Sandbox Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENT SANDBOX ENVIRONMENT                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SANDBOX CONTAINER                                 │   │
│  │  (Isolated Environment for Agent Execution)                          │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Agent      │  │   Working    │  │   Tools      │              │   │
│  │  │   Process    │  │   Memory     │  │   & APIs    │              │   │
│  │  │              │  │   Files      │  │              │              │   │
│  │  │ • Analysis   │  │              │  │ • File R/W   │              │   │
│  │  │ • Reasoning  │  │ • Draft.md   │  │ • Web Search │              │   │
│  │  │ • Learning   │  │ • Checkpoint │  │ • Code Exec  │              │   │
│  │  │              │  │ • Blueprint  │  │ • LLM Calls  │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    RESOURCE LIMITS                           │   │   │
│  │  │  • CPU: 2 cores                                              │   │   │
│  │  │  • Memory: 4GB                                               │   │   │
│  │  │  • Disk: 10GB                                                │   │   │
│  │  │  • Network: Restricted (whitelist only)                      │   │   │
│  │  │  • Time: Max 30 minutes per session                          │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    │                                        │
│  ┌─────────────────────────────────┴─────────────────────────────────┐   │
│  │                    HOST SYSTEM                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Sandbox    │  │   Stream     │  │   Persistence│              │   │
│  │  │   Manager    │  │   Server     │  │   Layer      │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ • Spawn/Stop │  │ • TUI        │  │ • Database   │              │   │
│  │  │ • Monitor    │  │ • Web        │  │ • File Store │              │   │
│  │  │ • Resource   │  │   Dashboard  │  │ • Backup     │              │   │
│  │  │   Control    │  │              │  │              │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Summary

### 6.1 Key Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KEY FEATURES OF AGENT SANDBOX                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ Working Memory Files                                                     │
│     • ANALYSIS_RESULT_DRAFT.md - บันทึกการวิเคราะห์ระหว่างทำงาน            │
│     • แยก Facts (มีหลักฐาน) จาก Hypotheses (สันนิษฐาน)                      │
│     • ลด Hallucination สะสม                                                 │
│                                                                              │
│  ✅ Checkpoint Reread                                                        │
│     • ทุก 4 Turns อ่าน Draft ย้อนกลับ                                       │
│     • ตรวจสอบช่องโหว่                                                       │
│     • ยืนยัน Facts ที่มีหลักฐาน                                             │
│     • อัปเดต Confidence Score                                               │
│                                                                              │
│  ✅ Blueprint Generation                                                     │
│     • BLUEPRINT_PROMPT.md - Technical Specification                         │
│     • ใช้ Facts ที่ยืนยันแล้วเท่านั้น                                       │
│     • พร้อมส่งต่อให้ Coder AI                                               │
│                                                                              │
│  ✅ Real-Time Streaming                                                      │
│     • Draft Stream แบบ Real-time                                            │
│     • TUI Dashboard - แสดงผลบน Terminal                                     │
│     • Web Dashboard - แสดงผลบน Browser                                      │
│                                                                              │
│  ✅ Isolated Sandbox                                                         │
│     • Environment แยกสำหรับแต่ละ Agent                                      │
│     • Resource Limits (CPU, Memory, Time)                                   │
│     • Security Restrictions                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*สร้างเมื่อ: 2026-04-09*
*Version: 1.0*
*อ้างอิง: บทความ 1.1.6 Agent Sandbox พร้อม Working Memory*
