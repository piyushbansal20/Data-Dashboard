import mongoose from 'mongoose';

export const getChartData = async (req, res, next) => {
    const { type } = req.params;
    const { collectionName, groupBy, valueField } = req.query;

    if (!collectionName) {
        return res.status(400).json({ error: 'collectionName query parameter is required.' });
    }

    try {
        const collection = mongoose.connection.db.collection(collectionName);
        // Get a sample document to inspect its structure
        const sampleDoc = await collection.findOne({});

        if (!sampleDoc) {
            return res.json([]); // Return empty if collection has no data
        }

        if (type === 'bar-growth') {
            const hasQ3Revenue = sampleDoc.hasOwnProperty('Quarter 3 Revenue');
            const hasQ4Revenue = sampleDoc.hasOwnProperty('Quarter 4 Revenue');
            let pipeline = [];

            // --- PRIMARY LOGIC: Calculate growth if quarterly data exists ---
            if (hasQ3Revenue && hasQ4Revenue) {
                pipeline = [
                    {
                        $match: {
                            "Quarter 3 Revenue": { $type: "number" },
                            "Quarter 4 Revenue": { $type: "number" }
                        }
                    },
                    {
                        $addFields: {
                            growth: { $subtract: ['$Quarter 4 Revenue', '$Quarter 3 Revenue'] }
                        }
                    },
                    { $sort: { growth: -1 } },
                    { $limit: 10 }
                ];
            }
            // --- FALLBACK LOGIC: If no quarterly data, find the best single revenue field ---
            else {
                const revenueKeys = ['Total Revenue', 'Yearly Revenue', 'Revenue'];
                const labelKeys = ['Customer Name', 'Country', 'Region'];

                const bestValueField = revenueKeys.find(key => sampleDoc.hasOwnProperty(key) && typeof sampleDoc[key] === 'number');
                const bestLabelField = labelKeys.find(key => sampleDoc.hasOwnProperty(key));

                if (!bestValueField || !bestLabelField) {
                    // If no suitable fields are found, return an empty array to avoid errors
                    return res.json([]);
                }

                pipeline = [
                    { $match: { [bestValueField]: { $exists: true, $type: 'number' } } },
                    { $sort: { [bestValueField]: -1 } },
                    { $limit: 10 },

                    { $project: {
                            _id: 0,
                            'Customer Name': `$${bestLabelField}`,
                            growth: `$${bestValueField}`
                        }}
                ];
            }
            const data = await collection.aggregate(pipeline).toArray();
            return res.json(data);
        }

        if (type === 'pie') {
            // --- DYNAMIC PIE CHART LOGIC ---

            let bestGroupBy = groupBy;
            let bestValueField = valueField;

            if (!bestGroupBy || !bestValueField) {
                const labelKeys = ['Country', 'Customer Name', 'Region'];
                const revenueKeys = ['Yearly Revenue', 'Total Revenue', 'Revenue'];

                bestGroupBy = labelKeys.find(key => sampleDoc.hasOwnProperty(key));
                bestValueField = revenueKeys.find(key => sampleDoc.hasOwnProperty(key) && typeof sampleDoc[key] === 'number');
            }

            if (!bestGroupBy || !bestValueField) {
                // If no suitable fields are found, return an empty array
                return res.json([]);
            }

            const data = await collection.aggregate([
                { $match: { [bestValueField]: { $exists: true, $type: "number" } } },
                {
                    $group: {
                        _id: `$${bestGroupBy}`,
                        totalValue: { $sum: `$${bestValueField}` }
                    }
                },
                { $sort: { totalValue: -1 } },
                { $limit: 8 },
                {
                    $project: {
                        _id: 0,
                        name: '$_id',
                        value: '$totalValue'
                    }
                }
            ]).toArray();
            return res.json(data);
        }

        if (type === 'table') {
            const allData = await collection.find({}).limit(100).toArray();
            return res.json(allData);
        }

        return res.status(400).json({ error: 'Invalid chart type specified.' });

    } catch (error) {
        console.error(`Error fetching chart data for type "${type}":`, error);
        next(error);
    }
};
