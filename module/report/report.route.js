import express from 'express';
const router=express.Router();
import Controller from './report.controller.js';
import Validation from './report.validation.js';
import Middleware from '../../middlewares/authenticate.js';

router.post('/create',Middleware.authenticate,Validation.validationCreateReport,Controller.createReportController);

export default router;
