
const Property = require('../models/property')
const mongoose = require('mongoose')
const ExpressError = require('../utils/ExpressError')

const getNewProperties = async (req,res,next)=>{
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
}

const postANewProperty = async(req,res,next)=> {

    const { property, address, locality, description, price, carpetArea } = req.body
    const filePaths = []
    console.log("req files ",req.files)
    req.files.forEach( eachFile => filePaths.push(eachFile.path))

    if(req.files.length > 5){
        res.status(400).json({response : "Number of files uploaded cannot be greater than 5"})
        return next(new ExpressError('A maximum of 5 images can be uploaded'))
    }
    else{
        const newCreatedProperty = await new Property({
            _id : mongoose.Types.ObjectId(),
            images : filePaths,
            propertyName : property,
            address, locality, description, price, carpetArea
        })
        newCreatedProperty.save()
        res.status(201).json({response : "A new property has been added successfully"})
    }
    
}

const getLocalities = async (req,res,next) =>{
    const getLocalities = await Property.distinct("locality")
    res.status(200).json({response : getLocalities})
}

const sliderForPriceRange = async(req,res,next) =>{
     //getting minPrice
     const minPrice = await Property.find({},{_id : 0, price : 1})
                                    .sort({price : 1})
                                    .limit(1)
     
     //getting maxPrice
     const maxPrice = await Property.find({},{_id : 0, price : 1})
                                    .sort({price : -1})
                                    .limit(1)
        console.log("price range ",minPrice[0])
     res.status(200).json({minPrice : minPrice[0], maxPrice : maxPrice[0]})
 }

 const getRecentlyAddedProperties = async(req,res,next) =>{
    const recentlyAddedProperties = await Property.find({})
                    .sort({createdOn : -1})
                    .limit(10)
                   
    res.status(200).json({response : recentlyAddedProperties })
}

const getFirstAndLastDayOfCurrentWeek = () =>{
    let curr = new Date()
    let first = curr.getDate() - curr.getDay()
    let last = first + 6
    let firstday = new Date(curr.setDate(first)).toISOString()
    let lastday = new Date(curr.setDate(last)).toISOString()
    let result = { firstday, lastday }
    return result
}

const getLastNWeeksDate = n => {
    let today = new Date();
    let lastNweekDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-(7*n));
    return lastNweekDate;
}

module.exports = { getNewProperties ,postANewProperty , getLocalities, sliderForPriceRange, getRecentlyAddedProperties}