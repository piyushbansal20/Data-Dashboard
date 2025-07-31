import React, { useEffect, useState } from 'react';
import { api } from '../api';

// Reusable Card components for consistent styling
const Card = ({ children }) => <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">{children}</div>;
const CardHeader = ({ children }) => <div className="pb-2">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-sm font-medium text-gray-500 truncate">{children}</h3>;
const CardContent = ({ children }) => <div>{children}</div>;

const MetricsViewer = ({ collectionName }) => {
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!collectionName) return;
        setMetrics(null);
        setError('');
        api.get(`/metrics?collectionName=${collectionName}`)
            .then(({ data }) => setMetrics(data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load metrics.');
            });
    }, [collectionName]);

    if (error) return <div className="text-red-500">{error}</div>;
    if (metrics === null) return <div>Loading Metrics...</div>;
    if (Object.keys(metrics).length === 0) return <div>No numeric metrics found in this dataset.</div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]) => (
                <Card key={key}>
                    <CardHeader>
                        <CardTitle>{key.replace(/_/g, ' ')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default MetricsViewer;
