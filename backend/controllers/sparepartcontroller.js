import Sparepart from "../models/sparepartmodel.js";
import fs from 'fs';
import path from 'path';

// GET all
export async function getSpareparts(req, res) {
    try {
        const data = await Sparepart.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// POST with image
export async function createSparepart(req, res) {
    try {
        const { name, stock, price, supplierId } = req.body;
        const image = req.file ? req.file.filename : null;

        const newData = await Sparepart.create({ name, stock, price, supplierId, image });
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// PUT
export async function updateSparepart(req, res) {
    try {
        const { id } = req.params;
        const { name, stock, price, supplierId } = req.body;

        const spare = await Sparepart.findByPk(id);
        if (!spare) return res.status(404).json({ message: "Not found" });

        if (req.file) {
            if (spare.image) {
                fs.unlinkSync(`./uploads/${spare.image}`);
            }
            spare.image = req.file.filename;
        }

        await spare.update({ name, stock, price, supplierId });
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// DELETE
export async function deleteSparepart(req, res) {
    try {
        const { id } = req.params;
        const spare = await Sparepart.findByPk(id);
        if (!spare) return res.status(404).json({ message: "Not found" });

        if (spare.image) {
            fs.unlinkSync(`./uploads/${spare.image}`);
        }

        await spare.destroy();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
