const express = require('express');
const mongoose = require('mongoose');
const app = express();

//Configuracion ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// Configurar EJS como motor de plantillas para una ruta específica
app.engine('ejs', require('ejs').renderFile);

// Middleware para procesar los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/videojuegos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected!');
    }).catch((error) => {
    console.error('MongoDB connection error:', error);
    });

//Esquema de datos
const juegoSchema = new mongoose.Schema({
    titulo: {
      type: String,
      required: true,
    },
    produccion: {
      type: String,
      required: true,
    },
    fecha_lanzamiento: {
      type: Number,
      required: true,
    },
    genero: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
});

// Crear el modelo de datos a partir del esquema
const Juego = mongoose.model('juego', juegoSchema);

// Ruta para la página principal
app.get('/', async (req, res) => {
    res.render('index', { 
        titulos: [
          'Base de Datos',
          '¡Bienvenido a la base de datos de videojuegos!',
          'Ver videojuegos',
          'Agregar videojuego'
        ],
    });
});

// Ruta para ver los elementos del formulario
app.get('/ver_videojuegos', async (req, res) => {
    const juegos = await Juego.find().exec();
    res.render('view', { juegos });
  });

//Ruta para agregar elementos en el formulario para la base de datos
app.get('/agregar_videojuegos', async (req, res) =>{
    res.render('create', { juego: new Juego() });
});

// Ruta para el envio de los datos hacia la vista
app.post('/envio', async (req, res) => {

    const juego = new Juego({
        titulo: req.body.titulo,
        produccion: req.body.produccion,
        fecha_lanzamiento: req.body.fecha_lanzamiento,
        genero: req.body.genero,
        imagen: req.body.imagen,
        descripcion: req.body.descripcion,
    });
  
    try{
        await juego.save();
        res.redirect('/ver_videojuegos');
    }
    catch{
        res.render('create', {juego});
    }
});

// Puerto de escucha del servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});