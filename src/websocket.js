"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
var http_1 = require("./http");
var users = [];
exports.users = users;
var messages = [];
http_1.io.on("connection", function (socket) {
    socket.on("room", function (data, cb) {
        console.log(data);
        socket.join(data.room);
        var userInRoom = users.find(function (user) { return user.user === data.user && user.room === data.room; });
        var countUsers = users.filter(function (user) { return user.room === data.room; }).length;
        if (userInRoom) {
            userInRoom.socketId = socket.id;
            // cb({ error: "User already exist" })
        }
        else {
            users.push({
                room: data.room,
                user: data.user,
                socketId: socket.id
            });
        }
        var messagesList = getMessages(data.room);
        cb({ messagesList: messagesList, countUsers: countUsers });
    });
    socket.on('message', function (data) {
        var message = {
            room: data.room,
            user: data.user,
            message: data.message,
            createdAt: new Date()
        };
        messages.push(message);
        console.log(data);
        http_1.io.to(data.room).emit("message", message);
    });
});
function getMessages(room) {
    var messagesList = messages.filter(function (message) { return message.room === room; });
    return messagesList;
}
