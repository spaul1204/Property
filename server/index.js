require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const property = require('./routes/property')
const db = require('./models/index')

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
app.use((req,res,next)=>{
    const error = new Error('Resource not found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next) =>{
    res.status(error.status || 500)
    res.json({
        error : {
            message : error.message
        }
    })
})


app.listen(port, () => {
    console.log("app has started on port", port);
})