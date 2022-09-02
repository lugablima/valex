import { Request, Response, NextFunction } from "express";

export default function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    if(error.code === "Error_Api_Key_Not_Sent" || error.code === "Error_Invalid_Api_Key" || error.code === "Error_Invalid_Employee") {
        return res.status(401).send(error.message);
    }

    if(error.code === "Error_Card_Type_Conflict") {
        return res.status(409).send(error.message);
    }

    return res.sendStatus(500);
}