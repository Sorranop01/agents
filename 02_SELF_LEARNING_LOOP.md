# Self-Learning Loop System
## ระบบการเรียนรู้และพัฒนาตนเองของ Agents

---

## 1. ภาพรวมระบบการเรียนรู้

### 1.1 Self-Learning Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SELF-LEARNING LOOP ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CONTINUOUS LEARNING CYCLE                         │   │
│  │                                                                      │   │
│  │   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     │   │
│  │   │ EXECUTE │────▶│ OBSERVE │────▶│ REFLECT │────▶│ IMPROVE │────┤   │
│  │   │  TASK   │     │ OUTCOME │     │  &      │     │  &      │    │   │
│  │   │         │     │         │     │ LEARN   │     │ ADAPT   │    │   │
│  │   └─────────┘     └─────────┘     └─────────┘     └─────────┘    │   │
│  │        ▲                                               │          │   │
│  │        │                                               │          │   │
│  │        └───────────────────────────────────────────────┘          │   │
│  │                        (Apply new knowledge)                       │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    LEARNING COMPONENTS                               │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Feedback   │  │   Pattern    │  │   Skill      │              │   │
│  │  │   Processor  │  │   Recognizer │  │   Library    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Knowledge  │  │   Meta-      │  │   Self-      │              │   │
│  │  │   Integrator │  │   Learner    │  │   Evaluator  │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Learning Loop (วงจรการเรียนรู้)

### 2.1 4-Phase Learning Cycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    4-PHASE LEARNING CYCLE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: EXECUTE (การปฏิบัติ)                                               │
│  ═══════════════════════════════                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Agent รับ task และวิเคราะห์                                       │   │
│  │  • วางแผนการทำงาน                                                    │   │
│  │  • Execute ตาม plan                                                  │   │
│  │  • เก็บ telemetry ตลอดกระบวนการ                                      │   │
│  │                                                                      │   │
│  │  Output: Trajectory (บันทึกการทำงานทั้งหมด)                          │   │
│  │  {                                                                     │   │
│  │    task_id, input, plan, actions, outputs, timestamps, resources    │   │
│  │  }                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  PHASE 2: OBSERVE (การสังเกต)                                               │
│  ═══════════════════════════════                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • วิเคราะห์ผลลัพธ์ที่ได้                                            │   │
│  │  • เปรียบเทียบกับ expected outcome                                  │   │
│  │  • เก็บ metrics (time, quality, resource usage)                      │   │
│  │  • ระบุ success/failure factors                                     │   │
│  │                                                                      │   │
│  │  Output: Observation Report                                          │   │
│  │  {                                                                     │   │
│  │    success: boolean,                                                 │   │
│  │    metrics: { duration, quality_score, efficiency },                │   │
│  │    deviations: [...],                                                │   │
│  │    root_causes: [...]                                                │   │
│  │  }                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  PHASE 3: REFLECT & LEARN (การทบทวนและเรียนรู้)                             │
│  ═══════════════════════════════════════════════                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • วิเคราะห์ patterns จากหลาย tasks                                  │   │
│  │  • สร้าง/อัปเดต skills                                               │   │
│  │  • อัปเดต knowledge base                                             │   │
│  │  • ปรับปรุง strategies                                               │   │
│  │                                                                      │   │
│  │  Output: Learning Artifacts                                          │   │
│  │  {                                                                     │   │
│  │    new_skills: [...],                                                │   │
│  │    updated_knowledge: [...],                                         │   │
│  │    strategy_adjustments: [...]                                       │   │
│  │  }                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  PHASE 4: IMPROVE & ADAPT (การปรับปรุงและปรับตัว)                          │
│  ═════════════════════════════════════════════════=                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • นำความรู้ใหม่ไปใช้ใน task ถัดไป                                  │   │
│  │  • ปรับปรุง prompt หรือ configuration                               │   │
│  │  • อัปเดต decision-making rules                                     │   │
│  │  • แบ่งปันความรู้กับ agents อื่น                                    │   │
│  │                                                                      │   │
│  │  Output: Updated Agent State                                         │   │
│  │  {                                                                     │   │
│  │    skills_library: updated,                                          │   │
│  │    knowledge_profile: updated,                                       │   │
│  │    performance_baseline: updated                                     │   │
│  │  }                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    └───────────────────────────────────────┤
│                                                                              │
│  CYCLE TIME: ทุกครั้งที่ทำ task เสร็จ หรือ ทุกๆ N tasks                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Feedback System

