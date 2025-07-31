import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import DropdownMenu from './components/DropdownMenu';
import ChartViewer from './components/ChartViewer';
import TableViewer from './components/TableViewer';
import Chatbot from './components/Chatbot';
import Metrics from './components/Metrics';
import { api } from './api';

// Reusable UI Components for a consistent look
const Card = ({ children }) => <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">{children}</div>;
const CardHeader = ({ children }) => <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-200">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold text-gray-800">{children}</h3>;
const CardContent = ({ children }) => <div>{children}</div>;

const App = () => {
    const [collectionName, setCollectionName] = useState('');
    const [outputType, setOutputType] = useState('pie'); // Default to pie to test the fix
    const [viewData, setViewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!collectionName) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            setViewData(null);

            let endpoint = '';


            if (outputType === 'bar') {

                endpoint = `/charts/bar-growth?collectionName=${collectionName}`;
            }
            else if (outputType === 'pie') {
                let groupBy = '';
                let valueField = '';


                if (collectionName.includes('d')) {
                    groupBy = 'Region';
                    valueField = 'Yearly Revenue';
                } else if (collectionName.includes('e')) {
                    groupBy = 'Customer Name';
                    valueField = 'Total Revenue';
                } else if (collectionName.includes('c')) {
                    groupBy = 'Country';
                    valueField = 'Yearly Revenue';
                } else {

                    groupBy = 'Customer Name';
                    valueField = 'Quarter 3 Revenue';
                }

                endpoint = `/charts/pie?collectionName=${collectionName}&groupBy=${groupBy}&valueField=${valueField}`;

            }
            else if (outputType === 'table') {
                endpoint = `/charts/table?collectionName=${collectionName}`;
            } else {
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await api.get(endpoint);
                console.log("Fetching pie chart with", { endpoint });


                if (!data || data.length === 0) {
                    throw new Error(`No data could be generated for this chart type. Please ensure the '${collectionName}' file contains the necessary data fields.`);
                }

                if (outputType === 'bar') {
                    setViewData({
                        labels: data.map(d => d['Customer Name']),
                        datasets: [{
                            label: 'Revenue Value', // Made label more generic
                            data: data.map(d => d.growth),
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        }]
                    });
                } else if (outputType === 'pie') {
                    setViewData({
                        labels: data.map(d => d.name),
                        datasets: [{
                            label: 'Total Revenue',
                            data: data.map(d => d.value),
                            backgroundColor: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'],
                        }]
                    });
                } else {
                    setViewData(data); // For table view
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message || `Failed to fetch data. The selected collection may not be suitable for this view.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [collectionName, outputType]);


    const renderContent = () => {
        if (isLoading) return <div className="text-center p-10">Loading data...</div>;
        if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

        switch (outputType) {
            case 'metrics': return <Metrics collectionName={collectionName} />;
            case 'bar':
            case 'pie': return <ChartViewer chartType={outputType} chartData={viewData} collectionName={collectionName} />;
            case 'table': return <TableViewer rows={viewData} />;
            case 'chatbot': return <Chatbot collectionName={collectionName} />;
            default: return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Data Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">Instantly upload, visualize, and chat with your data.</p>
                </header>

                <FileUploader onUploadSuccess={setCollectionName} />

                {collectionName && (
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Explore Your Data: <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">{collectionName}</span></CardTitle>
                            <DropdownMenu outputType={outputType} setOutputType={setOutputType} />
                        </CardHeader>
                        <CardContent>
                            {renderContent()}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default App;
