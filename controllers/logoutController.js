const User = require('../model/User');

const handleLogout = async (req, res) => {
  //On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  //is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    //res.cookie and res.clearCookie should have the completely same parameters.
    //even though there is no user sent, we should delete the cookie, maybe just because the user is a stranger
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }

  //delete refreshToken in db if there is a user in db
  // const otherUsers = userDB.users.filter(
  //   (person) => person.refreshToken !== foundUser.refreshToken
  // );
  // const currentUser = { ...foundUser, refreshToken: '' };
  // userDB.setUsers([...otherUsers, currentUser]);
  // await fsPromises.writeFile(
  //   path.join(__dirname, '..', 'model', 'users.json'),
  //   JSON.stringify(userDB.users)
  // );

  foundUser.refreshToken = '';
  const result = await foundUser.save();
  //result is a document object
  console.log(result);

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); //secure:true - only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
