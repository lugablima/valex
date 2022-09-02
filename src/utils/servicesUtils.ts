export function checkIfItDoesNotExist(entity: any, code: string, message: string) {
    if(!entity) {
        throw { code, message };
    }
    return;
}

export function checkIfItExists(entity: any, code: string, message: string) {
    console.log("cheguei no utils");
    if(entity) {
        throw { code, message };
    }
    console.log("mas não aqui");
}

