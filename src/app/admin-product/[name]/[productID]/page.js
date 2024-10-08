import AdminProductDetails from "@/components/Admin/AdminProductDetails"

export default function page({params}){
    const {name, productID} = params

    return (
        <>
        <AdminProductDetails name={name} productId={productID} />
        </>
    )
}