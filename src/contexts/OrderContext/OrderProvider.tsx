import {useState} from "react";
import {IShippingTypes} from "../../utils/interfaces/IShippingTypes.ts";
import {IAddress} from "../../utils/interfaces/IAddress.ts";
import {IProductItem} from "../../utils/interfaces/IProductItem.ts";
import { OrderContext } from "./OrderContext.tsx";
import {OrderCreateRequest} from "../../utils/types/request/Order/OrderCreateRequest.ts";

export const OrderProvider  = ({ children }: { children: JSX.Element }) => {
    const [order, setOrder] = useState<OrderCreateRequest>();
    const [products, setProducts] = useState<IProductItem[]>([]);
    const [shippingType, setShippingType] = useState<IShippingTypes>();
    const [shippingPrice, setShippingPrice] = useState<number>(0);
    const [shippingAddress, setShippingAddress] = useState<IAddress>();
    const [orderTotalPrice, setOrderTotalPrice] = useState<number>(0);

    const createOrder = () => {
        setOrder({
            products: products,
            shipping: {
                name: shippingType!.name,
                price: shippingPrice
            },
            address: shippingAddress!,
            payments: [{
                installments: 1,
                method: "CREDIT_CARD",
                value: 0
            }],
            totalPrice: orderTotalPrice
        })
    };

    const saveOrder = () => {
        // Implement save order logic here
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
            orderTotalPrice,
            createOrder,
            saveOrder,
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