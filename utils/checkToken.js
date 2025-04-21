//we need to check if the token is right or no 
const jwt = require('jsonwebtoken');
const config = require ('./config');

const checkToken = (req, res, next) => {
    try {
      let token = req.headers["authorization"];
      if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
      } else {
        return res.json({
          status: false,
          msg: "Authorization header is missing or invalid",
        });
      }
      jwt.verify(token, config.key, (err, decoded) => {
        if (err) {
          return res.json({
            status: false,
            msg: "Token is invalid",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } catch (err) {
      return res.json({
        status: false,
        msg: "An error occurred while processing the token",
      });
    }
  };
  
  module.exports = {
    checkToken: checkToken,
  };