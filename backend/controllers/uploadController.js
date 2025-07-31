import mongoose from 'mongoose';

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }

        // 1. Extract and parse file content
        const jsonString = req.file.buffer.toString('utf-8');
        const jsonData = JSON.parse(jsonString);

        // 2. Ensure data is an array and not empty
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        if (dataArray.length === 0) {
            return res.status(400).json({ message: 'JSON file cannot be empty.' });
        }

        // 3. Sanitize filename to create a valid collection name
        const originalName = req.file.originalname;
        const baseName = originalName
            .split('.')[0] // Remove file extension
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '_'); // Replace invalid characters with underscores

        // 4. Get the collection and clear it before inserting new data
        const collection = mongoose.connection.db.collection(baseName);
        await collection.deleteMany({}); // Ensures fresh data on every upload

        // 5. Insert the new data
        const result = await collection.insertMany(dataArray);

        res.status(201).json({
            message: `Successfully inserted ${result.insertedCount} documents into the "${baseName}" collection.`,
            collectionName: baseName,
        });

    } catch (error) {
        console.error("Upload failed:", error);
        // Pass the error to a dedicated error-handling middleware
        next(error);
    }
};
