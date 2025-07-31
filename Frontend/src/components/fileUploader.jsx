import React, { useState } from 'react';
import { api } from '../api';
import { Upload, FileJson } from 'lucide-react';

// Reusable components for consistent styling
const Button = ({ children, ...props }) => (
    <button {...props} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2">
        {children}
    </button>
);
const Card = ({ children }) => <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">{children}</div>;
const CardHeader = ({ children }) => <div className="mb-4 pb-3 border-b border-gray-200">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold text-gray-800">{children}</h3>;
const CardContent = ({ children }) => <div>{children}</div>;

const FileUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/json') {
            setFile(selectedFile);
            setMessage('');
        } else {
            setFile(null);
            setMessage('Please select a valid JSON file.');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please choose a file first!");
            return;
        }

        setIsLoading(true);
        setMessage('Uploading...');
        const formData = new FormData();
        formData.append("jsonFile", file);

        try {

            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(`Success! Collection '${res.data.collectionName}' created.`);
            onUploadSuccess(res.data.collectionName);
        } catch (err) {
            console.error("Upload error:", err);
            const errorMsg = err.response?.data?.message || "Upload failed. Please check the console and backend server.";
            setMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Upload Your JSON File</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label htmlFor="file-upload" className="flex-grow">
                            <div className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                                <span className="truncate">{file ? file.name : 'Select a JSON file...'}</span>
                                <FileJson className="h-4 w-4 text-gray-500" />
                            </div>
                            <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleFileChange} />
                        </label>
                        <Button type="submit" disabled={isLoading || !file}>
                            <Upload className="mr-2 h-4 w-4" />
                            {isLoading ? 'Uploading...' : 'Upload & Analyze'}
                        </Button>
                    </div>
                    {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
                </form>
            </CardContent>
        </Card>
    );
};

export default FileUploader;
