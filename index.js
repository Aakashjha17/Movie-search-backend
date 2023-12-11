import  express  from 'express';
import connectDB from './config/connectdb.js'
import dotenv from 'dotenv'
import moviesRoutes from './routes/moviesRoutes.js'
import cors from 'cors'
dotenv.config()

const app = express();
const port=process.env.PORT || 8000
const DATABASE_URL=process.env.DATABASE_URL
connectDB(DATABASE_URL)

app.use(cors())
app.use(express.json())
app.listen(port,()=>{
    console.log(`server live on port: ${port}`)
})

app.use("/movie",moviesRoutes)