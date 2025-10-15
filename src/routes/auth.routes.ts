import { Router } from 'express';
import { createAdminController, loginController, refreshTokenController, signupController } from '../controllers/auth.controller';
const authRoute = Router();

authRoute.post('/signup',  signupController);
authRoute.post('/login',  loginController);
authRoute.post('/me',  refreshTokenController);
authRoute.post('/admin', createAdminController);
export default authRoute;
