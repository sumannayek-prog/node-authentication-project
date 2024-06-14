require('dotenv').config();
const express=require('express')
const appServer=express();
const path=require('path');
const mongoose=require('mongoose')
const PORT=process.env.PORT||7900;

const flash=require('connect-flash')


const session=require('express-session');
const mongodb_session=require('connect-mongodb-session')(session);

const authRouter=require('./Router/authRouter')
const employeeRouter=require('./Router/employeeRouter')

const employeeModel=require('./Model/employeeModel')

appServer.set("view engine","ejs")
appServer.set("views","View")

appServer.use(express.urlencoded({extended:true}))

appServer.use(flash())
appServer.use(express.static(path.join(__dirname,'public')))
appServer.use(express.static(path.join(__dirname,'uploads')))


//session
//to store data in mongodb session collection
const session_store=new mongodb_session({
    uri:process.env.DB_URL,
    collection:'auth-session'
})

//session is function here.to stop resaving, resave value false to stop storing 
appServer.use(session({
    secret:'project-secret-key',
    resave:false,
    saveUninitialized:false,
    store:session_store
}))

appServer.use(async(req,res,next)=>{
    if(!req.session.user)
        {
            return next();
        }
        let userValue=await employeeModel.findById(req.session.user._id)
        if(userValue)
            {
                req.user=userValue;
                next();
            }
            else{
                console.log("user not found");
            }
})

appServer.use(authRouter);
appServer.use(employeeRouter);
mongoose.connect(process.env.DB_URL)
.then(res=>{
    console.log("Database connected successfully ");
    appServer.listen(PORT,()=>{
        console.log(`Server running at http://localhost:${PORT} `);
    })
    
    })
    .catch(err=>{
    console.log(err);
})
    
