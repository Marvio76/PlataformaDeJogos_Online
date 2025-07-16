const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// ROTA PARA BUSCAR TODOS OS JOGOS
// Filtra para mostrar:
// - jogos públicos para todos
// - jogos privados somente do usuário que solicitou (via query ?userId=...)
router.get('/', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    const userId = req.query.userId;

    try {
        const allGames = await gamesCollection.find().sort({ createdAt: -1 }).toArray();

        // Filtra jogos para retornar conforme visibilidade
        const filteredGames = allGames.filter(game => {
            if (game.visibility === 'public') {
                return true;
            }
            if (game.visibility === 'private' && game.createdBy === userId) {
                return true;
            }
            return false;
        });

        res.json(filteredGames);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar os jogos." });
    }
});

// ROTA PARA CRIAR UM NOVO JOGO
router.post('/', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    const { title, description, gameType, data, createdBy, visibility } = req.body;

    // Define visibility como 'private' se não informado
    const gameDocument = {
        title,
        description,
        gameType,
        data,
        createdBy,
        visibility: visibility || 'private',
        createdAt: new Date()
    };

    try {
        const result = await gamesCollection.insertOne(gameDocument);
        const newGame = { ...gameDocument, _id: result.insertedId };
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: "Erro ao salvar o jogo no banco de dados." });
    }
});

// ROTA PARA SALVAR O RESULTADO DE UMA PARTIDA
router.post('/:gameId/results', async (req, res) => {
    const { gameId } = req.params;
    const { playerName, score, timeSpent, correctAnswers, totalQuestions } = req.body;
    const resultsCollection = req.app.locals.resultsCollection;

    const newResult = {
        gameId: new ObjectId(gameId),
        playerName,
        score,
        timeSpent,
        correctAnswers,
        totalQuestions,
        completedAt: new Date()
    };

    try {
        await resultsCollection.insertOne(newResult);
        res.status(201).json({ message: 'Resultado salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao salvar o resultado.' });
    }
});

// ROTA PARA BUSCAR UM JOGO PELO ID
router.get('/:gameId', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    const { gameId } = req.params;

    try {
        const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });

        if (!game) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        res.json(game);
    } catch (error) {
        console.error('Erro ao buscar jogo por ID:', error);
        res.status(500).json({ message: 'Erro ao buscar o jogo.' });
    }
});

module.exports = router;
