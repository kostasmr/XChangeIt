import UserModel from './user.model.js';
import jwt from "jsonwebtoken"


export const getUsers = async (req, res) => {
    const users = await UserModel.find();
        res.send(users);
}

export const getUser = async (req, res) => {
    let user = await UserModel.findOne(req.params.email);

    if(!user){
        return res.send({ message: 'This user doesn\'t exist' });
    }
    res.send(user);
}

export const createUser = async(req, res) => {
    let user = await UserModel.findOne({email: req.body.email});

    if(user){
        return res.send({ message: 'User all ready exist!' });
    }

    const body = req.body;
    const newUser = new UserModel(body);

    await newUser.save();
    const token = generateTokenResponse(newUser);

    res.status(201).json({ success: true, data: newUser, token });
}

export const deleteUser = async (req, res) =>{
    const user = await UserModel.findById(req.params.id);

    if(!user){
        return res.send({ message: 'This user doesn\'t exist' });
    }
    const email = user.email;
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(201).send("User with "+email+" email was deleted!");
}

export const updateUser = async (req, res) =>{
    const user = await UserModel.findById(req.params.id);
    const updates = req.body;

    if(!user){
        return res.send({ message: 'This user doesn\'t exist' });
    }

    await UserModel.findByIdAndUpdate(req.params.id, updates, {new: true})
    const updatedUser = await UserModel.findById(req.params.id);
    res.send({ message: 'User with name '+ user.name +' updated!', updatedUser});
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        res.status(400).send("This user does not exists!");
    }else{
        // const isMatch = await bcrypt.compare(password, user.password);
        if(password == user.password){
            const token = generateTokenResponse(user);

            res.send({user, token});
        }else{
            res.status(400).send("This password is invalid!");
        } 
    }
}

export const logoutUser = async (req, res) => {
    const id  = req.params.id;
    const user = await UserModel.findById(id);

    if(!user){
        res.status(400).send("User doesn't exist to logout!");
    }
    res.status(200).json({
        success: true,
        data: {}
    });
}

const generateTokenResponse = (user) => { 
    const token = jwt.sign({
        id : user._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    return token;
}