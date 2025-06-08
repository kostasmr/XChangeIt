import mongoose from "mongoose";

const ratioSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    from:{
        type: String,
        required: true,
    },
    to:{
        type: String,
        required: true,
    },
    ratio:{
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const RatioModel = mongoose.model('Ratio', ratioSchema);

export default RatioModel;