import express from 'express'
import {Router} from 'express'
import { sendQandA } from '../controllers/devquest.controllers.js';

const devquestRoutes = Router();

devquestRoutes.get("/",sendQandA)

export default devquestRoutes;