const express = require("express");
require('express-async-errors');
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config();
const connectDB = require("./config/db")
const testRoutes = require('./routes/testRoutes');
const morgan = require("morgan");
const authRoute =  require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const userRoute = require("./routes/userRoutes")
const jobRoute = require("./routes/jobsRoute")
const app =express();


connectDB();

app.use(express.json())
app.use(cors());
app.use(morgan("dev"))


app.use('/api/v1/test', testRoutes)
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/job',jobRoute)


app.use(errorMiddleware)

app.listen(process.env.PORT,(req,res) =>{
    console.log("app is starting")
})