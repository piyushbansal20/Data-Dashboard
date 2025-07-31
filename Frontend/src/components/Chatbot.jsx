import React, { useState } from 'react';
import { api } from '../api';
import { Bot, User, Send } from 'lucide-react';

const Button = ({ children, ...props }) => (
    <button {...props} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2">
        {children}
    </button>
);

const Chatbot = ({ collectionName }) => {
    const [question, setQuestion] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!question.trim() || isLoading) return;

        const newHistory = [...history, { role: 'user', text: question }];
        setHistory(newHistory);
        setQuestion('');
        setIsLoading(true);

        try {
            const { data } = await api.post('/chatbot', { question, collectionName });
            setHistory([...newHistory, { role: 'bot', text: data.answer }]);
        } catch (err) {
            console.error("Chatbot error:", err);
            setHistory([...newHistory, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {history.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'bot' && <div className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0"><Bot size={18} /></div>}
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.role === 'user' && <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0"><User size={18} /></div>}
                    </div>
                ))}
                {isLoading && <div className="text-sm text-gray-500">Bot is thinking...</div>}
            </div>
            <div className="p-4 border-t bg-white rounded-b-lg">
                <div className="relative">
                    <input
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder={`Ask about ${collectionName}...`}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 pr-12 text-sm"
                    />
                    <Button onClick={handleSend} disabled={isLoading} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                        <Send size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
