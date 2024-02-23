import Mongoose ,{Schema,Document} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


interface UserDoc extends Document {
    username:string;
    age:string;
    hobbies:string[];
}

const UserSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    username: { type: String, required: true },
    age: { type: String, required: true },
    hobbies: [{ type: String }]
},{
    toJSON: {
        transform(doc,ret)
        {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps:true
});

const User = Mongoose.model<UserDoc>('userTask',UserSchema);
export { User }