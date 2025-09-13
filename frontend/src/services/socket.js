import { io } from "socket.io-client";

const serverUrl = "http://localhost:3000";


export const socket = io (serverUrl , {
    query : {
        userId : localStorage.getItem("userId")
    }
}

)