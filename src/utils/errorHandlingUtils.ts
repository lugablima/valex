export type ApplicationError = {
	name: string;
	message: string;
};

export function unsentEntityError(message: string): ApplicationError {
	return { name: "UnsentEntityError", message: `${message} not sent!` };
}

export function notFoundError(message: string): ApplicationError {
	return { name: "NotFoundError", message: `${message} not found!` };
}

export function invalidCredentialsError(message?: string): ApplicationError {
	return { name: "InvalidCredentialsError", message: message ? `Invalid ${message}!` : `Invalid credentials!` };
}

// export function expired(entity: string) {
// 	return { name: "Expired", message: `Expired ${entity}!` };
// }

// export function notActivated(entity: string) {
// 	return { name: "NotActivated", message: `${entity} not activated!` };
// }

// export function activated(entity: string) {
// 	return { name: "Activated", message: `Activated ${entity}!` };
// }

// export function blocked(entity: string) {
// 	return { name: "Blocked", message: `Blocked ${entity}!` };
// }

// export function unlocked(entity: string) {
// 	return { name: "Unlocked", message: `${entity} unlocked!` };
// }

// export function insufficient(entity: string) {
// 	return { name: "Insufficient", message: `Insufficient ${entity}!` };
// }

export function conflictError(message: string): ApplicationError {
	return { name: "ConflictError", message };
}

// export function differentTypesError(entities: string): ApplicationError {
// 	return { name: "DifferentTypesError", message: `${entities} are of different types!` };
// }

export function unauthorizedError(message: string): ApplicationError {
	return { name: "UnauthorizedError", message };
}

// export function notRegistered(entity: string) {
// 	return { name: "NotRegistered", message: `There is no registered ${entity}!` };
// }
