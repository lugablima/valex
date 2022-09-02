import Cryptr from "cryptr";

export function generateNameOnCard(fullName: string): string {
    const arrayOfTheName: string[] = fullName.toUpperCase().split(" ");

    if(arrayOfTheName.length === 1) return arrayOfTheName[0]; 

    let nameOnCard: string = arrayOfTheName[0];

    for(let i = 1; i < arrayOfTheName.length - 1; i++) {
        const middleName: string = arrayOfTheName[i];  

        if(middleName.length >= 3) {
            nameOnCard += " " + middleName[0];
        }
    }

    nameOnCard += " " + arrayOfTheName[arrayOfTheName.length - 1];

    return nameOnCard;
}

export function configureCryptr(): Cryptr {
    const cvcSecretKey: string = process.env.CVC_SECRET_KEY ? process.env.CVC_SECRET_KEY : "secret"; 
    const cryptr: Cryptr = new Cryptr(cvcSecretKey);
    return cryptr;
}

export function encryptCvc(cvc: string): string {
    const cryptr: Cryptr = configureCryptr();
    const encryptedCvc: string = cryptr.encrypt(cvc);
    return encryptedCvc;
}

export function decryptCvc(encryptedCvc: string): string {
    const cryptr: Cryptr = configureCryptr();
    const decryptedCvc: string = cryptr.decrypt(encryptedCvc);
    return decryptedCvc;
}
