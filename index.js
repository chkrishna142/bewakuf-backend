const express = require('express');
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
require("dotenv").config();
var jwt = require('jsonwebtoken');



const cors = require('cors');
const { connection } = require('./config/db');
const { userModel } = require('./models/user.model');
const { auth } = require('./Auth/auth');
const { cartItem } = require('./models/cart.Model');


app.use(cors());



app.get('/', (req, res) => {
    res.send("welcom to backend");
})
//signup


app.post("/signup", async (req, res) => {


    const { email, name, phone, password } = req.body;


    const isUser = await userModel.findOne({ phone: phone });

    if (isUser) {
        res.send({ msg: "user already presnt" });
    }
    else {
        bcrypt.hash(password, 4, async function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                res.send({ msg: "something wrong with password" });
            }
            const new_user = new userModel({
                email,
                name,
                password: hash,
                phone,
            })
            try {
                await new_user.save();


                res.send(new_user);

            } catch (err) {
                res.send({ msg: "something wrong with password", err: err })
            }
        });

    }








})
//login


app.post("/login", async (req, res) => {
    const { phone, password } = req.body;

    const isUser = await userModel.findOne({ phone });

    const user_id = isUser._id;
    const hashed_password = isUser.password;



    bcrypt.compare(password, hashed_password, function (err, result) {
        if (err) {
            res.send({ msg: "error in password" });
        }
        if (result) {
            var token = jwt.sign({ user_id }, process.env.SECRECT_KEY);
            res.send({ msg: token });
        } else {
            request.send({ msg: "login failed" })

        }

    })

})



app.get("/getprofile", auth, async (req, res) => {
    const { user_id } = req.body;
    const user = await userModel.findOne({ _id: user_id });

    const { name, email } = user;

    res.send({ name: name, email: email });




})


app.post("/cartinput", auth, async (req, res) => {
    const { image, title, price, qty } = req.body;
    const { user_id } = req.body;


    const new_item = new cartItem({
        image,
        title,
        price,
        qty,
        user_id
    })
    try {
        await new_item.save();


        res.send(new_item);

    } catch (err) {
        res.send({ msg: "something wrong while adding to cart", err: err })
    }



})

app.get("/cartpage", auth, async (req, res) => {
    const { user_id } = req.body;

    const data = await cartItem.find({ user_id: user_id });
    if (data) {
        res.send(data);

    } else {
        res.send({ msg: "no cart items with this user" });
    }
})

app.delete("/cartpage/:_id", auth, async (req, res) => {
    const { user_id } = req.body;
    const _id = req.params._id;

    const data = await cartItem.findOneAndDelete({ user_id: user_id, _id: _id });
    if (data) {
        res.send(data);
        console.log("deleted data", data);
    } else {
        res.send({ msg: "no cart items with this user" });
    }
})

app.get("/deletecart", auth, async (req, res) => {
    const { user_id } = req.body;


    const data = await cartItem.deleteMany({ user_id: user_id });
    if (data) {
        res.send(data);
        console.log("alll      deleted data", data);
    } else {
        res.send({ msg: "no cart items with this user" });
    }
})



app.listen(5001, async () => {
    try {
        await connection;

        console.log("connected to db");


    } catch (err) {
        console.log("unable ot connect with db");
    }

    console.group(" your server at  http://localhost:5001");
})