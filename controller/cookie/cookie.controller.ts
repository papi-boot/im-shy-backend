import express from "express";
export class CookieController {
  public checkCookie = async (req: express.Request, res: express.Response): Promise<any> => {
    console.log(req.session.passport);
  };
}
