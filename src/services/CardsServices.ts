import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import { Employee, findById } from '../repositories/employeeRepository.js';
import { findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { CRYPTR_PASSWORD } from '../utils/mock.js';
import dayjs from 'dayjs';


export async function createNewCard(apiKey: string | string[], cardInfo: any) {
    const { cardType, employeeId } = cardInfo;
    const cryptr = new Cryptr(`${CRYPTR_PASSWORD}`);

    await checkApiValidity(apiKey);
    const employee = await checkEmployeeExistance(employeeId);
    await checkIfEmployeeAlreadyHasThisCard(cardType, employeeId);

    const number = faker.finance.creditCardNumber();
    const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());
    const cardholderName = getCardUsername(employee);
    const expirationDate = getExpirationDate();

    const card = { employeeId, number, cardholderName, securityCode, expirationDate, type: cardType, isVirtual: false, isBlocked: false };

    await insert(card);

    const cvv = cryptr.decrypt(securityCode);
    return cvv;
}

// auxiliary functions

async function checkApiValidity(apiKey: string | string[]) {
    const dataFromApi = await findByApiKey(apiKey);

    if (!dataFromApi) throw { type: "error_company_notFound", message: "Insert a valid API KEY" };
}

async function checkEmployeeExistance(employeeId: number) {
    const employee = await findById(employeeId);

    if (!employee) throw { type: "error_employee_notFound", message: "Insert a valid employee ID" };
    else return employee;
}

async function checkIfEmployeeAlreadyHasThisCard(cardType: any, employeeId: number) {
    const isThereSuchEmployee = await findByTypeAndEmployeeId(cardType, employeeId);

    if (isThereSuchEmployee) throw { type: "error_employee_hasCard", message: "Employee already has this card" };
    else return 'oi';
}

function getCardUsername(employee: Employee) {
    const { fullName } = employee;
    const nameArray = fullName.split(" ");
    const formatedName = [];

    for (let i = 0; i < nameArray.length; i++) {
        if (i === 0 || i === nameArray.length - 1) formatedName.push(nameArray[i].toUpperCase());
        else if (nameArray[i].length >= 3) formatedName.push(nameArray[i][0].toUpperCase());
    }

    return formatedName.join(" ");
}

function getExpirationDate() {
    const year = parseInt(dayjs().format('YY')) + 5;
    const month = dayjs().format('MM');

    return `${month}/${year}`
}