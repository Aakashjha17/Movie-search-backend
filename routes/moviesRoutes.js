import express from 'express';
import { getMovieRatingsAndReview,getAllMovies,deleteMovieById} from '../controllers/movieController.js';
const router = express.Router();

router.get('/get', getAllMovies);
router.get('/:movieName',getMovieRatingsAndReview)
router.delete('/:id', deleteMovieById)

export default router