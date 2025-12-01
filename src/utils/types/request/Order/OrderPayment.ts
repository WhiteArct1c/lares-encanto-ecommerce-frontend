import {CreditCardRequest} from "../CreditCard/CreditCardRequest.ts";

export type OrderPayment = {
    id?: number; // ID retornado pelo backend quando o pagamento já foi criado
    installments: number;
    paymentMethod: string;
    installmentValue: number;
    creditCard: CreditCardRequest;
}