/**
 * Coder Agent
 * Code generation and implementation agent
 */

const BaseAgent = require('./base-agent');
const axios = require('axios');

class CoderAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.supportedLanguages = config.capabilities?.codeGeneration?.languages || 
      ['javascript', 'python', 'typescript'];
    this.codeStyle = process.env.CODE_STYLE || 'standard';
  }

  async processTask(task) {
    const { content, context = {} } = task;
    
    // Determine task type
    if (content.includes('review') || content.includes('check')) {
      return await this.reviewCode(content, context);
    }
    
    if (content.includes('refactor') || content.includes('improve')) {
      return await this.refactorCode(content, context);
    }
    
    if (content.includes('test') || content.includes('spec')) {
      return await this.generateTests(content, context);
    }
    
    return await this.generateCode(content, context);
  }

  async generateCode(requirements, context) {
    const language = this.detectLanguage(requirements, context) || 'javascript';
    
    const prompt = `Generate ${language} code based on these requirements:

Requirements: ${requirements}
Context: ${JSON.stringify(context)}
Style: ${this.codeStyle}

Please provide:
1. Complete, working code
2. Inline comments explaining key parts
3. Usage examples
4. Any assumptions made

Format your response as:
｛｛CODE｝｝
// Your code here
｛｛/CODE｝｝

｛｛EXPLANATION｝｝
// Explanation of the code
｛｛/EXPLANATION｝｝

｛｛USAGE｝｝
// Usage examples
｛｛/USAGE｝｝`;

    try {
      const response = await this.callLLM(prompt);
      return this.parseCodeResponse(response, language);
    } catch (error) {
      this.logger.error('Code generation failed:', error.message);
      throw error;
    }
  }

  async reviewCode(content, context) {
    // Extract code from content
    const codeMatch = content.match(/```[\w]*\n?([\s\S]*?)```/) || 
                      content.match(/｛｛CODE｝｝([\s\S]*?)｛｛\/CODE｝｝/);
    const code = codeMatch ? codeMatch[1].trim() : content;
    const language = this.detectLanguage(content, context);

    const prompt = `Review this ${language || 'code'} for issues:

\`\`\`${language || ''}
${code}
\`\`\`

Please check for:
1. Bugs and logical errors
2. Security vulnerabilities
3. Performance issues
4. Code style violations
5. Missing error handling
6. Documentation gaps

Provide your review in this format:
｛｛SUMMARY｝｝
// Overall assessment
｛｛/SUMMARY｝｝

｛｛ISSUES｝｝
// List of issues found
｛｛/ISSUES｝｝

｛｛RECOMMENDATIONS｝｝
// Suggested improvements
｛｛/RECOMMENDATIONS｝｝`;

    try {
      const response = await this.callLLM(prompt);
      return this.parseReviewResponse(response);
    } catch (error) {
      this.logger.error('Code review failed:', error.message);
      throw error;
    }
  }

  async refactorCode(content, context) {
    const codeMatch = content.match(/```[\w]*\n?([\s\S]*?)```/) || 
                      content.match(/｛｛CODE｝｝([\s\S]*?)｛｛\/CODE｝｝/);
    const code = codeMatch ? codeMatch[1].trim() : content;
    const language = this.detectLanguage(content, context);

    const prompt = `Refactor this ${language || 'code'} to improve quality:

\`\`\`${language || ''}
${code}
\`\`\`

Focus on:
1. Improving readability
2. Reducing complexity
3. Enhancing maintainability
4. Following best practices
5. Better naming conventions

Provide the refactored code with explanations of changes made.`;

    try {
      const response = await this.callLLM(prompt);
      return this.parseCodeResponse(response, language);
    } catch (error) {
      this.logger.error('Code refactoring failed:', error.message);
      throw error;
    }
  }

  async generateTests(content, context) {
    const codeMatch = content.match(/```[\w]*\n?([\s\S]*?)```/) || 
                      content.match(/｛｛CODE｝｝([\s\S]*?)｛｛\/CODE｝｝/);
    const code = codeMatch ? codeMatch[1].trim() : content;
    const language = this.detectLanguage(content, context);

    const prompt = `Generate comprehensive tests for this ${language || 'code'}:

\`\`\`${language || ''}
${code}
\`\`\`

Include:
1. Unit tests for all functions
2. Edge case tests
3. Error handling tests
4. Integration tests if applicable

Use appropriate testing framework for ${language || 'the language'}.`;

    try {
      const response = await this.callLLM(prompt);
      return this.parseCodeResponse(response, language);
    } catch (error) {
      this.logger.error('Test generation failed:', error.message);
      throw error;
    }
  }

  detectLanguage(content, context) {
    // Check context first
    if (context.language) return context.language;
    
    // Detect from content
    const languagePatterns = {
      javascript: /\b(const|let|var|function|=>|console\.log)\b/,
      typescript: /\b(interface|type|:\s*(string|number|boolean))\b/,
      python: /\b(def|import|print\(|class\s+\w+\s*\():)/,
      java: /\b(public\s+class|private\s+|System\.out\.println)\b/,
      go: /\b(func\s+|package\s+main|fmt\.Print)\b/,
      rust: /\b(fn\s+|let\s+mut|println!)/
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(content)) return lang;
    }

    return null;
  }

  parseCodeResponse(response, language) {
    const codeMatch = response.match(/｛｛CODE｝｝([\s\S]*?)｛｛\/CODE｝｝/) ||
                      response.match(/```[\w]*\n?([\s\S]*?)```/);
    const explanationMatch = response.match(/｛｛EXPLANATION｝｝([\s\S]*?)｛｛\/EXPLANATION｝｝/);
    const usageMatch = response.match(/｛｛USAGE｝｝([\s\S]*?)｛｛\/USAGE｝｝/);

    return {
      language,
      code: codeMatch ? codeMatch[1].trim() : response,
      explanation: explanationMatch ? explanationMatch[1].trim() : null,
      usage: usageMatch ? usageMatch[1].trim() : null,
      fullResponse: response
    };
  }

  parseReviewResponse(response) {
    const summaryMatch = response.match(/｛｛SUMMARY｝｝([\s\S]*?)｛｛\/SUMMARY｝｝/);
    const issuesMatch = response.match(/｛｛ISSUES｝｝([\s\S]*?)｛｛\/ISSUES｝｝/);
    const recommendationsMatch = response.match(/｛｛RECOMMENDATIONS｝｝([\s\S]*?)｛｛\/RECOMMENDATIONS｝｝/);

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : null,
      issues: issuesMatch ? issuesMatch[1].trim() : null,
      recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : null,
      fullResponse: response
    };
  }

  async callLLM(prompt) {
    try {
      const response = await axios.post(
        `${process.env.KIMI_BASE_URL}/chat/completions`,
        {
          model: 'kimi-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 3000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('LLM call failed:', error.message);
      throw error;
    }
  }
}

module.exports = CoderAgent;
