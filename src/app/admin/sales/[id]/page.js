import SalesDetails from "@/app/components/Sales/SalesDetails";

export default function page({params}){
    const {id} = params
    return (
        <>
        <SalesDetails id={id} /> 
        </>
    )
}