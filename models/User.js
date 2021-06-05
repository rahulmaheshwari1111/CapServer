const mongoose = require('mongoose');
const { isEmail }= require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required:[true, 'Please enter an email'], /// the second element is the error msg that we will through if the cond is not met
    unique:true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'] // validator is use and we have destructured the isemail validation from it
},
password:{
    type:String,
    required:[true, 'Please enter the password'],
    minlength: [6, 'Minimum password length is 6 char']
},
likes:{
    type:Number,
},
comments:{
    type:String,
}
}
);





// fire a mongoose hooks
userSchema.post('save',function(doc,next){    //here sot refers to post= after not a post request this mongoose will fire after the  doc is saved
console.log('new user was created', doc)
next()
})



// fire a hoook before the request was saved
userSchema.pre('save',async function(next){
    //console.log('user about to be created' ,this); //here this refers to user instance
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); // takes two arguments..and since this is a pre hook so in db we will get a hash passwd.
    next();
})



// static method to login a user (we are creating a method of login) // userchema.statics.[methodname] will create a static method
userSchema.statics.login =  async function(email, password){
    const user = await this.findOne({email});
    if(user){         
    const auth = await  bcrypt.compare(password, user.password) ;         // if this user exist we will compare the passsword
                                                                          // here we have to compare the password coz in db we have hashed password
    
    if(auth){ 
        user.likes = 0;              // if authenticatd then return the user                                  
          return user;    
      }                                             
throw Error ('incorrect password')
    }
    throw Error('Incorrect Email')            // if user doesnt exist we are throwing the error and it is handled at auth controller
}

const User = mongoose.model('user', userSchema)  // this is basically wat we call our databse collection (user)

module.exports = User; // exported in auth controller