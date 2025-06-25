const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// POST para criar um compartilhamento
router.post('/', async (req, res) => {
    const sharedGamesCollection = req.app.locals.sharedGamesCollection;
    const {
        userId = '',
        gameId,
        gameTitle = '',
        gameType = '',
        shareCode = '',
        shareLink = '',
    } = req.body;

    // Se gameId foi enviado, valide
    if (gameId && !ObjectId.isValid(gameId)) {
        return res.status(400).json({ message: 'gameId inválido.' });
    }

    const newShare = {
        userId,
        gameId: gameId ? new ObjectId(gameId) : null,
        gameTitle,
        gameType,
        shareCode,
        shareLink,
        createdAt: new Date(),
        accessCount: 0,
    };

    try {
        const result = await sharedGamesCollection.insertOne(newShare);
        res.status(201).json({ message: 'Jogo compartilhado com sucesso!', insertedId: result.insertedId });
    } catch (error) {
        console.error('Erro ao salvar compartilhamento:', error);
        res.status(500).json({ message: 'Erro interno ao salvar compartilhamento.' });
    }
});

// GET para listar todos compartilhamentos do usuário
router.get('/', async (req, res) => {
    const sharedGamesCollection = req.app.locals.sharedGamesCollection;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'userId é obrigatório.' });
    }

    try {
        const sharedGames = await sharedGamesCollection.find({ userId }).toArray();
        res.json(sharedGames);
    } catch (error) {
        console.error('Erro ao buscar compartilhamentos:', error);
        res.status(500).json({ message: 'Erro interno ao buscar compartilhamentos.' });
    }
});

module.exports = router;
