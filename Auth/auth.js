require("dotenv").config();
var jwt = require('jsonwebtoken');


const auth = (req, res, next) => {


    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
        req.send("please login1111111");

    }
    var decoded = jwt.verify(token, process.env.SECRECT_KEY);

    const user_id = decoded.user_id;

    if (decoded) {
        req.body.user_id = user_id;
        next();
    } else {
        res.send("please login");
    }

}

module.exports = { auth };