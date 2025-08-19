import {Router} from 'express';
import { create, deleteAll, read, updateAll, updateOne,deleteOne } from '../controllers/career.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router=Router();

router.route('/create').post(verifyJWT,upload.single('careerImage'),create);
router.route('/read').get(read);
router.route('/updateOne/:id').patch(verifyJWT,upload.single('careerImage'),updateOne);
router.route('/updateAll/:id').patch(verifyJWT,upload.single('careerImage'),updateAll);
router.route('/deleteOne/:id').patch(verifyJWT,upload.single('careerImage'),deleteOne);
router.route('/deleteAll/:id').delete(verifyJWT,deleteAll);



export default router;