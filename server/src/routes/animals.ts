import { Router } from "express";
import { AnimalController } from "../controllers/animalController";

const router = Router();
const animalController = new AnimalController();

// Research a single animal
router.post('/research', (req, res) => {
    animalController.researchAnimal(req, res);
});

// Get all researched animal cards (with optional filters)
router.get('/cards', (req, res) => {
    animalController.getAllCards(req, res);
});

// get id and scienfific name of all animals in the database
router.get('/cards/all', (req, res) => {
    animalController.getAllCardIds(req, res);
});

// update image url of a specific animal card with id
router.put('/cards/:id/image', (req, res) => {
    animalController.updateImageUrl(req, res);
});

// Research multiple animals in batch
router.post('/research/batch', (req, res) => {
    animalController.researchBatch(req, res);
});

// Get specific animal card by ID
router.get('/cards/:id', (req, res) => {
    animalController.getCardById(req, res);
});

router.get('/random/card', (req, res) => {
    animalController.getRandomCard(req, res);
})

// Get cards by difficulty level
router.get('/cards/difficulty/:level', (req, res) => {
    animalController.getCardsByDifficulty(req, res);
});

// Get cards by type (simple/exotic)
router.get('/cards/type/:cardType', (req, res) => {
    animalController.getCardsByType(req, res);
});

// Get database statistics
router.get('/stats', (req, res) => {
    animalController.getStats(req, res);
});

export default router;