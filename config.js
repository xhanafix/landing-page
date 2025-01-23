const CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    MODELS: {
        'google/gemini-2.0-flash-exp:free': {
            name: 'Gemini 2.0 Flash',
            temperature: 0.7,
            max_tokens: 2000
        },
        'google/learnlm-1.5-pro-experimental:free': {
            name: 'LearnLM 1.5 Pro',
            temperature: 0.7,
            max_tokens: 2000
        }
    },
    getApiKey: () => localStorage.getItem('openrouter_api_key'),
    setApiKey: (key) => localStorage.setItem('openrouter_api_key', key),
    getSelectedModel: () => localStorage.getItem('selected_model') || 'google/gemini-2.0-flash-exp:free',
    setSelectedModel: (model) => localStorage.setItem('selected_model', model)
}; 