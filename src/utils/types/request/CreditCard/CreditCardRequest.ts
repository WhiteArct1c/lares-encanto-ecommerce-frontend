export type CreditCardRequest = {
    token: string | null,
    id: number | null,
    cardNumber: number,
    cardName: string,
    cardCode: number,
    mainCard: boolean,
    cardFlag: string
}