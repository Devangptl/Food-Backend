
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json({limit : '10mb'}))

const PORT = process.env.PORT || 8080

//mongodb connection

mongoose.set('strictQuery' , false)
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Connect to Database"))
.catch((err)=>console.log(err))

//schema

const userSchema = mongoose.Schema({
        firstName : String,
        lastName : String,
        email : {
            type : String,
            unique : true,
        },
        password : String ,
        confirmpassword : String,
        image : String,
})

//model
const userModel = mongoose.model("user", userSchema)


//api 

app.get("/" , (req ,res )=>{
    res.send("Server is running")
})


//signup api call

app.post("/signup", async (req, res) => {
    // console.log(req.body);
    // const { email } = req.body;
  
    const user =await userModel.findOne({ email: req.body.email });
    if (user) {
        return res.send({ message: "Email already exists" ,alert: false });
    }
    else{
        const data = userModel(req.body)
        const save = data.save()
        res.send({message : "Successfully sing up" ,alert: true})

    }
  });


  //login api call
  app.post("/login", async (req, res) => {
    // console.log(req.body);
    const { email } = req.body;
  
    const user =await userModel.findOne({ email: email });
    if (user) {
        // console.log(user)
        const datasend ={
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
        }
        console.log(datasend)
        return res.send({ message: "Login is successfully" , alert : true ,  data : datasend});
    }
    else{
        return res.send({ message: "Email not available , please sign up" , alert : false });
    }
    
  });


  //new Product section

  const schemaProduct = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : String,
    description : String,
  })

  const productModel = mongoose.model('product' ,schemaProduct)

  //save product in database 
  //api

  app.post('/uploadProduct' , async(req,res)=>{
    console.log(req.body)
    
    const data =await productModel(req.body);
    const datasave = await data.save()
    res.send({message : 'upload successfully'})

  })

  //
  app.get('/product' ,async (req,res)=>{
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
  })


app.listen(PORT,()=>console.log("Server is running at port " + PORT))

