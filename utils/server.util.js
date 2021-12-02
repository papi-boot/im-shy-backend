import { createServer } from "http";
import { Server } from "socket.io";
import { SocketListener } from "./socket.listener";
import { corsOptions } from "../config/cors.option";
import { Sequelize } from "sequelize";
import { SocketConctroller } from "../controller/socket/socket.controller";
import express from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
const SequelizeStore = require("connect-session-sequelize")(session.Store);

let dbOption = {
  connectionString: "",
  connectionOption: {},
};
if (process.env.NODE_ENV === "production") {
  dbOption.connectionString = process.env.DATABASE_URL;
  dbOption.connectionOption = {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  };
} else {
  dbOption.connectionString = process.env.DATABASE_URL;
  dbOption.connectionOption = {
    dialect: "postgres",
    logging: false,
  };
}
const sequelize = new Sequelize(dbOption.connectionString, dbOption.connectionOption);
const sessionConfig = {
  store: new SequelizeStore({
    db: sequelize,
  }),
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    secure: process.env.NODE_ENV === "production" ? true : "auto",
  },
  proxy: true,
};
export class ServerUtil {
  app = express();
  httpServer = createServer(this.app);
  io = new Server(this.httpServer, { cors: corsOptions });
  SECRET_KEY = process.env.SECRET_KEY;
  sl = new SocketListener();
  socketController = new SocketConctroller();

  startServerMiddleWare() {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.set("trust proxy", 1);
    const sessionMiddleWare = session(sessionConfig);
    this.io.use((socket, next) => {
      sessionMiddleWare(socket.request, {}, next);
    });
    this.app.use(sessionMiddleWare);
    sequelize.sync();
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.socketController.initializeSocket(this.io);
  }
}
