
import mongoose from "mongoose"
const FavouritesSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    }
})

const Favorites=new mongoose.model('Favorite',FavouritesSchema)
export default Favorites