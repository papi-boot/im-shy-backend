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
}
