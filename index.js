const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const Pelicula = require('./models/Pelicula');

app.get('/api/pelicula', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/pelicula', autenticarToken, async (req, res) => {
    const { titulo, director, añoLanzamiento, genero, descripcion } = req.body;
    const pelicula = new Pelicula({
        titulo,
        director,
        añoLanzamiento,
        genero,
        descripcion
    });

    try {
        const nuevaPelicula = await pelicula.save();
        res.status(201).json(nuevaPelicula);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/peliculas/:id', autenticacionToken, async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({ message: 'Película no encontrada' });
        }

        pelicula.titulo = req.body.titulo || pelicula.titulo;
        pelicula.director = req.body.director || pelicula.director;
        pelicula.añoLanzamiento = req.body.añoLanzamiento || pelicula.añoLanzamiento;
        pelicula.genero = req.body.genero || pelicula.genero;
        pelicula.descripcion = req.body.descripcion || pelicula.descripcion;

        const peliculaActualizada = await pelicula.save();
        res.json(peliculaActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/pelicula/:id', autenticacionToken, async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({ message: 'Pelicula no encontrada' });
        }

        await pelicula.remove();
        res.json({ message: 'Pelicula eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    const token = req.header('Autorizacion') && req.header('Autorizacion').split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


app.post('/api/login', (req, res) => {
    const user = { name: req.body.name };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
});
