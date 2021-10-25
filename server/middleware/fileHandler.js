
const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, `Root/property_image/${file.originalname}`)
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

module.exports = { upload }

// const cloudinary = require('cloudinary').v2
// const { CloudinaryStorage } = require('multer-storage-cloudinary')

// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key : process.env.CLOUD_API_KEY,
//     api_secret : process.env.CLOUD_API_SECRET
// })

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params:{
//         folder : 'ROOT/property_image/',
//         allowed_formats : ['jpeg','png','jpg'],
//         use_filename : true
//     }
    
// })

// const upload = multer({ storage : storage })

module.exports = { upload }


