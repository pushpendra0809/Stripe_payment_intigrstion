import express from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()
import Payment from "./Payment/Payment.js"
import Embedded from "./Payment/Embedded_payment.js"
import Custom from "./Payment/Custom_payment.js"

const app = express()

const PORT =   8000

app.use(cors())

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.send("wellcome to Strip Payment GetWay")
})

app.use("/hosted", Payment)
app.use("/embedded", Embedded)
app.use("/custom", Custom)

app.listen(PORT,()=>{
    console.log(`server run on http://localhost:${PORT}`)
})



