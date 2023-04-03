const express = require("express");
const route = express.Router();
const users = require("./models/users");
const products = require('./models/products');
const jwt = require("jsonwebtoken");
var tempUser = '';

// route.get('/', async (req, res) => {
//     const _users = await users.find();
//     console.log("dsf",users)
//     res.send(_users)
// });
// route.get("/:id", (req, res) =>{
//  res.send("id is"+req.params.id)
// })



//JWT Authentication Middleware
const jwtTokenAuthentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        jwt.verify(authHeader, "secretkeyappearshere", (err, user) => {
            // console.log(user, "ewrwerwe")
       if(err){ 
        res.status(403)
        return res.send("Invalid token!");
       }else{
        res.user = user;
        // res.send(user)
        next();
       }
        })
    }else{
        res.status(401);
        res.send("User not found!")
    }
}
const jwtTokenAuthenticationCommon = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        jwt.verify(authHeader, "secretkeyappearshere", (err, user) => {
            // console.log(user, "ewrwerwe")
       if(err){ 
        res.status(403)
        return res.send("Invalid token!");
       }else{
        res.user = user;
        res.send(user)
        next();
       }
        })
    }else{
        res.status(401);
        res.send("User not found!")
    }
}



route.get('/', jwtTokenAuthentication, (req, res) => {
    res.send("Post route called")
})


//Login with token
route.get('/common', jwtTokenAuthenticationCommon, (req, res) => {
    try{
        res.status(200)
    res.send("Logged in with token.")
}catch{
    res.status(403)
    res.send("Failed to login with token.")
}
})


//Login API
route.post('/login', async (req, res) => {
    // console.log(req.body)
    const _data = await users.findOne({'email': req.body.email, "password": req.body.password});

    if(_data){
        try {
        token = jwt.sign(
            { email: _data.email },
            "secretkeyappearshere",
            { expiresIn: '1h' }
          );
        } catch (err) {
          console.log(err);
          const error = new Error("Error! Something went wrong.");
          return next(error);
        }
        res.status(200)
        res.json({
            success: true,
            data: _data,
            token: token,
          })
        // res.send("login route called")
    }else{
        res.status(401)
        res.send("Email or Password is incorrect!")
    }
})


//Signup API
route.post('/signup', async (req, res) => {
    // console.log(req.body)
    const email = req.body.email;
    const pass = req.body.password;
    if(email && pass){
        const newUser = new users({'email': email, "password": pass})
        const _data = await newUser.save();
        if(_data){
            res.status(201)
            res.send('User registerd successfully.')
        }else{
            res.send('Server Error.')
        }
    }else{
        res.send("Please enter email or password correctly!")
    }
    
})


//Products API
route.get('/products', jwtTokenAuthentication, async (req, res) => {
    try{
        const _products = await products.find();
        res.status(200)
        res.send(_products);
        
    }catch{
        res.send("Server error!");
    }
})


//Invalid URLs
route.get('*', (req, res) => {
    res.status(404)
    res.send("Page not found!")
})

module.exports = route;