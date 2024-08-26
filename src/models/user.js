const mongoose =require('mongoose')
const validator= require('validator')
const bcryptjs= require('bcryptjs')
const jwt= require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength:8,
        validate(value){
            let password= new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
            if(!password.test(value)){
                throw new Error("password must include letters , numbers and special charaters")
            }
        }
    },
    email:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Email is Invalid')
            }
        }
    },
    age:{
        type:Number,
        default:18,
        validate(value){
            if(value<=0){
                throw new Error('Age must be positive number')
            }
        }
    },
    city:{
        type:String
    },
    tokens:[
        {
            type:String,
            require:true
        }
    ]
})

////////////////////////////////////////////////////////////////////////

userSchema.pre("save", async function () {
    const user= this
    console.log(user)
    
    if(user.isModified('password')){
        user.password= await bcryptjs.hash(user.password,8)

    }
    
})

////////////////////////////////////////////////////////////////////////

userSchema.statics.findByCredentials= async (email, password)=>{
    const user= await User.findOne({email:email})
    console.log(user)

    if(!user){
        throw new Error('Unable to login')
    }
    console.log(user)

    const isMatch= await bcryptjs.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

///////////////////////////////////////////////////////////////////////

userSchema.methods.generateToken= async function(){
    const user= this
    const token= jwt.sign({_id:user._id.toString()}, "client700")

    user.tokens= user.tokens.concat(token)
    await user.save()
    return token
}

//////////////////////////////////////////////////////////////////////

userSchema.methods.toJSON= function(){
    const user=this
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

const User= mongoose.model('User', userSchema)
module.exports= User