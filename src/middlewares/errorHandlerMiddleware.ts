import { Request, Response, NextFunction } from "express";

export default function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    if(error.code === "NotSent") {
        return res.status(400).send(error.message);
    }
    
    if(error.code === "Invalid" || 
    error.code === "Expired" ||
    error.code === "NotActivated" ||
    error.code === "Insufficient") {
        return res.status(401).send(error.message);
    }

    if(error.code === "NotFound") {
        return res.status(404).send(error.message);
    }

    if(error.code === "TypeConflict" || 
    error.code === "Activated" || 
    error.code === "Blocked" || error.code === "Unlocked") {
        return res.status(409).send(error.message);
    }

    return res.sendStatus(500);
}