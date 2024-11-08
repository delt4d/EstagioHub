import { Router } from 'express';
import 'express-async-errors';
import adminRoutes from './admin';
import logoutRoutes from './logout';
import studentRoutes from './student';
import supervisorRoutes from './supervisor';
import userRoutes from './user';

export default function () {
    const routes = Router();

    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);
    routes.use('/supervisor', supervisorRoutes);
    routes.use('/student', studentRoutes);
    routes.use('/logout', logoutRoutes);

    return routes;
}
