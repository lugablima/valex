export function throwError(code: string, message: string) {
    throw { code, message };
}

export function checkIfItExists(entity: any, code: string, message: string) {
    console.log("cheguei no utils");
    if(entity) {
        throw { code, message };
    }
    console.log("mas não aqui");
}

