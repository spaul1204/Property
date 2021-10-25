const chai = require('chai')
const chaiHttp = require('chai-http')
const propertySchema = require('../models/property')
chai.use(chaiHttp)
// chai.use(require('chai-json-schema'));
chai.should()

const baseUrl = 'http://localhost:9000'

let request = require('supertest')(baseUrl);

describe('checking property routes', ()=>{
    it('GET /property/get-localities should respond with a lost of available localities', async()=> {
        try{
            const response = await chai.request(baseUrl)
                .get('/property/get-localities')
                response.should.have.status(200)
                response.should.be.a('object')
                response.body.should.have.a.property('response')
                response.body.response.should.be.an('array')
        }
        catch(err){
            console.log("err is ",err)
        }
    })

    it('GET /property/get-price-range should respond with min and max price', async()=> {
        try{
            const response = await chai.request(baseUrl)
                .get('/property/get-price-range')
                // console.log("response body ",response.body)
                response.should.have.status(200)
                response.should.be.a('object')
                response.body.should.have.all.keys('minPrice','maxPrice')
        }
        catch(err){
            console.log("err is ",err)
        }
    })

    it('POST /property should list all the properties', async () => {
       try{
        
        const response = await chai.request(baseUrl)
            .post('/property')
            .set('content-type', 'multipart/form-data')
            .field('property', 'Prestige NewLife')
            .field('address', 'HRBR Layout')
            .field('locality', 'Whitefield')
            .field('price', '12000000')
            .field('carpetArea', '2000')
            .field('description', 'North East facing property')
            // .attach('imageFile',  '/Users/snehapaul/git_projects/Project Images/types-of-homes-hero.jpeg')
            response.should.have.status(201)
            
       }
       catch(error){
        console.log("Error is ",error)
       }
    });
});