### 3.1 Multi-Source Feedback

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-SOURCE FEEDBACK SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FEEDBACK SOURCES                                                            │
│  ═══════════════════                                                         │
│                                                                              │
│  ┌─────────────────┐                                                         │
│  │  1. AUTOMATED   │                                                         │
│  │     METRICS     │                                                         │
│  │                 │                                                         │
│  │  • Task success │                                                         │
│  │  • Execution    │                                                         │
│  │    time         │                                                         │
│  │  • Code quality │                                                         │
│  │    (lint,       │                                                         │
│  │    coverage)    │                                                         │
│  │  • Test results │                                                         │
│  │  • Resource     │                                                         │
│  │    usage        │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│  ┌────────┴────────┐                                                         │
│  │  2. PEER REVIEW │                                                         │
│  │                 │                                                         │
│  │  • Code review  │                                                         │
│  │    feedback     │                                                         │
│  │  • Architecture │                                                         │
│  │    review       │                                                         │
│  │  • QA testing   │                                                         │
│  │    results      │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│  ┌────────┴────────┐                                                         │
│  │  3. HUMAN       │                                                         │
│  │     FEEDBACK    │                                                         │
│  │                 │                                                         │
│  │  • Direct       │                                                         │
│  │    ratings      │                                                         │
│  │  • Written      │                                                         │
│  │    comments     │                                                         │
│  │  • Correction   │                                                         │
│  │    examples     │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│  ┌────────┴────────┐                                                         │
│  │  4. SELF-       │                                                         │
│  │     ASSESSMENT  │                                                         │
│  │                 │                                                         │
│  │  • Confidence   │                                                         │
│  │    score        │                                                         │
│  │  • Self-critique│                                                         │
│  │  • Comparison   │                                                         │
│  │    with past    │                                                         │
│  │    performance  │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FEEDBACK AGGREGATOR                               │   │
│  │                                                                      │   │
│  │  • Weighted combination of all sources                              │   │
│  │  • Normalize to 0-1 scale                                           │   │
│  │  • Calculate component scores                                       │   │
│  │  • Generate overall reward signal                                   │   │
│  │                                                                      │   │
│  │  Output: RewardSignal {                                              │   │
│  │    task_success: 0.85,                                              │   │
│  │    quality_score: 0.90,                                             │   │
│  │    efficiency_score: 0.75,                                          │   │
│  │    user_feedback: 0.95,                                             │   │
│  │    critic_score: 0.88,                                              │   │
│  │    total_reward: 0.87                                               │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Feedback Processing Implementation

```typescript
// ==================== FEEDBACK SYSTEM ====================

// Reward Signal Interface
interface RewardSignal {
  task_success: number;      // 0-1: Did the task complete successfully?
  quality_score: number;     // 0-1: How good is the output?
  efficiency_score: number;  // 0-1: Resource usage efficiency
  user_feedback: number;     // 0-1: Human rating (if available)
  critic_score: number;      // 0-1: LLM-as-judge evaluation
  
  // Computed
  total_reward: number;
  components: Map<string, number>;
}

// Feedback Processor
class FeedbackProcessor {
  private adaptiveWeights: AdaptiveRewardWeights;
  private trajectoryBuffer: TrajectoryBuffer;
  
  constructor(config: FeedbackConfig) {
    this.adaptiveWeights = new AdaptiveRewardWeights(config.defaultWeights);
    this.trajectoryBuffer = new TrajectoryBuffer(config.bufferSize);
  }
  
  // Process feedback from multiple sources
  async processFeedback(
    trajectory: Trajectory,
    feedbackSources: FeedbackSources
  ): Promise<RewardSignal> {
    
    // 1. Collect metrics from each source
    const automatedMetrics = this.extractAutomatedMetrics(trajectory);
    const peerReviewMetrics = await this.extractPeerReviewMetrics(trajectory);
    const humanFeedback = await this.extractHumanFeedback(trajectory);
    const selfAssessment = this.extractSelfAssessment(trajectory);
    
    // 2. Calculate component scores
    const components = {
      task_success: automatedMetrics.success ? 1.0 : 0.0,
      quality_score: this.calculateQualityScore(
        automatedMetrics, peerReviewMetrics
      ),
      efficiency_score: this.calculateEfficiencyScore(automatedMetrics),
      user_feedback: humanFeedback?.rating || 0.5,
      critic_score: await this.evaluateWithCritic(trajectory)
    };
    
    // 3. Apply adaptive weights
    const weights = this.adaptiveWeights.getWeights();
    
    // 4. Compute total reward
    const totalReward = Object.entries(components).reduce(
      (sum, [key, value]) => sum + value * (weights[key] || 0.2),
      0
    );
    
    const rewardSignal: RewardSignal = {
      ...components,
      total_reward: totalReward,
      components: new Map(Object.entries(components))
    };
    
    // 5. Store trajectory with reward
    this.trajectoryBuffer.add({
      ...trajectory,
      reward: totalReward,
      reward_components: components,
      timestamp: new Date()
    });
    
    // 6. Update adaptive weights based on performance
    this.adaptiveWeights.update(totalReward, components);
    
    return rewardSignal;
  }
  
  // Extract automated metrics
  private extractAutomatedMetrics(trajectory: Trajectory): AutomatedMetrics {
    return {
      success: trajectory.output?.success || false,
      duration_ms: trajectory.completed_at.getTime() - trajectory.started_at.getTime(),
      code_quality: {
        lint_errors: trajectory.metrics?.lint_errors || 0,
        test_coverage: trajectory.metrics?.test_coverage || 0,
        complexity_score: trajectory.metrics?.complexity || 0
      },
      test_results: {
        passed: trajectory.metrics?.tests_passed || 0,
        failed: trajectory.metrics?.tests_failed || 0,
        total: trajectory.metrics?.tests_total || 0
      },
      resource_usage: {
        tokens_used: trajectory.metrics?.tokens_used || 0,
        api_calls: trajectory.metrics?.api_calls || 0,
        memory_peak: trajectory.metrics?.memory_peak || 0
      }
    };
  }
  
  // Calculate quality score
  private calculateQualityScore(
    automated: AutomatedMetrics,
    peerReview?: PeerReviewMetrics
  ): number {
    let score = 0;
    
    // Test success rate (40%)
    const testSuccessRate = automated.test_results.total > 0
      ? automated.test_results.passed / automated.test_results.total
      : 0;
    score += testSuccessRate * 0.4;
    
    // Code quality (30%)
    const lintScore = Math.max(0, 1 - (automated.code_quality.lint_errors / 10));
    const coverageScore = automated.code_quality.test_coverage;
    score += ((lintScore + coverageScore) / 2) * 0.3;
    
    // Peer review (30%)
    if (peerReview) {
      score += peerReview.overall_score * 0.3;
    } else {
      score += 0.15; // Neutral if no review
    }
    
    return Math.min(1, Math.max(0, score));
  }
  
  // Calculate efficiency score
  private calculateEfficiencyScore(automated: AutomatedMetrics): number {
    const expectedDuration = 300000; // 5 minutes baseline
    const durationScore = Math.max(0, 1 - (automated.duration_ms / expectedDuration - 1));
    
    const expectedTokens = 50000; // 50k tokens baseline
    const tokenScore = Math.max(0, 1 - (automated.resource_usage.tokens_used / expectedTokens - 1));
    
    return (durationScore + tokenScore) / 2;
  }
  
  // Evaluate with LLM-as-judge (critic)
  private async evaluateWithCritic(trajectory: Trajectory): Promise<number> {
    const criticPrompt = `
      You are an expert code reviewer. Evaluate the following task execution:
      
      Task: ${trajectory.task_description}
      
      Actions taken:
      ${trajectory.actions.map(a => `- ${a.type}: ${a.description}`).join('\n')}
      
      Output:
      ${JSON.stringify(trajectory.output, null, 2)}
      
      Rate the execution on a scale of 0-1 based on:
      1. Correctness (40%)
      2. Efficiency (30%)
      3. Best practices adherence (30%)
      
      Return only a number between 0 and 1.
    `;
    
    const response = await this.callLLM(criticPrompt);
    const score = parseFloat(response.trim());
    
    return Math.min(1, Math.max(0, score));
  }
}

// Adaptive Reward Weights
class AdaptiveRewardWeights {
  private weights: Map<string, number>;
  private learningRate: number;
  
  constructor(defaultWeights: Record<string, number>) {
    this.weights = new Map(Object.entries(defaultWeights));
    this.learningRate = 0.01;
  }
  
  // Update weights based on performance
  update(totalReward: number, components: Record<string, number>): void {
    // If total reward is low, adjust weights to focus on weak areas
    if (totalReward < 0.5) {
      for (const [component, score] of Object.entries(components)) {
        if (score < 0.5) {
          // Increase weight for weak components
          const currentWeight = this.weights.get(component) || 0.2;
          this.weights.set(
            component,
            Math.min(0.5, currentWeight + this.learningRate)
          );
        }
      }
    }
    
    // Normalize weights to sum to 1
    const totalWeight = Array.from(this.weights.values()).reduce((a, b) => a + b, 0);
    for (const [key, weight] of this.weights.entries()) {
      this.weights.set(key, weight / totalWeight);
    }
  }
  
  getWeights(): Record<string, number> {
    return Object.fromEntries(this.weights);
  }
}
```

---

## 4. Skill Library System

### 4.1 Skill Management

```typescript
// ==================== SKILL LIBRARY ====================

// Skill Interface
interface Skill {
  id: string;
  name: string;
  description: string;
  
  // Skill metadata
  domain: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
  
  // Skill content
  context: {
    when_to_use: string;
    how_to_apply: string;
    examples: SkillExample[];
    common_pitfalls: string[];
  };
  
  // Performance tracking
  stats: {
    usage_count: number;
    success_count: number;
    failure_count: number;
    average_reward: number;
    last_used: Date;
  };
  
  // Versioning
  version: number;
  created_at: Date;
  updated_at: Date;
  parent_skill?: string; // For evolved skills
}

// Skill Example
interface SkillExample {
  id: string;
  situation: string;
  action: string;
  outcome: string;
  reward: number;
}

// Skill Library
class SkillLibrary {
  private skills: Map<string, Skill>;
  private index: SkillIndex;
  
  constructor() {
    this.skills = new Map();
    this.index = new SkillIndex();
  }
  
  // Add new skill
  addSkill(skill: Omit<Skill, 'id' | 'stats' | 'version' | 'created_at' | 'updated_at'>): Skill {
    const newSkill: Skill = {
      ...skill,
      id: generateUUID(),
      stats: {
        usage_count: 0,
        success_count: 0,
        failure_count: 0,
        average_reward: 0,
        last_used: new Date()
      },
      version: 1,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this.skills.set(newSkill.id, newSkill);
    this.index.addSkill(newSkill);
    
    console.log(`[SkillLibrary] Added skill: ${newSkill.name} (${newSkill.id})`);
    
    return newSkill;
  }
  
  // Find relevant skills for a task
  async findRelevantSkills(
    taskDescription: string,
    context: Record<string, any>,
    limit: number = 5
  ): Promise<Skill[]> {
    // 1. Semantic search
    const semanticMatches = await this.index.semanticSearch(taskDescription, limit * 2);
    
    // 2. Filter by domain
    const domainMatches = semanticMatches.filter(skill =>
      skill.domain.some(d => context.domains?.includes(d))
    );
    
    // 3. Rank by success rate and relevance
    const ranked = domainMatches.sort((a, b) => {
      const scoreA = this.calculateSkillScore(a, context);
      const scoreB = this.calculateSkillScore(b, context);
      return scoreB - scoreA;
    });
    
    return ranked.slice(0, limit);
  }
  
  // Calculate skill relevance score
  private calculateSkillScore(skill: Skill, context: Record<string, any>): number {
    const successRate = skill.stats.usage_count > 0
      ? skill.stats.success_count / skill.stats.usage_count
      : 0.5;
    
    const recencyScore = this.calculateRecencyScore(skill.stats.last_used);
    
    const rewardScore = skill.stats.average_reward;
    
    return (successRate * 0.4) + (recencyScore * 0.2) + (rewardScore * 0.4);
  }
  
  // Update skill stats after use
  updateSkillStats(
    skillId: string,
    success: boolean,
    reward: number
  ): void {
    const skill = this.skills.get(skillId);
    if (!skill) return;
    
    skill.stats.usage_count++;
    if (success) {
      skill.stats.success_count++;
    } else {
      skill.stats.failure_count++;
    }
    
    // Update average reward with exponential moving average
    const alpha = 0.1;
    skill.stats.average_reward = 
      (1 - alpha) * skill.stats.average_reward + alpha * reward;
    
    skill.stats.last_used = new Date();
    skill.updated_at = new Date();
    
    // If success rate drops below threshold, flag for review
    const successRate = skill.stats.success_count / skill.stats.usage_count;
    if (skill.stats.usage_count > 10 && successRate < 0.5) {
      this.flagSkillForReview(skillId, 'Low success rate');
    }
  }
  
  // Evolve skill based on new learnings
  evolveSkill(
    parentSkillId: string,
    improvements: Partial<Skill>
  ): Skill {
    const parentSkill = this.skills.get(parentSkillId);
    if (!parentSkill) throw new Error(`Skill not found: ${parentSkillId}`);
    
    const evolvedSkill = this.addSkill({
      name: `${parentSkill.name} (v${parentSkill.version + 1})`,
      description: improvements.description || parentSkill.description,
      domain: improvements.domain || parentSkill.domain,
      difficulty: improvements.difficulty || parentSkill.difficulty,
      prerequisites: improvements.prerequisites || parentSkill.prerequisites,
      context: {
        when_to_use: improvements.context?.when_to_use || parentSkill.context.when_to_use,
        how_to_apply: improvements.context?.how_to_apply || parentSkill.context.how_to_apply,
        examples: [
          ...parentSkill.context.examples,
          ...(improvements.context?.examples || [])
        ],
        common_pitfalls: [
          ...parentSkill.context.common_pitfalls,
          ...(improvements.context?.common_pitfalls || [])
        ]
      }
    });
    
    evolvedSkill.parent_skill = parentSkillId;
    evolvedSkill.version = parentSkill.version + 1;
    
    console.log(`[SkillLibrary] Evolved skill: ${parentSkill.name} → ${evolvedSkill.name}`);
    
    return evolvedSkill;
  }
  
  // Extract skill from successful trajectory
  extractSkillFromTrajectory(trajectory: Trajectory): Skill | null {
    // Only extract from highly successful trajectories
    if (trajectory.reward < 0.8) return null;
    
    // Check if this is a novel approach
    const similarSkills = this.findSimilarSkills(trajectory);
    if (similarSkills.length > 0) {
      // Update existing skill instead
      this.enhanceSkillFromTrajectory(similarSkills[0], trajectory);
      return null;
    }
    
    // Create new skill
    return this.addSkill({
      name: `Skill: ${trajectory.task_type}`,
      description: `Approach for ${trajectory.task_description}`,
      domain: trajectory.domains,
      difficulty: this.assessDifficulty(trajectory),
      prerequisites: trajectory.prerequisites,
      context: {
        when_to_use: `When dealing with ${trajectory.task_type}`,
        how_to_apply: this.extractApproach(trajectory),
        examples: [{
          id: generateUUID(),
          situation: trajectory.input.description,
          action: trajectory.actions.map(a => a.description).join(', '),
          outcome: trajectory.output.summary,
          reward: trajectory.reward
        }],
        common_pitfalls: this.extractPitfalls(trajectory)
      }
    });
  }
  
  private calculateRecencyScore(lastUsed: Date): number {
    const daysSinceUse = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    return Math.exp(-daysSinceUse / 30); // Decay over 30 days
  }
  
  private flagSkillForReview(skillId: string, reason: string): void {
    console.log(`[SkillLibrary] Skill ${skillId} flagged for review: ${reason}`);
    // Emit event for review
  }
  
  private findSimilarSkills(trajectory: Trajectory): Skill[] {
    // Implementation for finding similar skills
    return [];
  }
  
  private enhanceSkillFromTrajectory(skill: Skill, trajectory: Trajectory): void {
    // Add new example to existing skill
    skill.context.examples.push({
      id: generateUUID(),
      situation: trajectory.input.description,
      action: trajectory.actions.map(a => a.description).join(', '),
      outcome: trajectory.output.summary,
      reward: trajectory.reward
    });
    skill.updated_at = new Date();
  }
  
  private assessDifficulty(trajectory: Trajectory): Skill['difficulty'] {
    const complexity = trajectory.actions.length;
    if (complexity < 3) return 'beginner';
    if (complexity < 6) return 'intermediate';
    if (complexity < 10) return 'advanced';
    return 'expert';
  }
  
  private extractApproach(trajectory: Trajectory): string {
    return trajectory.actions
      .filter(a => a.type === 'decision' || a.type === 'strategy')
      .map(a => a.description)
      .join('; ');
  }
  
  private extractPitfalls(trajectory: Trajectory): string[] {
    return trajectory.actions
      .filter(a => a.result === 'failure' && a.recovery)
      .map(a => `Avoid: ${a.description}. Instead: ${a.recovery}`);
  }
}
```

---

## 5. Meta-Learning System

### 5.1 Learning to Learn

```typescript
// ==================== META-LEARNING ====================

// Meta-Learner: Learns how to learn better
class MetaLearner {
  private learningStrategies: LearningStrategy[];
  private strategyPerformance: Map<string, StrategyPerformance>;
  
  constructor() {
    this.learningStrategies = this.initializeStrategies();
    this.strategyPerformance = new Map();
  }
  
  // Select best learning strategy for a task type
  selectStrategy(taskType: string, context: Record<string, any>): LearningStrategy {
    // Get strategies that have worked well for similar tasks
    const candidates = this.learningStrategies.filter(s =>
      s.applicable_task_types.includes(taskType)
    );
    
    // Rank by historical performance
    const ranked = candidates.sort((a, b) => {
      const perfA = this.strategyPerformance.get(a.id);
      const perfB = this.strategyPerformance.get(b.id);
      return (perfB?.average_improvement || 0) - (perfA?.average_improvement || 0);
    });
    
    return ranked[0] || this.learningStrategies[0];
  }
  
  // Adapt learning strategy based on results
  adaptStrategy(
    strategyId: string,
    taskType: string,
    result: LearningResult
  ): void {
    const performance = this.strategyPerformance.get(strategyId) || {
      strategy_id: strategyId,
      task_types: new Map(),
      total_applications: 0,
      average_improvement: 0
    };
    
    // Update performance for this task type
    const taskPerf = performance.task_types.get(taskType) || {
      applications: 0,
      successes: 0,
      average_improvement: 0
    };
    
    taskPerf.applications++;
    if (result.improvement > 0) taskPerf.successes++;
    
    // Update moving average
    taskPerf.average_improvement = 
      (taskPerf.average_improvement * (taskPerf.applications - 1) + result.improvement) /
      taskPerf.applications;
    
    performance.task_types.set(taskType, taskPerf);
    this.strategyPerformance.set(strategyId, performance);
    
    // If strategy consistently underperforms, evolve it
    if (taskPerf.applications > 10 && taskPerf.successes / taskPerf.applications < 0.3) {
      this.evolveStrategy(strategyId);
    }
  }
  
  // Evolve underperforming strategy
  private evolveStrategy(strategyId: string): void {
    const strategy = this.learningStrategies.find(s => s.id === strategyId);
    if (!strategy) return;
    
    console.log(`[MetaLearner] Evolving strategy: ${strategy.name}`);
    
    // Create variant with modifications
    const evolvedStrategy: LearningStrategy = {
      ...strategy,
      id: generateUUID(),
      name: `${strategy.name} (Evolved)`,
      parameters: this.mutateParameters(strategy.parameters),
      parent_strategy: strategyId
    };
    
    this.learningStrategies.push(evolvedStrategy);
  }
  
  private mutateParameters(params: Record<string, any>): Record<string, any> {
    const mutated = { ...params };
    
    // Randomly adjust numeric parameters
    for (const key of Object.keys(mutated)) {
      if (typeof mutated[key] === 'number') {
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        mutated[key] *= (1 + variation);
      }
    }
    
    return mutated;
  }
  
  private initializeStrategies(): LearningStrategy[] {
    return [
      {
        id: 'strategy-1',
        name: 'Incremental Learning',
        description: 'Learn from small, incremental improvements',
        applicable_task_types: ['coding', 'refactoring'],
        parameters: {
          batch_size: 5,
          learning_rate: 0.1,
          exploration_rate: 0.2
        }
      },
      {
        id: 'strategy-2',
        name: 'Pattern Matching',
        description: 'Learn by recognizing and applying patterns',
        applicable_task_types: ['design', 'architecture'],
        parameters: {
          pattern_threshold: 0.8,
          generalization_rate: 0.3
        }
      },
      {
        id: 'strategy-3',
        name: 'Trial and Error',
        description: 'Learn through experimentation',
        applicable_task_types: ['optimization', 'debugging'],
        parameters: {
          max_trials: 10,
          error_tolerance: 0.3
        }
      }
    ];
  }
}

// Self-Evaluation System
class SelfEvaluator {
  // Evaluate own performance
  async evaluatePerformance(
    recentTrajectories: Trajectory[],
    baseline: PerformanceBaseline
  ): Promise<SelfEvaluation> {
    const metrics = this.calculateMetrics(recentTrajectories);
    
    return {
      overall_score: this.calculateOverallScore(metrics, baseline),
      strengths: this.identifyStrengths(metrics, baseline),
      weaknesses: this.identifyWeaknesses(metrics, baseline),
      improvement_areas: this.suggestImprovements(metrics, baseline),
      learning_priorities: this.prioritizeLearning(metrics),
      recommended_actions: this.recommendActions(metrics)
    };
  }
  
  private calculateMetrics(trajectories: Trajectory[]): PerformanceMetrics {
    return {
      success_rate: trajectories.filter(t => t.success).length / trajectories.length,
      average_reward: trajectories.reduce((sum, t) => sum + t.reward, 0) / trajectories.length,
      average_duration: trajectories.reduce((sum, t) => sum + t.duration_ms, 0) / trajectories.length,
      skill_growth: this.calculateSkillGrowth(trajectories),
      knowledge_expansion: this.calculateKnowledgeExpansion(trajectories)
    };
  }
  
  private identifyStrengths(
    metrics: PerformanceMetrics,
    baseline: PerformanceBaseline
  ): string[] {
    const strengths: string[] = [];
    
    if (metrics.success_rate > baseline.success_rate + 0.1) {
      strengths.push('High task success rate');
    }
    if (metrics.average_reward > baseline.average_reward + 0.1) {
      strengths.push('Consistently high quality output');
    }
    if (metrics.skill_growth > 0.2) {
      strengths.push('Rapid skill acquisition');
    }
    
    return strengths;
  }
  
  private identifyWeaknesses(
    metrics: PerformanceMetrics,
    baseline: PerformanceBaseline
  ): string[] {
    const weaknesses: string[] = [];
    
    if (metrics.success_rate < baseline.success_rate - 0.1) {
      weaknesses.push('Declining success rate');
    }
    if (metrics.average_duration > baseline.average_duration * 1.5) {
      weaknesses.push('Slower than baseline performance');
    }
    if (metrics.knowledge_expansion < 0.1) {
      weaknesses.push('Limited knowledge expansion');
    }
    
    return weaknesses;
  }
  
  private suggestImprovements(
    metrics: PerformanceMetrics,
    baseline: PerformanceBaseline
  ): ImprovementArea[] {
    const areas: ImprovementArea[] = [];
    
    if (metrics.average_duration > baseline.average_duration) {
      areas.push({
        area: 'efficiency',
        current: metrics.average_duration,
        target: baseline.average_duration * 0.8,
        suggestion: 'Focus on optimizing common task patterns'
      });
    }
    
    if (metrics.success_rate < 0.9) {
      areas.push({
        area: 'reliability',
        current: metrics.success_rate,
        target: 0.95,
        suggestion: 'Study failed tasks to identify common failure modes'
      });
    }
    
    return areas;
  }
  
  private prioritizeLearning(metrics: PerformanceMetrics): LearningPriority[] {
    // Return prioritized list of what to learn next
    return [
      {
        skill_area: 'most_failed_task_type',
        priority: 'high',
        reason: 'High failure rate indicates knowledge gap'
      },
      {
        skill_area: 'slowest_task_type',
        priority: 'medium',
        reason: 'Optimization opportunity'
      }
    ];
  }
  
  private recommendActions(metrics: PerformanceMetrics): RecommendedAction[] {
    const actions: RecommendedAction[] = [];
    
    if (metrics.success_rate < 0.7) {
      actions.push({
        action: 'review_recent_failures',
        description: 'Analyze last 10 failed tasks',
        expected_outcome: 'Identify patterns in failures'
      });
    }
    
    if (metrics.knowledge_expansion < 0.1) {
      actions.push({
        action: 'explore_new_domain',
        description: 'Attempt tasks in unfamiliar domain',
        expected_outcome: 'Expand knowledge boundaries'
      });
    }
    
    return actions;
  }
  
  private calculateSkillGrowth(trajectories: Trajectory[]): number {
    // Calculate rate of new skill acquisition
    const uniqueSkills = new Set(trajectories.flatMap(t => t.skills_used));
    return uniqueSkills.size / trajectories.length;
  }
  
  private calculateKnowledgeExpansion(trajectories: Trajectory[]): number {
    // Calculate expansion of knowledge coverage
    const uniqueDomains = new Set(trajectories.flatMap(t => t.domains));
    return uniqueDomains.size / 10; // Normalize to 0-1
  }
}
```

---

## 6. Continuous Improvement Loop

### 6.1 The Complete Self-Improvement Cycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTINUOUS IMPROVEMENT CYCLE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   ┌─────────────┐                                                   │   │
│  │   │   START     │                                                   │   │
│  │   │  New Task   │                                                   │   │
│  │   └──────┬──────┘                                                   │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   ┌─────────────┐     Use relevant     ┌─────────────┐             │   │
│  │   │   SELECT    │◀────skills from──────│ SKILL       │             │   │
│  │   │   SKILLS    │                      │ LIBRARY     │             │   │
│  │   └──────┬──────┘                      └─────────────┘             │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   ┌─────────────┐     Apply best       ┌─────────────┐             │   │
│  │   │  EXECUTE    │◀────strategy from────│ META-       │             │   │
│  │   │   TASK      │                      │ LEARNER     │             │   │
│  │   └──────┬──────┘                      └─────────────┘             │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   ┌─────────────┐     Collect          ┌─────────────┐             │   │
│  │   │   GATHER    │─────feedback────────▶│ FEEDBACK    │             │   │
│  │   │  FEEDBACK   │                      │ PROCESSOR   │             │   │
│  │   └──────┬──────┘                      └──────┬──────┘             │   │
│  │          │                                     │                    │   │
│  │          │         Generate                    │                    │   │
│  │          │         reward signal               │                    │   │
│  │          │         ┌───────────────────────────┘                    │   │
│  │          │         │                                                │   │
│  │          ▼         ▼                                                │   │
│  │   ┌─────────────┐     High reward?     ┌─────────────┐             │   │
│  │   │   ANALYZE   │─────Yes─────────────▶│  EXTRACT    │             │   │
│  │   │   RESULT    │                      │   SKILL     │             │   │
│  │   └──────┬──────┘                      └──────┬──────┘             │   │
│  │          │ No (low reward)                    │                    │   │
│  │          │                                    │                    │   │
│  │          ▼                                    ▼                    │   │
│  │   ┌─────────────┐                      ┌─────────────┐             │   │
│  │   │  IDENTIFY   │                      │  UPDATE     │             │   │
│  │   │  GAPS/ERRORS│                      │ SKILL       │             │   │
│  │   └──────┬──────┘                      │ LIBRARY     │             │   │
│  │          │                             └──────┬──────┘             │   │
│  │          │                                    │                    │   │
│  │          └────────────┬───────────────────────┘                    │   │
│  │                       │                                            │   │
│  │                       ▼                                            │   │
│  │               ┌─────────────┐                                      │   │
│  │               │   UPDATE    │                                      │   │
│  │               │ KNOWLEDGE   │                                      │   │
│  │               │   BASE      │                                      │   │
│  │               └──────┬──────┘                                      │   │
│  │                      │                                             │   │
│  │                      ▼                                             │   │
│  │               ┌─────────────┐                                      │   │
│  │               │   SELF-     │                                      │   │
│  │               │  EVALUATE   │                                      │   │
│  │               └──────┬──────┘                                      │   │
│  │                      │                                             │   │
│  │                      ▼                                             │   │
│  │               ┌─────────────┐                                      │   │
│  │               │   ADAPT     │                                      │   │
│  │               │  STRATEGY   │                                      │   │
│  │               └──────┬──────┘                                      │   │
│  │                      │                                             │   │
│  │                      └────────────────┐                            │   │
│  │                                       │                            │   │
│  │                                       ▼                            │   │
│  │                               ┌─────────────┐                      │   │
│  │                               │   READY     │                      │   │
│  │                               │  FOR NEXT   │                      │   │
│  │                               │    TASK     │                      │   │
│  │                               └─────────────┘                      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  CYCLE FREQUENCY:                                                            │
│  • After every task completion                                               │
│  • Every N tasks (batch learning)                                            │
│  • Scheduled (e.g., daily review)                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Integration with Agent System

```typescript
// ==================== AGENT WITH SELF-LEARNING ====================

class SelfLearningAgent {
  private skillLibrary: SkillLibrary;
  private feedbackProcessor: FeedbackProcessor;
  private metaLearner: MetaLearner;
  private selfEvaluator: SelfEvaluator;
  private knowledgeBase: KnowledgeBase;
  
  constructor(config: AgentConfig) {
    this.skillLibrary = new SkillLibrary();
    this.feedbackProcessor = new FeedbackProcessor(config.feedback);
    this.metaLearner = new MetaLearner();
    this.selfEvaluator = new SelfEvaluator();
    this.knowledgeBase = new KnowledgeBase();
  }
  
  // Main execution with learning
  async executeTask(task: Task): Promise<TaskResult> {
    // 1. Select relevant skills
    const relevantSkills = await this.skillLibrary.findRelevantSkills(
      task.description,
      task.context
    );
    
    // 2. Select best learning strategy
    const strategy = this.metaLearner.selectStrategy(task.type, task.context);
    
    // 3. Execute task with skills and strategy
    const trajectory = await this.runWithStrategy(task, relevantSkills, strategy);
    
    // 4. Process feedback
    const rewardSignal = await this.feedbackProcessor.processFeedback(
      trajectory,
      await this.collectFeedbackSources(trajectory)
    );
    
    // 5. Extract/update skills if successful
    if (rewardSignal.total_reward > 0.7) {
      const newSkill = this.skillLibrary.extractSkillFromTrajectory(trajectory);
      if (newSkill) {
        console.log(`[Agent] Learned new skill: ${newSkill.name}`);
      }
    }
    
    // 6. Update knowledge base
    await this.knowledgeBase.integrateLearnings(trajectory, rewardSignal);
    
    // 7. Adapt strategy
    this.metaLearner.adaptStrategy(
      strategy.id,
      task.type,
      { improvement: rewardSignal.total_reward - 0.5 }
    );
    
    // 8. Periodic self-evaluation (every 10 tasks)
    if (this.shouldSelfEvaluate()) {
      const evaluation = await this.selfEvaluator.evaluatePerformance(
        this.getRecentTrajectories(10),
        this.getBaseline()
      );
      
      console.log('[Agent] Self-evaluation:', evaluation);
      
      // Act on recommendations
      await this.applyRecommendations(evaluation.recommended_actions);
    }
    
    return {
      output: trajectory.output,
      success: trajectory.success,
      metrics: {
        duration_ms: trajectory.duration_ms,
        reward: rewardSignal.total_reward
      }
    };
  }
  
  // Share knowledge with other agents
  async shareKnowledge(targetAgent: string): Promise<void> {
    const knowledgePackage = {
      skills: this.skillLibrary.getExportableSkills(),
      patterns: this.knowledgeBase.getPatterns(),
      learnings: this.knowledgeBase.getRecentLearnings(10)
    };
    
    await this.sendToAgent(targetAgent, {
      type: 'knowledge_share',
      content: knowledgePackage
    });
  }
  
  // Receive knowledge from other agents
  async receiveKnowledge(package: KnowledgePackage): Promise<void> {
    // Validate and integrate received knowledge
    for (const skill of package.skills) {
      if (await this.validateSkill(skill)) {
        this.skillLibrary.importSkill(skill);
      }
    }
    
    this.knowledgeBase.mergePatterns(package.patterns);
  }
  
  private async runWithStrategy(
    task: Task,
    skills: Skill[],
    strategy: LearningStrategy
  ): Promise<Trajectory> {
    // Implementation of task execution with strategy
    const trajectory: Trajectory = {
      task_id: task.id,
      task_type: task.type,
      task_description: task.description,
      input: task.input,
      skills_used: skills.map(s => s.id),
      strategy_used: strategy.id,
      actions: [],
      output: {},
      success: false,
      reward: 0,
      started_at: new Date(),
      completed_at: new Date(),
      duration_ms: 0
    };
    
    // Execute based on strategy
    // ... implementation
    
    return trajectory;
  }
  
  private async collectFeedbackSources(trajectory: Trajectory): Promise<FeedbackSources> {
    return {
      automated: this.extractAutomatedMetrics(trajectory),
      peer_review: await this.requestPeerReview(trajectory),
      human_feedback: await this.pollHumanFeedback(trajectory),
      self_assessment: this.generateSelfAssessment(trajectory)
    };
  }
  
  private shouldSelfEvaluate(): boolean {
    // Every 10 tasks
    return this.getCompletedTaskCount() % 10 === 0;
  }
  
  private async applyRecommendations(actions: RecommendedAction[]): Promise<void> {
    for (const action of actions) {
      console.log(`[Agent] Applying recommendation: ${action.action}`);
      
      switch (action.action) {
        case 'review_recent_failures':
          await this.reviewFailures();
          break;
        case 'explore_new_domain':
          await this.exploreNewDomain();
          break;
        // ... more actions
      }
    }
  }
  
  // Helper methods
  private getRecentTrajectories(n: number): Trajectory[] { /* ... */ return []; }
  private getBaseline(): PerformanceBaseline { /* ... */ return {} as any; }
  private getCompletedTaskCount(): number { /* ... */ return 0; }
  private async validateSkill(skill: Skill): Promise<boolean> { /* ... */ return true; }
  private async reviewFailures(): Promise<void> { /* ... */ }
  private async exploreNewDomain(): Promise<void> { /* ... */ }
  private extractAutomatedMetrics(trajectory: Trajectory): AutomatedMetrics { /* ... */ return {} as any; }
  private async requestPeerReview(trajectory: Trajectory): Promise<PeerReviewMetrics> { /* ... */ return {} as any; }
  private async pollHumanFeedback(trajectory: Trajectory): Promise<HumanFeedback> { /* ... */ return {} as any; }
  private generateSelfAssessment(trajectory: Trajectory): SelfAssessment { /* ... */ return {} as any; }
  private async sendToAgent(target: string, message: any): Promise<void> { /* ... */ }
}
```

---

## 8. Summary

### 8.1 Key Learning Mechanisms

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KEY LEARNING MECHANISMS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ 4-Phase Learning Cycle                                                   │
│     • EXECUTE - ปฏิบัติงานและเก็บข้อมูล                                    │
│     • OBSERVE - สังเกตผลลัพธ์                                              │
│     • REFLECT & LEARN - ทบทวนและเรียนรู้                                   │
│     • IMPROVE & ADAPT - ปรับปรุงและปรับตัว                                 │
│                                                                              │
│  ✅ Multi-Source Feedback                                                    │
│     • Automated Metrics - วัดผลอัตโนมัติ                                   │
│     • Peer Review - รีวิวจาก peers                                          │
│     • Human Feedback - feedback จากมนุษย์                                   │
│     • Self-Assessment - ประเมินตนเอง                                        │
│                                                                              │
│  ✅ Skill Library                                                            │
│     • Extract skills from successful tasks                                  │
│     • Version control for skills                                            │
│     • Skill evolution and improvement                                       │
│     • Cross-agent skill sharing                                             │
│                                                                              │
│  ✅ Meta-Learning                                                            │
│     • Learn how to learn better                                             │
│     • Adaptive learning strategies                                          │
│     • Strategy evolution                                                    │
│                                                                              │
│  ✅ Self-Evaluation                                                          │
│     • Continuous performance monitoring                                     │
│     • Identify strengths and weaknesses                                     │
│     • Generate improvement recommendations                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. References

### GitHub Repositories

1. **Self-Improving AI Agent** (nomannayeem)
   - Feedback loop implementation
   - Skill library system
   - https://medium.com/@nomannayeem/lets-build-a-self-improving-ai-agent

2. **Dash** (agno-agi)
   - Self-learning data agent
   - 6 layers of context
   - https://github.com/agno-agi/dash

3. **Self-Evolving Agents** (OpenAI)
   - GEPA (Genetic-Pareto) optimization
   - Automated prompt improvement
   - https://developers.openai.com/cookbook/examples/partners/self_evolving_agents

---

*สร้างเมื่อ: 2026-04-09*
*Version: 1.0*
