import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtdHd3eXEzOTAwMDB1cDNjdG9sdGc0anIiLCJyb2xlIjoiQ3VzdG9tZXIiLCJpYXQiOjE3ODk0NjU0MDEsImV4cCI6MTc5MDA3MDIwMX0.w3mnVAsWeaRjm7ls_aFf-RzO4p82tx5ywl6uy7iwMr8",
  },
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to Socket.io server");
  console.log("Socket ID:", socket.id);
  socket.emit("joinTicket", "cmtwxbiih0001upjkktixy7hq");
});

socket.on("ticketJoined", (data) => {
  console.log("Joined ticket:", data);
});
socket.on("newMessage", (message) => {
  console.log("New message received:", message);
});
socket.on("newInternalMessage", (message) => {
  console.log("New message received:", message);
});
socket.on("ticketError", (error) => {
  console.log("Ticket error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.io server");
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});
