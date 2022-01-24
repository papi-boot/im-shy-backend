import { Socket } from "socket.io";
export class SocketConctroller {
  public initializeSocket(io: Socket): void {
    //@Connection sokcet;
    io.on("connection", (socket) => {
      const session = socket.request.session;
      console.log(`A user connected ${socket.id}`);
      console.log(session.passport);
      socket.on("test", (value: any) => {
        console.log(value, session.passport);
      });
      this.socketSendMessage(socket, io);
      this.socketAcceptUserChatList(socket, io);
      this.socketSendChatMessage(socket, io);
      this.socketTypingChat(socket, io);
      // @Disconnect socket;
      socket.on("disconnect", () => {
        console.log(`A User disconnect ${socket.id}`);
        console.log(session.passport);
      });
    });
  }

  // Socket Listener when someone send a message
  private socketSendMessage = (socket: Socket, io: Socket): void => {
    socket.on("send message", (value: any) => {
      console.log(`Reciever ID: ${value.reciever}`);
      io.emit("send message", { reciever: value.reciever });
    });
  };

  // Socket Listener when someone accept user on chat
  private socketAcceptUserChatList = (socket: Socket, io: Socket): void => {
    socket.on("accept chat", (value: any) => {
      console.log(`Accepted User: ${value.reciever}`);
      io.emit("accept chat", { reciever: value.reciever });
    });
  };

  // Socket Listener when sending message on chat
  private socketSendChatMessage = (socket: Socket, io: Socket): void => {
    socket.on("send chat-message", (value: any) => {
      console.log(value);
      io.emit("send chat-message", value);
    });
  };

  private socketTypingChat = (socket: Socket, io: Socket): void => {
    socket.on("typing chat", (value: any) => {
      socket.broadcast.emit("typing chat", value);
    });
  };
}
