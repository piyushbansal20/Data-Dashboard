import React from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownMenu = ({ outputType, setOutputType }) => (
    <div className="relative">
            <select
                value={outputType}
                onChange={e => setOutputType(e.target.value)}
                className="h-10 pl-3 pr-8 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
                    <option value="metrics">Key Metrics</option>
                    <option value="bar">Bar Chart (Growth)</option>
                    <option value="pie">Pie Chart (Revenue)</option>
                    <option value="table">Table View</option>
                    <option value="chatbot">AI Chatbot</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
);

export default DropdownMenu;
