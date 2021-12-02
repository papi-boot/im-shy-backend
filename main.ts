require("./config/module.config");
import dotenv from "dotenv";
dotenv.config().parsed;
import { ServerUtil } from "./utils/server.util";
import { Routes } from "./route/routes";
export class Main extends ServerUtil {
  public PORT: number | any = process.env.PORT || 3030;
  public startRouting(route: any): void {
    this.app.use(route);
  }
  public startServerListen(): void {
    try {
      this.httpServer.listen(this.PORT, () => {
        console.log(`Server start at PORT: ${this.PORT}`);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

const main = new Main();
const routes = new Routes();
main.startServerMiddleWare();
main.startRouting(routes.POST_REQUEST());
main.startRouting(routes.GET_REQUEST());
main.startRouting(routes.PUT_REQUEST());
main.startRouting(routes.DELETE_REQUEST());
main.startServerListen();
