import express from "express";
export class SuccessHandler {
  public successResponse = async (statusNumber: number, res: express.Response, args: object): Promise<express.Response> => {
    return res.status(statusNumber).json({ ...args });
  };
}
