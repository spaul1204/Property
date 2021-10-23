require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const property = require('./routes/property')
const db = require('./models/index')
const ExpressError = require('./utils/ExpressError')

//connecting to the database
db.connect()
    .then(()=> console.log('Database Connected'))
    .catch(err => console.log( 'Database err is ',err ));

const app = express()
const port = 9000 || process.env.port;

app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({limit : '50mb', extended: true}));
app.use(cors());
app.use('/Root/property_image',express.static('Root/property_image'))

//initialise routes
app.use('/property',property)

//Error handling
app.all('*',(req, res, next) =>{
    next(new ExpressError('Page Not Found',404))
})

app.use((error,req,res,next) =>{
    const { statusCode = 500, message = "Something went wrong" } = error
    res.status(statusCode).send(message)
})


app.listen(port, () => {
    console.log("app has started on port", port);
})