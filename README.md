# Data Dashboard

This is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to analyze JSON data. Users can upload JSON files, which are dynamically stored in MongoDB. The application then provides various data visualizations, including dynamic bar and pie charts, a table view, and key metrics. It also features an AI-powered chatbot using the Google Gemini API to answer natural language questions about the uploaded data.



## Features

- Dynamic JSON Upload: Upload any JSON file containing an array of objects.
- Dynamic MongoDB Collections: A new MongoDB collection is created on the fly based on the uploaded filename.
- Data Visualizations:
  - Horizontal Bar Chart: Displays top 10 revenue growth or top 10 values based on the data.
  - Pie Chart: Shows the top 8 revenue distributions by country or customer.
  - Table View: A paginated, searchable view of the raw data.
- Key Metrics: Automatically calculates and displays key numerical summaries.
- AI Chatbot: Interact with your data using natural language questions, powered by the Gemini API.


## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later recommended) [https://nodejs.org/](https://nodejs.org/)
- npm (comes with Node.js) or yarn [https://www.npmjs.com/](https://www.npmjs.com/), [https://yarnpkg.com/](https://yarnpkg.com/)
- A MongoDB Atlas account for your database [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- A Google AI Studio API Key for the Gemini chatbot [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## Access Link

https://data-dashboard-1-4di3.onrender.com/


## Project Setup Instructions

### 1. Backend Setup

Navigate to your backend project folder:

```bash
cd /path/to/your/backend-folder
```
### Create the Environment File (.env)
You need to create a .env file in the root of your backend folder. This file will store your secret keys and database connection string.
1. Create a new file named .env.
2. Copy the contents of the .env.example file below into your new .env file.

#### .env example

```bash
# MongoDB Atlas Connection String
# Replace <username>, <password>, and <cluster-url> with your actual credentials
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/yourDatabaseName?retryWrites=true&w=majority

# Google Gemini API Key
# Get your key from Google AI Studio
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Server Port (Optional)
PORT=3000

```
### Fill in your credentials

- **MONGO_URI**: Get this connection string from your [MongoDB Atlas dashboard](https://www.mongodb.com/cloud/atlas).  
  Replace the `<username>`, `<password>`, and `<cluster-url>` placeholders with your actual values.  
  Also, make sure to whitelist your IP address in the MongoDB Atlas network access settings.

- **GEMINI_API_KEY**: Paste the API key you generated from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Install Node Modules

Run the following command to install all the necessary backend dependencies listed in `package.json`:

```bash
npm install
```
### Run the Backend Server

To start the backend server, use one of the following commands:

```bash
# For development with automatic reloading (requires nodemon):
npm run dev

# For production
npm start
```
The backend API should now be running on http://localhost:3000.

### 2. Frontend Setup

Open a new terminal window and navigate to your frontend project folder:

```bash
cd /path/to/your/frontend-folder
```
### Install Node Modules

Run the following command to install all the necessary React dependencies:

```bash
npm install
```

### Run the React Application

To start the frontend development server, run:

```bash
npm start
```
