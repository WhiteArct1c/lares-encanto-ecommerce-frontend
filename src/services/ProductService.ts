export class ProductService {

    /**
     * Format a product price to Brazilian currency
     * @param price The price to format
     */
    formatProductPrice(price: number | undefined): string {

        if (price === undefined) {
            return '';
        }

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    }
}