const User = require('../model/User');

const bcript = require('bcrypt');

const jwt = require('jsonwebtoken');
// require('dotenv').config();

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log(user, pwd);
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required' });

  //check the username and get the user data from DB
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized, it's not the real user
  //check the password
  const match = await bcript.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //create JWTS
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10000s' }
    );
    //no need to set roles into refresh token
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    //saving refreshToken with the current user to DB
    foundUser.refreshToken = refreshToken;
    const result = foundUser.save();
    console.log(result);

    //send cookie and two tokens
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      // secure: true, //if trying to use thunder client to refresh access cookie, we should comment this, or it will refuse my request
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    red.sendStatus(401);
  }
};

module.exports = { handleLogin };
