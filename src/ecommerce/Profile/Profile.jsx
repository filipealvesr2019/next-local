
// import UserForm from '../UserForm/UserForm'
import Header from '../header/Header'
import ProductsList from '../../ecommerce/Products/ProductsList'
import Link from 'next/link'
import Container from '../StoreContainer/HeaderContainer'
export default function Profile(){
  return (

    <>
    <Link href={"/store"}>home</Link>
    <ProductsList />
    {/* <UserForm /> */}
 <Container />
    </>
  )
}