import {CreditCardRequest} from "../CreditCard/CreditCardRequest.ts";

export type OrderPayment = {
    installments: number;
    paymentMethod: string;
    installmentValue: number;
    creditCard: CreditCardRequest;
}