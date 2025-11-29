import {useState} from "react";
import {IShippingTypes} from "../../utils/interfaces/IShippingTypes.ts";
import {IAddress} from "../../utils/interfaces/IAddress.ts";
import {IProductItem} from "../../utils/interfaces/IProductItem.ts";
import { OrderContext } from "./OrderContext.tsx";
import {OrderCreateRequest} from "../../utils/types/request/Order/OrderCreateRequest.ts";
import {OrderPayment} from "../../utils/types/request/Order/OrderPayment.ts";
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
    const [orderType, setOrderType] = useState<string>(COMPRA);
    const [orderTotalPrice, setOrderTotalPrice] = useState<number>(0);

    const api = useApi();

    const createOrder = async () => {
        // Validação: Pelo menos 1 produto
        if(!products || products.length === 0){
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

        // Validação: Pelo menos 1 forma de pagamento
        if(orderPayments.length === 0){
            toast.error("É necessário informar pelo menos uma forma de pagamento");
            return;
        }

        // Validação: Limite de 2 cartões
        if(orderPayments.length > 2){
            toast.error("É permitido usar no máximo 2 cartões de crédito");
            return;
        }

        const totalPrice = orderTotalPrice + shippingPrice;

        // Validação: Valor mínimo R$ 10,00 por cartão
        const MIN_CARD_VALUE = 10.00;
        for(const payment of orderPayments){
            if(payment.paymentMethod === 'CREDIT_CARD'){
                const totalPaymentValue = payment.installmentValue * payment.installments;
                if(totalPaymentValue < MIN_CARD_VALUE){
                    toast.error(`O valor mínimo por cartão de crédito é R$ ${MIN_CARD_VALUE.toFixed(2)}. Valor informado: R$ ${totalPaymentValue.toFixed(2)}`);
                    return;
                }
            }
        }

        // Validação: Soma dos pagamentos = totalPrice
        const totalPayments = orderPayments.reduce((sum, payment) => {
            return sum + (payment.installmentValue * payment.installments);
        }, 0);

        const difference = Math.abs(totalPayments - totalPrice);
        if(difference > 0.01){ // Tolerância para diferenças de arredondamento
            toast.error(`A soma dos pagamentos (R$ ${totalPayments.toFixed(2)}) não confere com o valor total do pedido (R$ ${totalPrice.toFixed(2)})`);
            return;
        }

        // Criar objeto de shipping apenas com o ID (backend calculará o preço)
        const shippingRequest = {
            id: shippingType!.id,
            name: null,
            deliveryTime: null,
            price: null
        };

        const orderData: OrderCreateRequest = {
            address: shippingAddress!,
            orderProducts: products,
            orderPayments: orderPayments,
            shipping: shippingRequest,
            type: orderType,
            totalPrice: totalPrice
        };

        setOrder(orderData);

        return await api.createOrder(orderData);
    };

    const addOrderPayment = (payment: OrderPayment, isMultiple: boolean) => {
        if(!isMultiple) {
            setOrderPayments([payment]);
        }else{
            setOrderPayments((prevPayments) => {
                // Validação: Limite de 2 cartões
                if(prevPayments.length >= 2){
                    toast.error("É permitido usar no máximo 2 cartões de crédito");
                    return prevPayments;
                }

                // Validação: Valor mínimo R$ 10,00 por cartão
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
        setProducts(products);
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

    const saveShippingAddress = (status: boolean) => {
        // Implement save shipping address logic here
        console.log("salvando endereço de entrega", status);
    };

    const resetOrder = () => {
        setOrder(undefined);
        setShippingType(undefined);
        setShippingPrice(0);
        setShippingAddress(undefined);
        setOrderTotalPrice(0);
        setOrderPayments([]);
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
            orderType,
            orderTotalPrice,
            createOrder,
            addOrderPayment,
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