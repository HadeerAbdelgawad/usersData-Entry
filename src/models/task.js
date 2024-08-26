const mongoose= require('mongoose')
const Task=mongoose.model('Task',{
    title:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    }
})

module.exports= Task