require('dotenv').config()

const express = require('express')
const router = express.Router()
const Property = require('../models/property')
const mongoose = require('mongoose')
const multer = require('multer')

//configuring file's storage options
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, 'Root/property_image/')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true)
    }
    else{
        cb(new Error('Only JPEG/JPG/PNG formats supported'),false)
    }
}
const upload = multer({ storage : storage, fileFilter : fileFilter })

//get properties based on search filters added
router.get('/',async (req,res,next)=>{
    let firstday,lastday

    if(req.query.locality){
        const localities = req.query.locality
        
        if(req.query.date){
            const date = req.query.date
            if(date == "This Week"){
                let result = getFirstAndLastDayOfCurrentWeek()
                firstday = result.firstday
                lastday = result.lastday
            }
            else if(date == "Last 5 weeks"){
                firstday = getLastNWeeksDate(5)
                lastday = new Date()
            }
            else{
                firstday = getLastNWeeksDate(15)
                lastday = new Date()
            }
            if(req.query.minPrice && req.query.maxPrice){
                let minPrice = req.query.minPrice
                let maxPrice = req.query.maxPrice
                await Property.find({locality : { $in: localities.split(",")} ,
                                             createdOn : {$gte: firstday, $lt: lastday},
                                             price : {$gte: minPrice, $lt: maxPrice}
                                            })
                                .then(result => res.status(200).json({response : result}))
                                .catch(next)
            }
            else{
                
                await Property.find({locality : { $in: localities.split(",") },
                                                    createdOn : {$gte: firstday, $lt: lastday}})
                                                    .then(result => res.status(200).json({response : result}))
                                                    .catch(next)
            }
        }
        else{
            await Property.find({locality : { $in: localities.split(",") }})
            .then(result => res.status(200).json({response : result}))
            .catch(next)
        }
    }
    else{
        await Property.find()
                        .then(result => res.status(200).json({response : result}))
                        .catch(next)
    }
    
})

//post a new property
router.post('/', upload.array('imageFile',5),async(req,res,next)=> {

    const { property, address, locality, description, price, carpetArea } = req.body
    const filePaths = []

    req.files.forEach( eachFile => filePaths.push(eachFile.path))

    if(req.files.length > 5){
        res.status(400).json({response : "Number of files uploaded cannot be greater than 5"})
    }
    else{
        await new Property({
            _id : mongoose.Types.ObjectId(),
            images : filePaths,
            propertyName : property,
            address, locality, description, price, carpetArea
        })
        .save()
        .then(result => res.status(201).json({response : "A new property has been added successfully"}))
        .catch(next)
    }
    
})

//send localities in dropdown filter
router.get('/get-localities',async(req,res,next) =>{
    await Property.distinct("locality")
    .then(result => res.status(200).json({response : result}))
    .catch(next)
})

//send price range for Slider
router.get('/get-price-range',async(req,res,next) =>{
   let minPrice, maxPrice
    //getting minPrice
    await Property.find({},{_id : 0, price : 1})
                  .sort({price : 1}).limit(1)
                  .then(result => {
                        minPrice = result[0]
                    })
                  .catch(next)
    
    //getting maxPrice
    await Property.find({},{_id : 0, price : 1})
                    .sort({price : -1})
                    .limit(1)
                    .then(result => {
                        maxPrice = result[0]
                    })
                    .catch(next)

    res.status(200).json({minPrice, maxPrice})
})

//getting top 10 recently added properties
router.get('/recently-added', async(req,res,next) =>{
    await Property.find({})
                    .sort({createdOn : -1})
                    .limit(10)
                    .then(result => {
                        console.log("result is ",result)
                        res.status(200).json({response : result })
                    })
                    .catch(next)
})

const getFirstAndLastDayOfCurrentWeek = () =>{
    let curr = new Date()
    let first = curr.getDate() - curr.getDay()
    let last = first + 6
    let firstday = new Date(curr.setDate(first)).toISOString()
    let lastday = new Date(curr.setDate(last)).toISOString()
    console.log(firstday,lastday)
    let result = { firstday, lastday }
    return result
}

const getLastNWeeksDate = n => {
    let today = new Date();
    let lastNweekDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-(7*n));
    return lastNweekDate;
}
module.exports = router