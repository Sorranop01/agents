/**
 * Planner Agent
 * Task planning and strategy agent
 */

const BaseAgent = require('./base-agent');
const axios = require('axios');

class PlannerAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.plans = new Map();
  }

  async processTask(task) {
    const { content, context = {} } = task;
    
    // Determine what type of planning is needed
    if (content.includes('timeline') || content.includes('schedule')) {
      return await this.createTimeline(content, context);
    }
    
    if (content.includes('estimate') || content.includes('duration')) {
      return await this.estimateTimeline(content, context);
    }
    
    return await this.createPlan(content, context);
  }

  async createPlan(objective, context) {
    const prompt = `Create a detailed execution plan for:

Objective: ${objective}
Context: ${JSON.stringify(context)}

Provide the plan in this JSON format:
{
  "objective": "main objective",
  "phases": [
    {
      "name": "phase name",
      "tasks": [
        {
          "name": "task name",
          "description": "task description",
          "estimatedHours": number,
          "dependencies": [],
          "deliverables": []
        }
      ],
      "estimatedDuration": "duration in days"
    }
  ],
  "milestones": [
    {
      "name": "milestone name",
      "targetDate": "estimated date",
      "criteria": "completion criteria"
    }
  ],
  "risks": [
    {
      "description": "risk description",
      "impact": "high/medium/low",
      "mitigation": "mitigation strategy"
    }
  ],
  "resources": {
    "required": ["list of required resources"],
    "optional": ["list of optional resources"]
  }
}`;

    try {
      const response = await this.callLLM(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const plan = JSON.parse(jsonMatch[0]);
        this.plans.set(plan.objective, plan);
        return plan;
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      this.logger.error('Plan creation failed:', error.message);
      throw error;
    }
  }

  async createTimeline(content, context) {
    const plan = await this.createPlan(content, context);
    
    // Generate timeline visualization
    const timeline = {
      plan,
      timeline: this.generateTimelineVisualization(plan),
      criticalPath: this.identifyCriticalPath(plan),
      bufferTime: this.calculateBufferTime(plan)
    };
    
    return timeline;
  }

  async estimateTimeline(content, context) {
    const prompt = `Estimate the timeline for:

Task: ${content}
Context: ${JSON.stringify(context)}

Provide estimation in this JSON format:
{
  "totalHours": number,
  "totalDays": number,
  "breakdown": [
    {
      "activity": "activity name",
      "optimistic": number,
      "realistic": number,
      "pessimistic": number,
      "notes": "estimation notes"
    }
  ],
  "assumptions": ["list of assumptions"],
  "risks": ["list of risks that could affect timeline"]
}`;

    try {
      const response = await this.callLLM(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      this.logger.error('Timeline estimation failed:', error.message);
      throw error;
    }
  }

  generateTimelineVisualization(plan) {
    const phases = plan.phases || [];
    let currentDay = 0;
    
    return phases.map(phase => {
      const startDay = currentDay;
      const duration = parseInt(phase.estimatedDuration) || 7;
      currentDay += duration;
      
      return {
        phase: phase.name,
        startDay,
        endDay: currentDay,
        duration,
        tasks: phase.tasks?.length || 0
      };
    });
  }

  identifyCriticalPath(plan) {
    // Simplified critical path identification
    const phases = plan.phases || [];
    return phases
      .filter(phase => !phase.tasks?.some(t => t.dependencies?.length > 0))
      .map(phase => phase.name);
  }

  calculateBufferTime(plan) {
    const phases = plan.phases || [];
    const totalDays = phases.reduce((sum, p) => 
      sum + (parseInt(p.estimatedDuration) || 7), 0
    );
    
    // 20% buffer
    return Math.ceil(totalDays * 0.2);
  }

  async callLLM(prompt) {
    try {
      const response = await axios.post(
        `${process.env.KIMI_BASE_URL}/chat/completions`,
        {
          model: 'kimi-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('LLM call failed:', error.message);
      throw error;
    }
  }
}

module.exports = PlannerAgent;
