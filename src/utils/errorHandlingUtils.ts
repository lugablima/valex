export function notSend(entity: string) {
    return { code: "NotSent", message: `${entity} not sent!` };
}

export function notFound(entity: string) {
    return { code: "NotFound", message: `${entity} not found!` };
}

export function invalid(entity: string) {
    return { code: "Invalid", message: `Invalid ${entity}!` };
}

export function expired(entity: string) {
    return { code: "Expired", message: `Expired ${entity}!` };
}

export function notActivated(entity: string) {
    return { code: "NotActivated", message: `${entity} not activated!` };
}

export function activated(entity: string) {
    return { code: "Activated", message: `Activated ${entity}!` };
}

export function blocked(entity: string) {
    return { code: "Blocked", message: `Blocked ${entity}!` };
}

export function unlocked(entity: string) {
    return { code: "Unlocked", message: `${entity} unlocked!` };
}

export function insufficient(entity: string) {
    return { code: "Insufficient", message: `Insufficient ${entity}!` };
}

export function typeConflict(entity: string) {
    return { code: "TypeConflict", message: `${entity} has a type conflict!` };
}

export function differentTypes(entities: string) {
    return { code: "DifferentTypes", message: `${entities} are of different types!` };
}

export function notRegistered(entity: string) {
    return { code: "NotRegistered", message: `There is no registered ${entity}!` };
}
