import mongoose from 'mongoose'
import User from '../models/user.model.js'
// import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { name, email, password, role, bio, location, resumeUrl } = req.body

    // check if the user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      const error = new Error('User already exists')
        error.statusCode = 409
        throw error
    }

    // hash the password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create a new user
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          role,
          bio,
          location,
          resumeUrl
        }
      ],
      { session }
    )

    // create a JWT token

    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { token, user: newUser[0] }
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    next(error)
  }
}


export const signIn = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { email, password } = req.body
    
        // check if the user exists
        const existingUser = await User.findOne({ email })
    
        if (!existingUser) {
        const error = new Error('Invalid credentials')
            error.statusCode = 401
            throw error
        }
    
        // check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    
        if (!isPasswordCorrect) {
        const error = new Error('Invalid credentials')
            error.statusCode = 401
            throw error
        }
    
        // create a JWT token
    
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
        })
    
        await session.commitTransaction()
        session.endSession()
    
        return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { token, user: existingUser }
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
    
        next(error)
    }
}









