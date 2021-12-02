import { Socket } from "socket.io";
export class SocketConctroller {
  public initializeSocket(io: Socket): void {
    io.on("connection", (socket) => {
      const session = socket.request.session;
      console.log(`A user connected ${socket.id}`);
      socket.on("test", (value: any) => {
        console.log(value, session.passport);
      });
      // @Disconnect socket;
      this.onSocketDisconnect(socket, session);
    });
  }
  public onSocketDisconnect(socket: Socket, session: any): void {
    socket.on("disconnect", () => {
      console.log(`A User disconnect ${socket.id}`);
      console.log(session.passport);
    });
  }
}
