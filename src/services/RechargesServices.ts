import { findByCardNumber } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { insert } from "../repositories/rechargeRepository.js";
import { compareExpirationDate } from "./CardsServices.js";

export async function rechargeService(apiKey: string | string[], cardInfo: any) {
    const { cardNumber, amount } = cardInfo;

    const businessId = await getBusinessId(apiKey);
    const cardId = await getCardId(cardNumber);

    const paymentData = { cardId, businessId, amount }

    await insert(paymentData);
}

async function getBusinessId(apiKey: string | string[]) {
    const business = await findByApiKey(apiKey);

    if (!business) throw { type: "error_apiKey_notExistent", message: "Insert an existent API key!" }

    return business.id;
}

async function getCardId(cardNumber: string) {
    const creditCard = await findByCardNumber(cardNumber);

    if (creditCard.isBlocked) throw { type: "error_creditCard_blocked", message: "This credit card is blocked!" }
    if (compareExpirationDate(creditCard.expirationDate)) throw { type: "error_creditCard_expired", message: "This credit card has already expired!" }

    return creditCard.id;
}