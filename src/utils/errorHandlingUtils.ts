export type ApplicationError = {
	name: string;
	message: string;
};

export function notSend(entity: string) {
	return { name: "NotSent", message: `${entity} not sent!` };
}

export function notFound(entity: string) {
	return { name: "NotFound", message: `${entity} not found!` };
}

export function invalid(entity: string) {
	return { name: "Invalid", message: `Invalid ${entity}!` };
}

export function expired(entity: string) {
	return { name: "Expired", message: `Expired ${entity}!` };
}

export function notActivated(entity: string) {
	return { name: "NotActivated", message: `${entity} not activated!` };
}

export function activated(entity: string) {
	return { name: "Activated", message: `Activated ${entity}!` };
}

export function blocked(entity: string) {
	return { name: "Blocked", message: `Blocked ${entity}!` };
}

export function unlocked(entity: string) {
	return { name: "Unlocked", message: `${entity} unlocked!` };
}

export function insufficient(entity: string) {
	return { name: "Insufficient", message: `Insufficient ${entity}!` };
}

export function typeConflict(entity: string) {
	return { name: "TypeConflict", message: `${entity} has a type conflict!` };
}

export function differentTypes(entities: string) {
	return { name: "DifferentTypes", message: `${entities} are of different types!` };
}

export function notRegistered(entity: string) {
	return { name: "NotRegistered", message: `There is no registered ${entity}!` };
}
