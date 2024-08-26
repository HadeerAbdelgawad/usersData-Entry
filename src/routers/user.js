const express = require('express')
const router = express.Router()
const auth= require('../middleware/auth.js')
const User= require('../models/user.js')

/////////////////////////////////////////////////////////////////
//post

router.post('/users', (req,res)=>{
    
    console.log(req.body)
    const user = new User(req.body)
    user.save()

    .then((user)=>{res.status(200).send(user)})
    .catch((error)=>{res.status(404).send(error)})
})

///////////////////////////////////////////////////////////////////
//get

router.get('/users',auth, async(req,res)=>{
    User.find({}).then((user)=>{
        res.status(200).send(user)
    })
    .catch((e)=>{
        res.status(500).send(e)
    })
})

///////////////////////////////////////////////////////////////////
//get by id

router.get('/users/:id',auth, (req,res)=>{
    const _id= req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            res.status(404).send("Unable to find user")
        }
        res.status(200).send(user)
    })
    .catch((e)=>{res.status(500).send(e)})
})

/////////////////////////////////////////////////////////////////
//patch

router.patch('/users/:id',auth, async(req,res)=>{
    try{
        const bcryptjs= require('bcryptjs')
        const _id= req.params.id
        // const user= await User.findByIdAndUpdate(_id, req.body,{
        //     new:true,
        //     runValidators:true
        // })
        const updates= Object.keys(req.body)
        const user= await User.findById(_id)
        if(!user){
            return res.status(404).send("No user Found")
        }
        updates.forEach((ele)=>(
            user[ele]= req.body[ele]
        ))
        await user.save()
        res.status(200).send(user)
    }
    catch(error){
        res.status(500).send(error)
    }
})

/////////////////////////////////////////////////////////////////
//delete

router.delete('/users/:id',auth, async(req,res)=>{
    try{
        const _id= req.params.id
        const user= await User.findByIdAndDelete(_id)

        if(!user){
            return res.status(404).send("No User Found")
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

///////////////////////////////////////////////////////////////////
//login

router.post('/login', async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token= await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

/////////////////////////////////////////////////////////////////////
//token

router.post('/users', async(req,res)=>{
    try{
        const user= new User(req.body)
        const token= await user.generateToken()
        await user.save()
            res.status(200).send({user, token })
        
    }
    catch(error){
        res.status(400).send(error)
    }
})

////////////////////////////////////////////////////////////////////
//profile

router.get('/profile', auth, (req,res)=>{
    res.status(200).send(req.user)
})

////////////////////////////////////////////////////////////////////
//logout

router.delete('/logout',auth, async(req,res)=>{
    try{
        console.log(req.user)
        req.user.tokens= req.user.tokens.filter((el)=>{
            return el != req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(404).send(e)
    }
})

////////////////////////////////////////////////////////////////////
//logoutAll

router.delete('/logoutAll',auth, async(req,res)=>{
    try{
        req.user.tokens=[]
        req.user.save()
        res.send()
    }
    catch(e){
        res.status(404).send(e)
    }
})


module.exports= router