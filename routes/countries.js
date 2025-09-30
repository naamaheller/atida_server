const express = require("express");
const { auth } = require("../middlewares/auth");
const { CountryModel, validCountry } = require("../models/countryModel");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let perPage = Math.min(req.query.perPage, 20) || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        let data = await CountryModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse });

        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});


router.post("/", auth, async (req, res) => {
    let validBody = validCountry(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let country = new CountryModel(req.body);
        country.user_id = req.tokenData._id;
        await country.save();
        res.status(201).json(country);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});


router.put("/edit/:idEdit", auth, async (req, res) => {
    let validBody = validCountry(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let idEdit = req.params.idEdit;
        let data = await CountryModel.updateOne(
            { _id: idEdit, user_id: req.tokenData._id },
            req.body
        );
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});


router.delete("/del/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data = await CountryModel.deleteOne({
            _id: idDel,
            user_id: req.tokenData._id, // 👈 בודק שזה היוצר
        });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});

module.exports = router;
