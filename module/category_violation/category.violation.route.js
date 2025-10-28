import express from 'express';
import ViolationController from './category.violation.controller.js';
import ViolationValidation from './category.violation.validation.js';
import middlewareAuth from '../../middlewares/authenticate.js';

const router=express.Router();

router.post('/create',middlewareAuth.authenticate,ViolationValidation.ValidationCreateCategoryViolation,ViolationController.createViolationController);
router.put('/update/:id',middlewareAuth.authenticate,ViolationValidation.ValidationUpdateCategoryViolation,ViolationController.updateViolationController);
router.delete('/delete/:id',middlewareAuth.authenticate,ViolationController.deleteViolationController);
router.get('/detail/:id',middlewareAuth.authenticate,ViolationController.getDetailViolationController);
router.get('/get-all',middlewareAuth.authenticate,ViolationController.getListViolationController);

export default router;
