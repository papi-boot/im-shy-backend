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
      // @Disconnect socket;
      socket.on("disconnect", () => {
        console.log(`A User disconnect ${socket.id}`);
        console.log(session.passport);
      });
    });
  }
}
