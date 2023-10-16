import { io } from "socket.io-client";
import { baseURL } from "../constants";

let socket = io.connect(baseURL);

socket.on("connect", () => {
  console.log("Socket Connected");
  //   socket = io.connect(baseURL);
});

socket.on("disconnect", (socket) => {
  console.log("Disconnected, Connecting again", socket);
  //   socket = io.connect(baseURL);
});

export default socket;
