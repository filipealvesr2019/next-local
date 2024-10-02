import RegisterUser from "@/ecommerce/Signin/RegisterUser";

export default function page({params}){
    const {token} = params
    return <>
    <RegisterUser token={token}/>
    
    </>
}