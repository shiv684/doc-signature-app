
const express=require("express")
const cors=require("cors");
const dotenv=require("dotenv");
const connectedDB=require("./config/db")
dotenv.config()
connectedDB()
const app=express();
app.use(cors())
app.use(express.json())

const PORT=5000;

app.get("/",(req,res)=>{
    console.log("backend is running")
})

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/docs', require('./routes/doc.routes'))
app.use('/api/signatures', require('./routes/signature.routes'))

// uploads folder publicly accessible banao
app.use('/uploads', express.static('uploads'))

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})