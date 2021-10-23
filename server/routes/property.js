require('dotenv').config()

const express = require('express')
const router = express.Router()
const propertyController = require('../controller/property')
const fileHandler = require('../middleware/fileHandler')
const catchAsync = require('../utils/CatchAsync')
const validateProperty = require('../middleware/paramsValidation')



//get properties based on search filters added
router.get('/', catchAsync(propertyController.getNewProperties))

//post a new property
router.post('/', fileHandler.upload.array('imageFile',5), validateProperty.validateProperty, catchAsync(propertyController.postANewProperty))

//send localities in dropdown filter
router.get('/get-localities', catchAsync(propertyController.getLocalities))

//send price range for Slider
router.get('/get-price-range', catchAsync(propertyController.sliderForPriceRange))

//getting top 10 recently added properties
router.get('/recently-added', catchAsync(propertyController.getRecentlyAddedProperties))


module.exports = router