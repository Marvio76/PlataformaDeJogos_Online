const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// GET: Buscar todos os conteúdos de um usuário
router.get('/', async (req, res) => {
    const { userId } = req.query;
    const contentCollection = req.app.locals.contentCollection;

    try {
        const query = userId ? { createdBy: userId } : {};
        const content = await contentCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar conteúdos.' });
    }
});

// POST: Criar novo conteúdo
router.post('/', async (req, res) => {
    const contentCollection = req.app.locals.contentCollection;
    const { title, description, createdBy } = req.body;

    const newContent = {
        title,
        description,
        createdBy,
        createdAt: new Date()
    };

    try {
        const result = await contentCollection.insertOne(newContent);
        res.status(201).json({ ...newContent, _id: result.insertedId });
    } catch (err) {
        res.status(400).json({ message: 'Erro ao salvar o conteúdo.' });
    }
});

// PUT: Atualizar conteúdo existente
router.put('/:id', async (req, res) => {
    const contentCollection = req.app.locals.contentCollection;
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const result = await contentCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, description, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Conteúdo não encontrado.' });
        }

        res.json({ message: 'Conteúdo atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar o conteúdo.' });
    }
});

// DELETE: Remover conteúdo
router.delete('/:id', async (req, res) => {
    const contentCollection = req.app.locals.contentCollection;
    const { id } = req.params;

    try {
        const result = await contentCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Conteúdo não encontrado.' });
        }

        res.json({ message: 'Conteúdo removido com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao remover o conteúdo.' });
    }
});

module.exports = router;
