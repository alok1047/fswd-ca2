require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    releaseYear: Number,
    availableCopies: { type: Number, required: true }
}));

const app = express();
app.use(express.json());

app.post('/movies', async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/movies/:id?', async (req, res) => {
    const movie = req.params.id ? await Movie.findById(req.params.id) : await Movie.find();
    movie ? res.json(movie) : res.status(404).json({ error: "Movie not found" });
});


app.put('/movies/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ error: "Invalid movie ID format" });

        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        movie ? res.json(movie) : res.status(404).json({ error: "Movie not found" });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/movies/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    movie ? res.json({ message: "Movie deleted" }) : res.status(404).json({ error: "Movie not found" });
});

app.listen(process.env.PORT, () => console.log(`Server running on port http://localhost:${process.env.PORT}`));



// kill -9 $(lsof -t -i :5000)