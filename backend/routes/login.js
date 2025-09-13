// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const loginRouter = require('express').Router()
// const User = require('../models/User')

// loginRouter.post('/', async (req, res) => {
//   const { username, password } = req.body

//   const user = await User.findOne({ username })
//   const passwordCorrect =
//     user === null ? false : await bcrypt.compare(password, user.password) 

//   if (!user || !passwordCorrect) {
//     return res.status(401).json({ error: 'invalid username or password' })
//   }

//   const userForToken = {
//     username: user.username,
//     id: user._id,
//   }

//   const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' })

//   res.status(200).send({ token, username: user.username })
// })

// module.exports = loginRouter
