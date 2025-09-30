const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth ,authAdmin } = require('../middlewares/auth');
const { UserModel, validUser, validLogin, createToken } = require('../models/userModel'); // ✅ ייבוא מלא
const router = express.Router();


router.get("/", async (req, res) => {
    res.json({ message: "You are authenticated!" });
});

router.post("/", async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "******";
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 });
        }
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});

router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ msg: "Password or email is wrong ,code:1" });
        }

        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is wrong ,code:2" });
        }

        let newToken = createToken(user._id,user.role);
        res.json({ token: newToken });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err" });
    }
});
router.get('/usersList', authAdmin, async (req, res) => {
    try {
        const data = await UserModel.find({}, { password: 0 });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'err', err });
    }
});

router.get("/myEmail", auth, async (req, res) => {
    try {
        let user = await UserModel.findOne(
            { _id: req.tokenData._id },
            { email: 1, _id: 0 }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});


router.get("/myInfo", auth, async (req, res) => {
    try {
        let user = await UserModel.findById(req.tokenData._id, { password: 0 });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});

module.exports = router;
