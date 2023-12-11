import axios from 'axios'
import movieModel from '../models/movies.js'

export const getMovieRatingsAndReview = async(req,res) => {
    const movieName = req.params.movieName
    const findOptions = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/title/find',
        params: {
            q: movieName
        },
        headers: {
            'X-RapidAPI-Key': '0c31a675e1mshc0259baef27e2b9p13fbfejsn24a37e39ee69',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    try {
        const findResponse = await axios.request(findOptions);

        if (!findResponse) {
            return res.status(403).json({success:false,message:"No such movie"});
        }
        const movieResult = findResponse.data.results.find(result => result.titleType === "movie")

        const movieId = movieResult.id.split("/title/")[1];
        const ratingsOptions = {
            method: 'GET',
            url: 'https://imdb8.p.rapidapi.com/title/get-ratings',
            params: {
                tconst: movieId
            },
            headers: {
                'X-RapidAPI-Key': '0c31a675e1mshc0259baef27e2b9p13fbfejsn24a37e39ee69',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        };

        const ratingsResponse = await axios.request(ratingsOptions);

        const reviewOptions = {
            method: 'GET',
            url: 'https://imdb8.p.rapidapi.com/title/get-user-reviews',
            params: {
                tconst: movieId
            },
            headers: {
                'X-RapidAPI-Key': '0c31a675e1mshc0259baef27e2b9p13fbfejsn24a37e39ee69',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        }
        const reviewResponse = await axios.request(reviewOptions)

        const detailsOptions = {
            method: 'GET',
            url: 'https://imdb8.p.rapidapi.com/title/get-details',
            params: {
                tconst: movieId
            },
            headers: {
                'X-RapidAPI-Key': '0c31a675e1mshc0259baef27e2b9p13fbfejsn24a37e39ee69',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        };

        const details = await axios.request(detailsOptions);
        const Top3review = reviewResponse.data.reviews.slice(0, 3).map((review, index) => `${review.reviewText.replace(/\n/g, ' ')}`);
        const movieData = new movieModel({
            title: movieName,
            image: details.data.image.url,
            review : Top3review,
            rating : ratingsResponse.data.rating
        })
        
        const savedData = await movieData.save()
        return res.status(200).json(savedData)
    } catch (error) {
        return res.status(500).send(`Error fetching movie details: ${error.message}`);
    }
}

export const getAllMovies = async (req, res) => {
    try {
        const movies = await movieModel.find();
        return res.status(200).json(movies);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

export const deleteMovieById = async (req, res) => {
    const movieId = req.params.id;

    try {
        const existingMovie = await movieModel.findByIdAndDelete(movieId);
        if (!existingMovie) {
            return res.status(404).json({ error: 'Movie not found', message: 'No movie with the specified ID' });
        }
        return res.status(200).json({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};