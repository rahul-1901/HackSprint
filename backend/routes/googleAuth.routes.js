import { Router } from 'express';
import { googleAuthLogin } from '../controllers/googleLogin.controllers.js';

const googleRoute = Router();
googleRoute.get('/authInfo', googleAuthLogin);

export default googleRoute;