export interface CreateUserInput{
    username:string;
    age:string;
    hobbies:[string];
}

export interface EditUserInput {
    username:string;
    age:string;
    hobbies:[string];
}


export interface UserPayload {
    _id:string;
    userid:string;
    username:string;
    age:string;
    hobbies:[string];
}