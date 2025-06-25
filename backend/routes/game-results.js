const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

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

    if (!gameId || !ObjectId.isValid(gameId)) {
        return res.status(400).json({ message: 'gameId inválido ou ausente.' });
    }

    if (score !== undefined && isNaN(Number(score))) {
        return res.status(400).json({ message: 'score deve ser um número válido.' });
    }

    if (mistakes !== undefined && isNaN(Number(mistakes))) {
        return res.status(400).json({ message: 'mistakes deve ser um número válido.' });
    }

    if (timeElapsed !== undefined && isNaN(Number(timeElapsed))) {
        return res.status(400).json({ message: 'timeElapsed deve ser um número válido.' });
    }

    const newResult = {
        userId: userId || '',
        gameId: new ObjectId(gameId),
        gameTitle: gameTitle || '',
        gameType: gameType || '',
        score: Number(score) || 0,
        mistakes: Number(mistakes) || 0,
        timeElapsed: Number(timeElapsed) || 0,
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


router.get('/', async (req, res) => {
    const resultsCollection = req.app.locals.resultsCollection;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'userId é obrigatório' });
    }

    try {
        const results = await resultsCollection
            .find({ userId })
            .sort({ completedAt: -1 })
            .toArray();

        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        res.status(500).json({ message: 'Erro interno ao buscar resultados.' });
    }
});

module.exports = router;
