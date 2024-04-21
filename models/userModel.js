const mongoose =require('mongoose')
const bcrypt = require('bcrypt')
const dotenv = require("dotenv");
dotenv.config();


// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"First Name is Required"],
    },
    lastname:{
        type:String,
        required:[true,"Last Name is Required"],
            },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
    },
    mobile:{
        type:String,
        required:[true,"Mobile is Required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    role:{
        type:String,
        default:"user"
    },
    
    cart:{
        type:Array,
        default:[]
    },
        
    orderdetails:{
        type:Array,
        default:[]
    },
    address:{type:String},
    wishlist:[{type:mongoose.Schema.ObjectId,ref:"Product"}],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken:{type:String}
},
     {versionKey:false,timestamps:true
    });

userSchema.pre('save',async function(next){
const salt = await bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))
this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.isPasswordMatch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resettoken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    return resettoken;
  };
  

//Export the model
const userModel = mongoose.model('User', userSchema);
module.exports = userModel