import express from "express"
import router from "./controller/user-conter";
import cors from   "cors"

const app=express();
app.use(express.json())
const PORT=8000;
app.use(cors());

 app.get("/",(req,res)=>{
    res.send("Hello world")
 })
 app.use("/api/v1/sword-draw/user",router)
// Servering at 8000
app.listen(PORT,()=>{
    console.log("http server running on "+PORT
    )});