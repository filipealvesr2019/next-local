import ResetPasswordPageUser from "@/ecommerce/Signin/ResetPasswordPageUser"

export default function page({params}){
const {token} = params
    return (
        <>

        <ResetPasswordPageUser token={token}/>
        </>
    )
}