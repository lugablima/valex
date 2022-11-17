import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "utils/errorHandlingUtils";

export default function errorHandlerMiddleware(
	error: ApplicationError | Error,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	if (error.name === "NotSent") {
		return res.status(400).send(error.message);
	}

	if (
		error.name === "Invalid" ||
		error.name === "Expired" ||
		error.name === "NotActivated" ||
		error.name === "Insufficient" ||
		error.name === "DifferentTypes"
	) {
		return res.status(401).send(error.message);
	}

	if (error.name === "NotFound") {
		return res.status(404).send(error.message);
	}

	if (
		error.name === "TypeConflict" ||
		error.name === "Activated" ||
		error.name === "Blocked" ||
		error.name === "Unlocked"
	) {
		return res.status(409).send(error.message);
	}

	return res.sendStatus(500);
}
