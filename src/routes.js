const express = require('express');
const { KV } = require('./modules');

const apiRouter = express.Router();

apiRouter.get('/kv', async (req, res) => {
    try {
        const kvs = await KV.findAll();
        return res.json({ data: kvs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

apiRouter.get('/kv/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const kv = await KV.findOne({ where: { key } });

        if (kv) {
            return res.json({ data: kv });
        } else {
            return res.status(404).json({ error: 'Key not found' });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/kv', async (req, res) => {
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).json({
            error: 'Key and value are required'
        });
    }

    try {
        const existingKv = await KV.findOne({ where: { key } });
        if (existingKv) {
            return res.status(400).json({
                error: 'Key already present in db'
            });
        } else {
            const newKv = await KV.create({ key, value });
            return res.status(201).json({
                data: newKv
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

apiRouter.put('/kv/:key', async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    if (!value) {
        return res.status(400).json({
            error: 'Value is required'
        });
    }
    try {
        const [updatedCount] = await KV.update({ value }, { where: { key } });
        if (updatedCount > 0) {
            const updateKv = await KV.findOne({ where: { key } });
            if (updateKv) {
                return res.json({
                    data: updateKv
                });
            } else {
                return res.status(404).json({
                    error: 'Key not found'
                });
            }
        } else {
            return res.status(404).json({
                error: 'Key not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

apiRouter.delete('/kv/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const deleted = await KV.destroy({ where: { key } });
        if (deleted > 0) {
            return res.sendStatus(204);
        } else {
            return res.status(404).json({
                error: 'Key not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

module.exports = apiRouter;