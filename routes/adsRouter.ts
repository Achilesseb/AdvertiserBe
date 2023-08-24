import express from 'express';
import { getAds } from '../models/adsModel';
const adsRouter = express.Router();

adsRouter.get('/', getAds);

export default adsRouter;
