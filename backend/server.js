import express from 'express'
import 'dotenv/config';
import cors from 'cors'
import connectDB from "./config/mongodb.js"
import routes from "./routes/index.js"


const app = express()
const PORT = 3000

app.use(cors());
app.use(express.json())
app.use('/api', routes);



connectDB();

app.server = app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}/`)
})
