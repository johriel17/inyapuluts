import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protect = async (req,res,next) => {
    //verify authentication
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id }).select('_id employee')
        
        req.user = user

        next()
    }
    catch (error) {
        console.log(error)
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({error: 'Token Expired'})
            
        }
        return res.status(401).json({error: 'Request is not authorized'})
    }
}

export const adminOnly = async (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {userType} = jwt.verify(token, process.env.JWT_SECRET)

        
        if(userType !== 'admin'){
            return res.status(401).json({error : 'Not Authorized, Admin only'})
        }
        
        next()
    }
    catch (error) {
        console.log(error)
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({error: 'Token Expired'})
            
        }
        return res.status(401).json({error: 'Request is not authorized'})
    }
};
