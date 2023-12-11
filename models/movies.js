import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required:true,
    },
    review:{
        type:[String],
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    }
})

const movieModel = mongoose.model("movie",movieSchema);
export default movieModel