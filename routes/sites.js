const express = require('express');
const { SiteModel, validateSite } = require('../models/siteModel');
const router = express.Router();

// GET all sites
router.get("/", async (req, res) => {
    let perPage = Math.min(20, parseInt(req.query.perPage)) || 4;
    let page = parseInt(req.query.page) || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse === "yes" ? 1 : -1;
    try {
        const sites = await SiteModel
            .find()
            .sort({ [sort]: reverse })
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json(sites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET by ID
router.get("/:id", async (req, res) => {
    try {
        const site = await SiteModel.findById(req.params.id);
        if (!site) return res.status(404).json({ message: "Not found" });
        res.json(site);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST
router.post("/", async (req, res) => {
    const { error } = validateSite(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const newSite = new SiteModel(req.body);
        await newSite.save();
        res.status(201).json(newSite);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put("/:id", async (req, res) => {
    const { error } = validateSite(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const updatedSite = await SiteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSite) return res.status(404).json({ message: "Not found" });
        res.json(updatedSite);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await SiteModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
