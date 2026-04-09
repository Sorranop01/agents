/**
 * Researcher Agent
 * Information gathering and analysis agent
 */

const BaseAgent = require('./base-agent');
const axios = require('axios');

class ResearcherAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.searchProvider = process.env.SEARCH_PROVIDER || 'brave';
    this.maxResults = config.capabilities?.webSearch?.maxResults || 10;
  }

  async processTask(task) {
    const { content, context = {} } = task;
    
    // Determine task type
    if (content.includes('analyze') || content.includes('data')) {
      return await this.analyzeData(content, context);
    }
    
    if (content.includes('summarize') || content.includes('summary')) {
      return await this.summarize(content, context);
    }
    
    return await this.search(content, context);
  }

  async search(query, context) {
    const maxResults = context.maxResults || this.maxResults;
    
    // For this implementation, we'll use a simulated search
    // In production, integrate with actual search APIs
    const searchPrompt = `Search for information about: ${query}

Provide search results in this format:
｛｛RESULTS｝｝
[
  {
    "title": "result title",
    "url": "source url",
    "snippet": "brief description",
    "relevance": "high/medium/low"
  }
]
｛｛/RESULTS｝｝

｛｛SUMMARY｝｝
// Brief summary of findings
｛｛/SUMMARY｝｝

｛｛KEY_POINTS｝｝
// Key points from the search
｛｛/KEY_POINTS｝｝`;

    try {
      const response = await this.callLLM(searchPrompt);
      return this.parseSearchResponse(response, query);
    } catch (error) {
      this.logger.error('Search failed:', error.message);
      throw error;
    }
  }

  async analyzeData(content, context) {
    // Extract data from content
    const dataMatch = content.match(/```(?:json)?\n?([\s\S]*?)```/) ||
                      content.match(/｛｛DATA｝｝([\s\S]*?)｛｛\/DATA｝｝/);
    const data = dataMatch ? dataMatch[1].trim() : content;
    
    const analysisType = context.analysisType || 'summary';

    const prompt = `Analyze this data with focus on ${analysisType}:

Data:
${data}

Provide analysis in this format:
｛｛ANALYSIS｝｝
// Detailed analysis
｛｛/ANALYSIS｝｝

｛｛INSIGHTS｝｝
// Key insights discovered
｛｛/INSIGHTS｝｝

｛｛RECOMMENDATIONS｝｝
// Recommendations based on analysis
｛｛/RECOMMENDATIONS｝｝`;

    try {
      const response = await this.callLLM(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      this.logger.error('Data analysis failed:', error.message);
      throw error;
    }
  }

  async summarize(content, context) {
    const textMatch = content.match(/```\n?([\s\S]*?)```/) ||
                      content.match(/｛｛TEXT｝｝([\s\S]*?)｛｛\/TEXT｝｝/);
    const text = textMatch ? textMatch[1].trim() : content;
    
    const maxLength = context.maxLength || 500;
    const style = context.style || 'concise';

    const prompt = `Summarize the following text in ${style} style (max ${maxLength} characters):

Text:
${text}

Provide summary in this format:
｛｛SUMMARY｝｝
// Your summary here
｛｛/SUMMARY｝｝

｛｛KEY_POINTS｝｝
// Bullet points of key information
｛｛/KEY_POINTS｝｝

｛｛MAIN_TOPICS｝｝
// List of main topics covered
｛｛/MAIN_TOPICS｝｝`;

    try {
      const response = await this.callLLM(prompt);
      return this.parseSummaryResponse(response);
    } catch (error) {
      this.logger.error('Summarization failed:', error.message);
      throw error;
    }
  }

  parseSearchResponse(response, query) {
    const resultsMatch = response.match(/｛｛RESULTS｝｝([\s\S]*?)｛｛\/RESULTS｝｝/);
    const summaryMatch = response.match(/｛｛SUMMARY｝｝([\s\S]*?)｛｛\/SUMMARY｝｝/);
    const keyPointsMatch = response.match(/｛｛KEY_POINTS｝｝([\s\S]*?)｛｛\/KEY_POINTS｝｝/);

    let results = [];
    if (resultsMatch) {
      try {
        const jsonMatch = resultsMatch[1].match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        this.logger.warn('Failed to parse search results JSON');
      }
    }

    return {
      query,
      results,
      summary: summaryMatch ? summaryMatch[1].trim() : null,
      keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : null,
      resultCount: results.length,
      fullResponse: response
    };
  }

  parseAnalysisResponse(response) {
    const analysisMatch = response.match(/｛｛ANALYSIS｝｝([\s\S]*?)｛｛\/ANALYSIS｝｝/);
    const insightsMatch = response.match(/｛｛INSIGHTS｝｝([\s\S]*?)｛｛\/INSIGHTS｝｝/);
    const recommendationsMatch = response.match(/｛｛RECOMMENDATIONS｝｝([\s\S]*?)｛｛\/RECOMMENDATIONS｝｝/);

    return {
      analysis: analysisMatch ? analysisMatch[1].trim() : null,
      insights: insightsMatch ? insightsMatch[1].trim() : null,
      recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : null,
      fullResponse: response
    };
  }

  parseSummaryResponse(response) {
    const summaryMatch = response.match(/｛｛SUMMARY｝｝([\s\S]*?)｛｛\/SUMMARY｝｝/);
    const keyPointsMatch = response.match(/｛｛KEY_POINTS｝｝([\s\S]*?)｛｛\/KEY_POINTS｝｝/);
    const topicsMatch = response.match(/｛｛MAIN_TOPICS｝｝([\s\S]*?)｛｛\/MAIN_TOPICS｝｝/);

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : null,
      keyPoints: keyPointsMatch ? keyPointsMatch[1].trim() : null,
      mainTopics: topicsMatch ? topicsMatch[1].trim() : null,
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
          temperature: 0.5,
          max_tokens": 2500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 45000
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('LLM call failed:', error.message);
      throw error;
    }
  }
}

module.exports = ResearcherAgent;
