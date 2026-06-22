import {addItem} from "../services/cart.api"
import {useDispatch} from "react-redux"
import { addItem as addItemToCart} from "../state/cart.slice"


export const usecart=()=>{
    const dispatch=useDispatch()
    async function handleAddItem({productId,variantId}) {

        const data=await addItem({productId,variantId})
        dispatch(addItemToCart(data.item))
    }

    return {handleAddItem}
}