import {useState} from "react";
import {IShippingTypes} from "../../utils/interfaces/IShippingTypes.ts";
import {IAddress} from "../../utils/interfaces/IAddress.ts";
import {IProductItem} from "../../utils/interfaces/IProductItem.ts";
import { OrderContext } from "./OrderContext.tsx";
import {OrderCreateRequest} from "../../utils/types/request/Order/OrderCreateRequest.ts";
import {OrderPayment} from "../../utils/types/request/Order/OrderPayment.ts";
import {CouponUsage} from "../../utils/types/request/Order/CouponUsage.ts";
import {toast} from "react-toastify";
import {useApi} from "../../hooks/useApi.ts";
import {COMPRA} from "../../utils/constants/OrderTypes.ts";

export const OrderProvider  = ({ children }: { children: JSX.Element }) => {
    const [order, setOrder] = useState<OrderCreateRequest>();
    const [products, setProducts] = useState<IProductItem[]>([]);
    const [shippingType, setShippingType] = useState<IShippingTypes>();
    const [shippingPrice, setShippingPrice] = useState<number>(0);
    const [shippingAddress, setShippingAddress] = useState<IAddress>();
    const [orderPayments, setOrderPayments] = useState<OrderPayment[]>([]);
    const [orderCoupons, setOrderCoupons] = useState<CouponUsage[]>([]);
    const [orderType] = useState<string>(COMPRA);
    const [orderTotalPrice, setOrderTotalPrice] = useState<number>(0);

    const api = useApi();

    const createOrder = async (productsOverride?: IProductItem[]) => {
        const productsToUse = productsOverride || products;
        
        if(!productsToUse || productsToUse.length === 0){
            toast.error("É necessário informar pelo menos um produto no pedido");
            return;
        }

        if(!shippingType){
            toast.error("Selecione o tipo de entrega");
            return;
        }

        if(!shippingAddress){
            toast.error("Selecione o endereço de entrega");
            return;
        }

        const totalCouponsDiscount = orderCoupons.reduce((sum, coupon) => sum + coupon.amountToUse, 0);
        const orderTotal = orderTotalPrice + shippingPrice;
        
        // Validação: A soma dos cupons não pode exceder o valor total do pedido
        if(totalCouponsDiscount > orderTotal){
            toast.error(`O desconto total dos cupons (R$ ${totalCouponsDiscount.toFixed(2)}) não pode ser maior que o valor total do pedido (R$ ${orderTotal.toFixed(2)})`);
            return;
        }
        
        const totalPrice = orderTotal - totalCouponsDiscount;

        if(totalPrice < 0){
            toast.error("O desconto dos cupons não pode ser maior que o valor total do pedido");
            return;
        }

        const TOLERANCE = 0.01;
        const isTotalZero = totalPrice <= TOLERANCE;

        if(!isTotalZero){
            if(orderPayments.length === 0){
                toast.error("É necessário informar pelo menos uma forma de pagamento");
                return;
            }

            if(orderPayments.length > 2){
                toast.error("É permitido usar no máximo 2 cartões de crédito");
                return;
            }

            const MIN_CARD_VALUE = 10.00;
            const hasCoupons = orderCoupons.length > 0;
            
            for(const payment of orderPayments){
                if(payment.paymentMethod === 'CREDIT_CARD'){
                    const totalPaymentValue = payment.installmentValue * payment.installments;
                    if(!hasCoupons && totalPaymentValue < MIN_CARD_VALUE){
                        toast.error(`O valor mínimo por cartão de crédito é R$ ${MIN_CARD_VALUE.toFixed(2)}. Valor informado: R$ ${totalPaymentValue.toFixed(2)}`);
                        return;
                    }
                }
            }

            const totalPayments = orderPayments.reduce((sum, payment) => {
                return sum + (payment.installmentValue * payment.installments);
            }, 0);

            const difference = Math.abs(totalPayments - totalPrice);
            if(difference > TOLERANCE){
                toast.error(`A soma dos pagamentos (R$ ${totalPayments.toFixed(2)}) não confere com o valor total do pedido (R$ ${totalPrice.toFixed(2)})`);
                return;
            }
        }

        const shippingPriceValue = typeof shippingType!.price === 'number' 
            ? shippingType!.price 
            : (typeof shippingType!.price === 'string' ? parseFloat(shippingType!.price) : null);

        const shippingRequest = {
            id: shippingType!.id,
            name: shippingType!.name || null,
            deliveryTime: shippingType!.deliveryTime || null,
            price: shippingPriceValue
        };

        const finalProducts = Array.isArray(productsToUse) ? productsToUse : [];
        
        const isExistingAddress = shippingAddress!.id && shippingAddress!.id !== '' && shippingAddress!.id !== null && shippingAddress!.id !== undefined;
        
        const preparedAddress = isExistingAddress ? {
            id: shippingAddress!.id,
            title: null as any,
            cep: null as any,
            residenceType: null as any,
            addressType: null as any,
            addressCategories: null as any,
            streetName: null as any,
            addressNumber: null as any,
            neighborhoods: null as any,
            city: null as any,
            state: null as any,
            country: null as any,
            observations: null as any
        } : shippingAddress!;

        const preparedPayments = isTotalZero ? [] : orderPayments.map(payment => {
            const isExistingCard = payment.creditCard.id !== null && payment.creditCard.id !== undefined;
            
            if (isExistingCard) {
                return {
                    ...payment,
                    creditCard: {
                        id: payment.creditCard.id,
                        cardNumber: null as any,
                        cardName: null as any,
                        cardCode: null as any,
                        cardFlag: null as any,
                        mainCard: payment.creditCard.mainCard || false,
                        token: null
                    }
                };
            }
            return payment;
        });
        
        const orderData: OrderCreateRequest = {
            address: preparedAddress,
            orderProducts: finalProducts,
            orderPayments: preparedPayments,
            shipping: shippingRequest,
            type: orderType,
            totalPrice: totalPrice,
            coupons: orderCoupons.length > 0 ? orderCoupons : undefined
        };

        setOrder(orderData);

        return await api.createOrder(orderData);
    };

    const addOrderPayment = (payment: OrderPayment, isMultiple: boolean) => {
        if(!isMultiple) {
            setOrderPayments([payment]);
        }else{
            setOrderPayments((prevPayments) => {
                if(prevPayments.length >= 2){
                    toast.error("É permitido usar no máximo 2 cartões de crédito");
                    return prevPayments;
                }

                const MIN_CARD_VALUE = 10.00;
                const totalPaymentValue = payment.installmentValue * payment.installments;
                if(payment.paymentMethod === 'CREDIT_CARD' && totalPaymentValue < MIN_CARD_VALUE){
                    toast.error(`O valor mínimo por cartão de crédito é R$ ${MIN_CARD_VALUE.toFixed(2)}. Valor informado: R$ ${totalPaymentValue.toFixed(2)}`);
                    return prevPayments;
                }

                const paymentExists = prevPayments.some((p) => p.creditCard.cardNumber === payment.creditCard.cardNumber);
                if (paymentExists) {
                    return prevPayments.map((p) =>
                        p.creditCard.cardNumber === payment.creditCard.cardNumber ? { ...p, ...payment } : p
                    );
                } else {
                    return [...prevPayments, payment];
                }
            });
        }
    };

    const updateOrderTotalPrice = (price: number) => {
        setOrderTotalPrice(price);
    };

    const setOrderProducts = (products: IProductItem[]) => {
        setProducts(Array.isArray(products) ? [...products] : []);
    };

    const setOrderShippingType = (type: IShippingTypes) => {
        setShippingType(type);
    };

    const setOrderShippingPrice = (price: number) => {
        setShippingPrice(price);
    };

    const setOrderShippingAddress = (address: IAddress) => {
        setShippingAddress(address);
    };

    const setOrderCouponsHandler = (coupons: CouponUsage[]) => {
        setOrderCoupons(coupons);
    };

    const saveShippingAddress = (_status: boolean) => {
    };

    const resetOrder = () => {
        setOrder(undefined);
        setShippingType(undefined);
        setShippingPrice(0);
        setShippingAddress(undefined);
        setOrderTotalPrice(0);
        setOrderPayments([]);
        setOrderCoupons([]);
        setProducts([]);
    };

    return (
        <OrderContext.Provider value={{
            order,
            products,
            shippingType,
            shippingPrice,
            shippingAddress,
            orderPayments,
            orderCoupons,
            orderType,
            orderTotalPrice,
            createOrder,
            addOrderPayment,
            setOrderCoupons: setOrderCouponsHandler,
            updateOrderTotalPrice,
            setOrderProducts,
            setOrderShippingType,
            setOrderShippingPrice,
            setOrderShippingAddress,
            saveShippingAddress,
            resetOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}