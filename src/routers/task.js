const express = require('express')
const router = express.Router()
const auth= require('../middleware/auth.js')
const Task= require('../models/task.js')
/////////////////////////////////////////////////////////////////
//post

router.post('/tasks',auth, (req,res)=>{
    
    console.log(req.body)
    const task = new Task({...req.body, owner:req.user._id})
    task.save()

    .then((task)=>{res.status(200).send(task)})
    .catch((error)=>{res.status(404).send(error)})
})

//////////////////////////////////////////////////////////////////
//get

router.get('/tasks',auth, async(req,res)=>{
    Task.find({}).then((task)=>{
        res.status(200).send(task)
    })
    .catch((e)=>{
        res.status(500).send(e)
    })
})

/////////////////////////////////////////////////////////////////
//get by id

router.get('/tasks/:id',auth, async(req,res)=>{
    try{
        const id= req.params.id
        const task= await Task.findOne({_id:id, owner: req.user.id})
        
        if(!task){
            res.status(404).send("Unable to find task")
        }
        res.send(task)
    }
    
    catch(e){
        res.status(500).send(e.message)
    }
    
})


//////////////////////////////////////////////////////////////////
//patch

router.patch('/tasks/:id',auth, async(req,res)=>{
    try{
        
        const _id= req.params.id
        const task= await Task.findByIdAndUpdate(_id, req.body,{
            new:true,
            runValidators:true
        })
       
        if(!task){
            return res.status(404).send("No task Found")
        }
       
        res.status(200).send(task)
    }
    catch(error){
        res.status(500).send(error)
    }
})

////////////////////////////////////////////////////////////////////
//delete

router.delete('/tasks/:id',auth, async(req,res)=>{
    try{
        const _id= req.params.id
        const task= await task.findByIdAndDelete(_id)

        if(!task){
            return res.status(404).send("No task Found")
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports= router
