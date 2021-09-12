import { io } from "./http"

interface RoomUser {
   socketId: string;
   user: string;
   room: string;
}

interface Message {
   message: string;
   user: string;
   room: string;
   createdAt: Date;
}

const users: RoomUser[] = []

const messages: Message[] = []

io.on("connection", socket => {

   socket.on("room", (data, cb) => {
      console.log(data)

      socket.join(data.room)

      const userInRoom = users.find(user => user.user === data.user && user.room === data.room)

      const countUsers = users.filter(user => user.room === data.room).length

      if (userInRoom) {
         userInRoom.socketId = socket.id
         // cb({ error: "User already exist" })
      } else {
         users.push({
            room: data.room,
            user: data.user,
            socketId: socket.id
         })
      }

      const messagesList = getMessages(data.room)

      cb({messagesList, countUsers})
   })

   socket.on('message', data => {
      const message: Message = {
         room: data.room,
         user: data.user,
         message: data.message,
         createdAt: new Date()
      }

      messages.push(message)

      console.log(data)

      io.to(data.room).emit("message", message)
   })
})

function getMessages(room: string) {
   const messagesList = messages.filter(message => message.room === room)

   return messagesList
}

export { users }