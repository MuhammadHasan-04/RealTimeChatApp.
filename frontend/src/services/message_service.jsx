import axios from "axios";

const baseURL = "http://localhost:3000/api";


export const getUsers = async (token)=>{
   const res = await axios.get(`${baseURL}/messages/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;

}

export const getMessages = async(recieverId , token)=>{
    const res = await axios.get(`${baseURL}/messages/${recieverId}` ,{
    headers: { Authorization: `Bearer ${token}` },} )

    return res.data;
}

export const sendMessage = async(text , recieverId , token)=>{
    const res = await axios.post(`${baseURL}/messages/${recieverId}` , {text} , {
    headers: { Authorization: `Bearer ${token}` }, } )

    return res.data
}



