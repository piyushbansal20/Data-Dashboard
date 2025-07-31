import mongoose from 'mongoose';

export const askQuestion = async (req, res, next) => {
    const { question, collectionName } = req.body;
    if (!question || !collectionName) {
        return res.status(400).json({ message: 'Both question and collectionName are required.' });
    }

    try {

        const collection = mongoose.connection.db.collection(collectionName);
        const dataSample = await collection.find().limit(20).toArray();

        if (dataSample.length === 0) {
            return res.status(404).json({ message: 'No data found in collection to analyze.' });
        }

        const prompt = `You are a data analysis assistant. Based on the following JSON data from the '${collectionName}' collection, answer the user's question. Data snippet: ${JSON.stringify(dataSample, null, 2)}. Question: ${question}`;

        // Using fetch for Gemini API call
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        const answer = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";

        res.json({ answer });
    } catch (e) {
        console.error('Chatbot controller error:', e);
        next(e);
    }
};
