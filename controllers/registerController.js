// const usersDB = {
//   users: require('../model/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fsPromises = require('fs').promises;
// const path = require('path');

const User = require('../model/User');

const bcrypt = require('bcrypt');

const handlerNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({
      message: 'Username and password are required',
    });

  //check for duplicate usernames in the db
  // const duplicate = usersDB.users.find((person) => person.username === user);
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // username conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    console.log(result);

    //this way is also ok
    // const newUser = new User();
    // newUser.username = user;
    // newUser.password = hashedPwd;
    // const result = await newUser.save();

    //201 means created successfully
    res.status(201).json({ success: `The new user ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handlerNewUser };
