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
        if(!products){
            toast.error("Adicione produtos ao pedido");
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

        if(orderPayments.length === 0){
            toast.error("Selecione o método de pagamento");
            return;
        }

        const totalPrice = orderTotalPrice + shippingPrice;
        const orderData: OrderCreateRequest = {
            address: shippingAddress!,
            orderProducts: products,
            orderPayments: orderPayments,
            shipping: shippingType!,
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