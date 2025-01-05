const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const RoleEnum = require("../Enum/Enum");
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:Object.values(RoleEnum),
        required:true
    }
}, { timestamps: true });
const saltRound = 10;
UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, saltRound);
    }
    next();
});
const User = mongoose.model('User',UserSchema);
module.exports={
    User
} 