const verifyRoles = (...allowedRoles) => {
  console.log('allowedRoles-->', allowedRoles);
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    // console.log('rolesArray-->', rolesArray);
    // console.log('req.roles-->', req.roles);
    // just need one true
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
