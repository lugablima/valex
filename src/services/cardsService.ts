import "../setup";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";

function generateNameOnCard(fullName: string): string {
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

export async function createCard(data: { employeeId: number, type: cardRepository.TransactionTypes }, apiKey: string | undefined) {
    if(!apiKey) {
        throw { code: "Error_Api_Key_Not_Sent", message: "The api key was not sent" };
    }
    
    const company: companyRepository.Company | undefined = await companyRepository.findByApiKey(apiKey); 

    if(!company) {
        throw { code: "Error_Invalid_Api_Key", message: "The api key is invalid" };
    }

    const employee: employeeRepository.Employee | undefined = await employeeRepository.findById(data.employeeId); 

    if(!employee) {
        throw { code: "Error_Invalid_Employee", message: "This employee is not registered" };
    }

    const employeeCards: cardRepository.Card | undefined = await cardRepository.findByTypeAndEmployeeId(data.type, data.employeeId);

    if(employeeCards) {
        throw { code: "Error_Card_Type_Conflict", message: "There is already a card of this type registered for this user" };
    }

    const cardNumber: string = faker.finance.account(16);
    const nameOnCard: string = generateNameOnCard(employee.fullName);
    const expirationDate: string = dayjs().add(5, "year").format("MM/YY");
    const cvc: string = faker.finance.creditCardCVV();

    const cvcSecretKey: string = process.env.CVC_SECRET_KEY ? process.env.CVC_SECRET_KEY : "secret"; 

    const cryptr: Cryptr = new Cryptr(cvcSecretKey);
    const encryptedCvc: string = cryptr.encrypt(cvc);
    // const decryptedCvc = cryptr.decrypt(encryptedCvc);
    
    const card: cardRepository.CardInsertData = {
        number: cardNumber,
        employeeId: data.employeeId,
        cardholderName: nameOnCard,
        securityCode: encryptedCvc,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: true,
        type: data.type
    }
    
    await cardRepository.insert(card);
}

