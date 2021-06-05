const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')


// handle errors
const handleErrors = (err)=> { 
    console.log(err.message, err.code)
let errors = {email:" ", password:" "}


// incorrect email

if(err.message === 'incorrect email'){   // handling the throw errors
    errors.email = 'that email is already registered'
}
// incorrect password

if(err.message === 'incorrect password'){   // handling the throw errors
    errors.password = 'that password is incorrect';
}

//duplicate errors..code

if (err.code === 11000){
    errors.email = 'Email is already registered';
    return errors;
}


//validation errors 
if (err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(({properties})=> {     //refer error code
        //console.log(properties)
        errors[properties.path] = properties.message;
    })  /// errr
}
return errors;
}



//create tokens
const maxAge = 3*24*60*60; //this takes in seconds 
const createToken = (id)=> {   //this create token function can be used in sigunpost and login
    return jwt.sign({ id }, 'team1secret',
    {
        expiresIn: maxAge
    });   //jsonweb token .md
}


module.exports.signup_get = (req,res)=>{   // no need
    res.render('signup');

};

module.exports.login_get = (req,res)=>{
    
    res.render('login');

}

module.exports.signup_post = async(req,res)=>{
    const { email, password, likes } = req.body;  // object destructuring ..t
    //console.log(email,password)

    try{  
     const user =   await User.create({email, password, likes})  ;   
     const token = createToken(user._id)   
     res.cookie('myjwt', token, {httpOnly: true, maxAge: maxAge*1000})                                         // this will create new instance of user
      res.status(200).json({user:user._id});                // right we are ssending this to postman but later we will send it to the browser
                                               // 21 we are sending to postman after mongodb creates that user from20 ..: proof  => postman data will have mongo db id
    }
    catch(err){
       const errors=  handleErrors(err)
        //console.log(err);
        res.status(400).json({errors})  // we can have custom error handling

    }

}


module.exports.login_post = async (req,res)=>{
    const { email, password , likes } = req.body;  // object destructuring ..this is just to check from the postman
   

    try{
const user = await User.login(email, password,likes);
const token = createToken(user._id)   
res.cookie('myjwt', token, {httpOnly: true, maxAge: maxAge*1000})//embedding in cookie


res.status(200).send('you are successfully logged in'); 


    }
    catch (err){
        const errors =handleErrors(err);
res.status(400).json({errors});
    }
}

module.exports.delete= ('/login/:id', (req,res)=>{
    // console.log( req.params.id)
    User.findByIdAndRemove({_id:req.params.id}).then((deletedUser)=>{res.send(deletedUser + "user delted")})
     
  
  }) 


  module.exports.put=('/login/:id', (req,res)=>{
    User.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){

        User.findOne({_id:req.params.id}).then((updatedUser)=>{
res.send(updatedUser)
        })
    })
})


//603806e1e755094e1b9ab287//
//protecting routes...
//csrf=> cross site request forgery