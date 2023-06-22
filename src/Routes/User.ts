import { NextFunction, Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNPROCESSABLE_ENTITY, CREATED } from 'http-status-codes';

const { getAllCollections, getCollection, createCollection } = require('../service/Collections');



const schemas = require('../routes/Schemas');

// Init shared
const router = Router();

router.post('/create', async (req: Request, res: Response, next:NextFunction) => {
    try{
       if (!req.body) {
           return res.status(BAD_REQUEST).json({"data": paramMissingError});
       }
       const response = await createCollection(req.body);
       return res.status(response.status).json({"data": response.data});
   }catch(error){
       next({error})
   }
});