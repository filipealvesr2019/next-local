import LojaPage from "@/ecommerce/LojaPage"

export default function Store({params}){
const {store} = params
    return (
        <>
        {store}
        <LojaPage store={store}/>
        </>
    )
}