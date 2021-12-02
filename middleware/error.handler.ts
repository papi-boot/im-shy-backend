import express from "express";
export class ErrorHandler {
  // @Bad request
  public error400(err: any, res: express.Response): express.Response {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong. Please try again or later", success: false });
  }
  // item already exist
  public errorGlobalResponse(statusCode: number, res: express.Response, args: object): express.Response {
    return res.status(statusCode).json({ ...args });
  }
}
