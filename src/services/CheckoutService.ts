import { ProductService } from './ProductService';

export type InstallmentOption = {
    value: number;
    label: string;
}


export class CheckoutService {
    private totalInstallments = 12;
    private productService = new ProductService();

    getInstallmentsOptions(orderTotalPrice: number): InstallmentOption[] {
        const installmentsOptions: InstallmentOption[] = [];

        for (let i = 1; i <= this.totalInstallments; i++) {
            const installmentValue = orderTotalPrice / i;
            installmentsOptions.push({
                value: i,
                label: `${i}x de ${this.productService.formatProductPrice(installmentValue)} sem juros`,
            });
        }

        return installmentsOptions;
    }
}