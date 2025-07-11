import { Router } from 'express';
import { googleAuthLogin, userData } from '../controllers/googleLogin.controllers.js';
import { userAuth } from '../middlewares/userAuth.js';

const googleRoute = Router();
googleRoute.get('/authInfo', googleAuthLogin);
googleRoute.get('/userData', userAuth, userData)

export default googleRoute;