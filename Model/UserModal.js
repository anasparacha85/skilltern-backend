import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String, 
        unique: true, 
        sparse: true // Sparse: Some users may not have Google ID
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate email
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password required only if not using Google OAuth
        },
    },
    ConfirmPassword: {
        type: String,
        required: function () {
            return !this.googleId; // Password required only if not using Google OAuth
        },
    },
    profilePicture: {
        type: String, // Store Google Profile Picture URL
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwVLdSDmgrZN7TkzbHJb8dD0_7ASUQuERL2A&s"
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
    Status: {
        type: String,
        enum: ["Activated", "DeActivated"],
        default: "Activated",
    },
    otp: {
        type: Number,
    },
    Linkedin:{
        type:String
    },
    Facebook:{
        type:String,
    }
    ,
    Instagram:{
        type:String
    },
    Age:{
        type:Number
    },
    BioGraphy:{
        type:String
    },
    Instructor:{
        type:Boolean,
        default:false
    },
    InstructorStatus:{
        type:String,
        enum:['none','active','pending'],
        default:'none'
     
    },
   
});

// Hashing password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// JWT Token Generation
UserSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            user_id: this._id.toString(),
            email: this.email,
            role: this.role,
            Status: this.Status,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30d',
        });
    } catch (error) {
        console.error('Error generating JWT token:', error);
    }
};

// Password Comparison
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error('Error comparing password:', error);
    }
};

const User = mongoose.model('User', UserSchema);
export default User;