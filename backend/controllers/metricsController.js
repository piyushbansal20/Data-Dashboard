import mongoose from 'mongoose';

export const getMetrics = async (req, res, next) => {
    const { collectionName } = req.query;
    if (!collectionName) {
        return res.status(400).json({ error: 'collectionName query parameter is required.' });
    }
    try {

        const collection = mongoose.connection.db.collection(collectionName);

        const sampleDoc = await collection.findOne();
        if (!sampleDoc) return res.json({});

        const numericKeys = Object.keys(sampleDoc).filter(
            key => typeof sampleDoc[key] === 'number'
        );

        const groupStage = numericKeys.reduce((acc, key) => {
            acc[key] = { $sum: `$${key}` };
            return acc;
        }, { _id: null });

        const pipeline = [{ $group: groupStage }];
        const [result = {}] = await collection.aggregate(pipeline).toArray();
        delete result._id;

        res.json(result);
    } catch (e) {
        console.error(`Error fetching metrics for "${collectionName}":`, e);
        next(e);
    }
};
