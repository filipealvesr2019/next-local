import ProductDetails from "@/ecommerce/Products/ProductDetails";

export default function page(params){
    const {name, productId} = params
    return (
        <>
        <ProductDetails name={name} productId={productId} />
        </>
    )
}