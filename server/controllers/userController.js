import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'


export const login = async (req,res) => {
    try{
        const { email, password} = req.body;
        const errors = {};
    
        if (!email) {
          errors.email = 'Email is required';
        }
        if (!password) {
          errors.password = 'Password is required';
        }
 
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({errors : {email : "There is no such an email"}})
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ errors: { password: "Wrong password" } });
        }
 
        return res.status(200).json({
            _id : user.id,
            username: user.username,
            email : user.email,
            token : generateToken(user.id,user.userType)
        })

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
 
}

export const getUsers = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search || ''

      let query = {};

      if (searchQuery) {
          query = {
              email: { $regex: new RegExp(searchQuery, 'i') },
          };
      }

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);

      const users = await User.find(query)
          .sort({ startDate: -1 })
          .skip(skip)
          .limit(limit);

      return res.status(200).json({
          users,
          totalPages,
          currentPage: page
      });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req,res) => {
    try{
        const { id } = req.params
        const user = await User.findById(id)
        return res.status(200).json(user)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const createUser = async (req, res) => {
    try {
      const { username, email, password, userType } = req.body;
      const errors = {};
  
      if (!username) {
        errors.username = 'Username is required';
      }
      if (!email) {
        errors.email = 'Email is required';
      }
      if (!password) {
        errors.password = 'Password is required';
      }
      if (!userType) {
        errors.userType = 'UserType is required';
      }
      
      if(!validator.isEmail(email)){
        errors.email = 'Email is not valid'
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const userExist = await User.findOne({email}) 

      if(userExist){
        return res.status(400).json({ errors: { email: "Email already exists" } })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)



      const newUser = {
        username,
        email,
        password : hashedPassword,
        userType,
      };
  

      const result = await User.create(newUser);
  
      return res.status(201).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

export const updateUser = async (req,res) => {
    try{
      const { username, email, password, userType } = req.body;
      const errors = {};
  
      if (!username) {
        errors.username = 'Username is required';
      }
      if (!email) {
        errors.email = 'Email is required';
      }
      if (!password) {
        errors.password = 'Password is required';
      }
      if (!userType) {
        errors.userType = 'UserType is required';
      }
      
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
        const {id} = req.params

        const result = await User.findByIdAndUpdate(id,req.body)

        if(!result){
            return res.status(404).json({error: 'user not found'})
        }

        return res.status(200).json(result)

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const deleteUser = async (req,res) =>{
    try{
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)

        if(!user){
            return res.status(404).json({error: 'user not found'})
        }

        return res.status(200).json(user)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

const generateToken = (_id,userType) =>{

    return jwt.sign({_id,userType}, process.env.JWT_SECRET, {
        expiresIn : "12h"
    })

}