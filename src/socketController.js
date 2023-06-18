const express = require("express");
const app = express();
const { v4 } = require("uuid");
const { Server } = require("socket.io");
const server = require("http").createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
let roomId = {
    roomNo: null,
    playerOne: null,
    playerTwo: null,
};

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("message", (message) => {
        console.log(message);
    });
    socket.on("disconnect", () => {
        console.log(`disconnected ${socket.id}`);
    });
    socket.on("join_game", async (name) => {
        if (roomId.roomNo) {
            roomId.playerTwo = socket.id;
            await socket.join(roomId.roomNo);
            // console.log(
            //     `User with id ${socket.id} and name ${name} joined room with id ${roomId.roomNo}`
            // );
            let random = Math.random() * 10;
            if (random > 5) {
                io.to(roomId.playerOne).emit("joined", {
                    room: roomId,
                    firstMove: true,
                });
                io.to(roomId.playerTwo).emit("joined", {
                    room: roomId,
                    firstMove: false,
                });
            } else {
                io.to(roomId.playerOne).emit("joined", {
                    room: roomId,
                    firstMove: false,
                });
                io.to(roomId.playerTwo).emit("joined", {
                    room: roomId,
                    firstMove: true,
                });
            }
            roomId.roomNo = undefined;
        } else {
            roomId.roomNo = v4();
            roomId.playerOne = socket.id;
            await socket.join(roomId.roomNo);
            // console.log(
            //     `User with id ${socket.id} with name ${name} first joined room with id ${roomId.roomNo}`
            // );
        }
    });
    socket.on("sendGamestate", async (data) => {
        // console.log(data);
        socket.to(data.room).emit("receiveGameState", data);
    });
});

module.exports = server;
