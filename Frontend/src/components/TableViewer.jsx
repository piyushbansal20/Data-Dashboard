import React from 'react';

const TableViewer = ({ rows }) => {
    console.log("rows in TableViewer:", rows);

    if (!Array.isArray(rows)) {
        return <div className="text-red-600 text-center">Table data format is incorrect.</div>;
    }

    if (rows.length === 0) return <div className="text-center p-10">No data available for this table.</div>;

    const validRows = rows.filter(row => typeof row === 'object' && row !== null);
    if (validRows.length === 0) return <div>No valid data to display in the table.</div>;

    const headers = Object.keys(validRows[0]);

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    {headers.map(key => (
                        <th key={key} scope="col" className="px-6 py-3 sticky top-0 bg-gray-50">
                            {key.replace(/_/g, ' ')}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {validRows.map((row, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                        {headers.map(header => (
                            <td key={`${idx}-${header}`} className="px-6 py-4 whitespace-nowrap">
                                {typeof row[header] === 'number'
                                    ? row[header].toLocaleString()
                                    : String(row[header])}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableViewer;
