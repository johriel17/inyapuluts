import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'

const PORT  = process.env.PORT
const MONGO_URI = process.env.MONGO_URI;

//routes
import usersRoute from './routes/userRoute.js'
import recipeRoute from './routes/recipeRoute.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/users', usersRoute)
app.use('/api/recipes', recipeRoute)



mongoose
.connect(MONGO_URI)
.then(() =>{
    console.log('App connected to database')
    app.listen(PORT, () => {
        console.log(`Listining to port ${PORT}`)
    })
})
.catch((error) =>{
    console.log(error)
})