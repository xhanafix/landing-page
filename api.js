class AIApi {
    static async generateContent(prompt) {
        const apiKey = CONFIG.getApiKey();
        if (!apiKey) {
            throw new Error('API key not found');
        }

        const selectedModel = CONFIG.getSelectedModel();
        const modelConfig = CONFIG.MODELS[selectedModel];

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AI Sales Page Generator'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional copywriter specializing in Bahasa Malaysia sales pages.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: modelConfig.temperature,
                    max_tokens: modelConfig.max_tokens
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating content:', error);
            throw error;
        }
    }
} 