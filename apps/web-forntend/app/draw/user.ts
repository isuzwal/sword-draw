import axios from "axios";
import { HTTP_BACKNED } from "../config";

export const  Userdata=async()=>{
    const token = localStorage.getItem("token");
  
    try {
        const res = await axios.get(`${HTTP_BACKNED}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
     return res.data
}catch(error){
    console.log("Error at user Infromation",error)
    return error
}
}