import express from 'express';
import {
  addTablets,
  getTabletActivity,
  getTablets,
} from '../models/tabletsModel';

const tabletsRouter = express.Router();

tabletsRouter.get('/', getTablets);
tabletsRouter.get('/:tabletId', getTabletActivity);
tabletsRouter.post('/', addTablets);
export default tabletsRouter;
