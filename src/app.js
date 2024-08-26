const express= require('express')
const app= express()
const port= process.env.PORT || 3000


require("./db/mongoose.js")

app.use(express.json())
const userRouter= require('./routers/user.js')
const taskRouter= require('./routers/task.js')
app.use(userRouter)
app.use(taskRouter)


app.listen(port, ()=>{
    console.log("All is done successfully!")
})

