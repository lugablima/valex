import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

export default function validateSchema(schema: Schema) {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body, { abortEarly: false });

		if (error) {
			return res.status(422).send(error.details.map((err) => ({ message: err.message })));
		}

		next();
	};
}
