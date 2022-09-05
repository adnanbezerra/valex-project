import { compareExpirationDate, getBalanceResult, getCardByNumber } from "./CardsServices.js";
import bcrypt from 'bcrypt';
import { findById } from "../repositories/businessRepository.js";
import { Card } from "../repositories/cardRepository";
import { findByCardId } from "../repositories/rechargeRepository.js";
import { findPaymentsByCardId, insert } from "../repositories/paymentRepository.js";

export async function payment(paymentInfo: any) {
    const { amount, cardNumber, password, businessId } = paymentInfo;
    const creditCard = await getCardByNumber(cardNumber);
    await checkBusinessById(businessId, creditCard);

    if (creditCard.isBlocked) throw { type: "error_creditCard_blocked", message: "This credit card is blocked!" }
    if (!bcrypt.compareSync(password, creditCard.password)) throw { type: "error_wrongPassword", message: "Insert the right password!" }
    if (compareExpirationDate(creditCard.expirationDate)) throw { type: "error_creditCard_expired", message: "This credit card has already expired!" }
    if (getCardBalance < amount) throw { type: "error_notEnough_credit", message: "Not enough credit to make the purchase!" }

    const cardId = creditCard.id
    const paymentData = { cardId, businessId, amount }

    await insert(paymentData);
}

async function checkBusinessById(businessId: number, creditCard: Card) {
    const business = await findById(businessId);

    if (!business) throw { type: "error_business_notFound", message: "This business doesn't exist!" };
    if (business.type !== creditCard.type) throw { type: "error_wrong_creditCardType", message: "This credit card can't be used to pay this!" };
}

async function getCardBalance(cardId: number) {
    const rechargesList = await findByCardId(cardId);
    const paymentsList = await findPaymentsByCardId(cardId);

    const balance = getBalanceResult(rechargesList, paymentsList);

    return balance;
} 