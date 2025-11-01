import axios from "axios";
import { HTTP_BACKEND } from "../config";

export const  Userdata=async()=>{
    const token = localStorage.getItem("token");
    try {
    const res = await axios.get(`${HTTP_BACKEND}/me`, {
     headers: {
     Authorization: `Bearer ${token}`
      }
    });
     return res.data
}catch(error){
    return error
}
}