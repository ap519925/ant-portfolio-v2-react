
/**
 * AI Service Utilities
 * Centralized logic for calling various LLM providers.
 */


export const callOpenRouter = async (messages, apiKey, model = 'openai/gpt-3.5-turbo') => {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://localhost:3000', // Optional
                'X-Title': 'Portfolio' // Optional
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: 500 // Limit response length to reduce costs
            })
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Status ${response.status}: ${errText}`);
        }
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content;
    } catch (e) {
        throw new Error(`OpenRouter Error: ${e.message}`);
    }
};
