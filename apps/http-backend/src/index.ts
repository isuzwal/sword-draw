import express from "express"
import router from "./controller/user-conter";
const app=express();
app.use(express.json())
const PORT=3001;
 app.get("/",(req,res)=>{
    res.send("Hello world")
 })
 app.use("/api/v1/sword-draw/user",router)
// Servering at 3000
app.listen(PORT,()=>{
    console.log("http server running on "+PORT
    )});