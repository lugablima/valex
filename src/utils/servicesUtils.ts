export function validateIfTheEntityDoesNotExist(entity: any, code: string, message: string) {
    if(!entity) {
        throw { code, message };
    }
}

export function validateIfTheEntityExists(entity: any, code: string, message: string) {
    if(entity) {
        throw { code, message };
    }
}