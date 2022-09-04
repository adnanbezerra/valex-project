import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import { Employee, findById } from '../repositories/employeeRepository.js';
import { findByCardNumber, findByTypeAndEmployeeId, insert, TransactionTypes, update } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { CRYPTR_PASSWORD } from '../utils/mock.js';
import bcrypt from 'bcrypt'
import dayjs from 'dayjs';
import { findByCardId, Recharge } from '../repositories/rechargeRepository.js';
import { findPaymentsByCardId, PaymentWithBusinessName } from '../repositories/paymentRepository.js';

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

    const card = { employeeId, number, cardholderName, securityCode, expirationDate, type: cardType, isVirtual: false, isBlocked: true };

    await insert(card);

    const cvv = cryptr.decrypt(securityCode);
    return cvv;
}

export async function createCardPassword(cardInfo: any) {
    const { CVC, cardIdentifier, newPassword } = cardInfo;
    const password = bcrypt.hashSync(newPassword, 10);
    const isBlocked = true;

    const creditCard = await checkCardIntegrity(CVC, cardIdentifier);

    const cardId = creditCard.id;

    await update(cardId, { password, isBlocked });
}

export async function generateCardBalance(cardNumber: string) {
    const { id: cardId } = await getCardIdByNumber(cardNumber);

    const rechargesList = await findByCardId(cardId);
    const paymentsList = await findPaymentsByCardId(cardId);

    const balance = getBalanceResult(rechargesList, paymentsList);

    const response = {
        balance,
        transactions: { ...paymentsList },
        recharges: { ...rechargesList }
    }

    return response;
}

export async function blockCard(cardNumber: string, password: string) {
    const creditCard = await getCardIdByNumber(cardNumber);

    if (compareExpirationDate(creditCard.expirationDate)) throw { type: "error_creditCard_expired", message: "This credit card has already expired!" }
    if (creditCard.isBlocked) throw { type: "error_creditCard_blocked", message: "This credit card is blocked!" }
    if (!bcrypt.compareSync(password, creditCard.password)) throw { type: "error_wrongPassword", message: "Insert the right password!" }

    await update(creditCard.id, { isBlocked: true });
}

export async function unblockCard(cardNumber: string, password: string) {
    const creditCard = await getCardIdByNumber(cardNumber);

    if (compareExpirationDate(creditCard.expirationDate)) throw { type: "error_creditCard_expired", message: "This credit card has already expired!" }
    if (!creditCard.isBlocked) throw { type: "error_creditCard_notBlocked", message: "This credit card is not blocked!" }
    if (!bcrypt.compareSync(password, creditCard.password)) throw { type: "error_wrongPassword", message: "Insert the right password!" }

    await update(creditCard.id, { isBlocked: false });
}


// auxiliary functions for createNewCard function

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

// auxiliary functions for createCardPassword function 

async function checkCardIntegrity(CVC: string, cardIdentifier: string) {
    const creditCard = await findByCardNumber(cardIdentifier);
    const cryptr = new Cryptr(`${CRYPTR_PASSWORD}`)

    if (!creditCard) throw { type: "error_cardIdentifier_NotFound", message: "Insert a valid card number!" }
    if (creditCard.password !== null) throw { type: "error_creditCard_alreadyActive", message: "This credit card is already active!" }

    if (CVC !== cryptr.decrypt(creditCard.securityCode)) throw { type: "invalid_creditCard_CVC", message: "Type in the right CVC!" }
    if (compareExpirationDate(creditCard.expirationDate)) throw { type: "error_creditCard_expired", message: "This credit card has already expired!" }

    return creditCard;
}

function compareExpirationDate(date: string): boolean {
    const yearNow = parseInt(dayjs().format('YY'));
    const monthNow = parseInt(dayjs().format('MM'));

    const [expirationYear, expirationMonth] = date.split("/");

    if (yearNow > parseInt(expirationYear)) return false;
    else if (yearNow === parseInt(expirationYear)) {
        if (monthNow > parseInt(expirationMonth)) return false;
    }

    return true;
}

// auxiliary functions for generateCardBalance function

function getBalanceResult(rechargesList: Recharge[], paymentsList: PaymentWithBusinessName[]) {
    return getRechargesAmount(rechargesList) - getRechargesAmount(paymentsList);
}

function getRechargesAmount(balanceData: Recharge[] | PaymentWithBusinessName[]) {
    let result = 0;

    for (let data of balanceData) {
        result += data.amount;
    }

    return result;
}

async function getCardIdByNumber(cardNumber: string) {
    const creditCard = await findByCardNumber(cardNumber);
    if (!creditCard) throw { type: "invalid_creditCard_Number", message: "Credit card number not found!" };

    return creditCard;
}

// auxiliary functions for blockCard and unblockCard functions