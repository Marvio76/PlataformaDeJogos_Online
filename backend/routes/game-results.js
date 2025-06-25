const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Rota para salvar resultado de jogo
router.post('/', async (req, res) => {
    const resultsCollection = req.app.locals.resultsCollection;

    const {
        userId,
        gameId,
        gameTitle,
        gameType,
        score,
        mistakes,
        timeElapsed,
        completedAt
    } = req.body;

    // Valida campos obrigatórios
    if (!userId || !gameId || score == null || mistakes == null || timeElapsed == null) {
        return res.status(400).json({ message: 'Dados obrigatórios faltando.' });
    }

    // Valida apenas o gameId (ObjectId)
    if (!ObjectId.isValid(gameId)) {
        return res.status(400).json({ message: 'gameId inválido.' });
    }

    const newResult = {
        userId, // Mantém como string, sem converter para ObjectId
        gameId: new ObjectId(gameId),
        gameTitle,
        gameType,
        score,
        mistakes,
        timeElapsed,
        completedAt: completedAt ? new Date(completedAt) : new Date()
    };

    try {
        const result = await resultsCollection.insertOne(newResult);
        res.status(201).json({ message: 'Resultado salvo com sucesso!', insertedId: result.insertedId });
    } catch (error) {
        console.error('Erro ao salvar resultado:', error);
        res.status(500).json({ message: 'Erro interno ao salvar resultado.' });
    }
});

module.exports = router;
