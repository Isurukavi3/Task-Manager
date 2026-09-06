import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true},
    name: { type: String, required: true, trim: true},
    jobTitle: {type: String, trim: true},
    role: {type: String, enum: ['manager', 'employee'], default:'employee'},
    profilePicture: {type:String, default: null },
},
{timestamps: true}
);

userSchema.set('toJSON',{
    versionKey:false,
    tranform(_doc, ret){
        delete ret.password;
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
    },
});

export const User = mongoose.model('User', userSchema);

