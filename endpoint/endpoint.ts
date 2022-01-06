import listEndPoints from "express-list-endpoints";
import { ServerUtil } from "../utils/server.util";

class EndPoint extends ServerUtil {
  public displayEndpoint() {
    console.log(listEndPoints(this.app));
  }
}
const endPoint = new EndPoint();
endPoint.displayEndpoint();
