import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "utils/errorHandlingUtils";

export default function errorHandlerMiddleware(
	error: ApplicationError | Error,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	if (error.name === "UnsentEntityError") {
		return res.status(400).send({ message: error.message });
	}

	if (error.name === "InvalidCredentialsError" || error.name === "UnauthorizedError") {
		return res.status(401).send({ message: error.message });
	}

	if (error.name === "NotFoundError") {
		return res.status(404).send({ message: error.message });
	}

	if (error.name === "ConflictError") {
		return res.status(409).send({ message: error.message });
	}

	return res.status(500).send({ message: "Internal Server Error" });
}
