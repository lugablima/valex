export type ApplicationError = {
	name: string;
	message: string;
};

export function unsentEntityError(entity: string) {
	return { name: "UnsentEntityError", message: `${entity} not sent!` };
}

export function notFoundError(entity: string) {
	return { name: "NotFoundError", message: `${entity} not found!` };
}

export function invalidCredentialsError(entity: string) {
	return { name: "InvalidCredentialsError", message: `Invalid ${entity}!` };
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

export function conflictError(entity: string) {
	return { name: "ConflictError", message: `${entity} has a type conflict!` };
}

export function differentTypesError(entities: string) {
	return { name: "DifferentTypesError", message: `${entities} are of different types!` };
}

export function unauthorizedError(entities: string) {
	return { name: "UnauthorizedError", message: `${entities} are of different types!` };
}

// export function notRegistered(entity: string) {
// 	return { name: "NotRegistered", message: `There is no registered ${entity}!` };
// }
