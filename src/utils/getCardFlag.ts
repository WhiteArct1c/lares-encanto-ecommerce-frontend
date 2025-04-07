export const getCardFlag = (cardNumber: string): string => {
    cardNumber = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (/^4/.test(cardNumber)) {
        return 'VISA';
    } else if (/^5[1-5]/.test(cardNumber)) {
        return 'MASTERCARD';
    } else if (/^3[47]/.test(cardNumber)) {
        return 'AMERICAN EXPRESS';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
        return 'DISCOVER';
    } else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
        return 'DINERS CLUB';
    } else if (/^35(?:2[89]|[3-8][0-9])/.test(cardNumber)) {
        return 'JCB';
    } else {
        return 'Bandeira inválida';
    }
};