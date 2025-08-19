import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';
import { create,read, update,deleteAll,deleteOne } from '../controllers/life.controller.js';

const router=Router();


router.route('/create').post(verifyJWT,upload.any(),create);
router.route('/read').get(read);
router.route('/update/:id').patch(verifyJWT,upload.any(),update);
router.route('/deleteOne/:id').patch(verifyJWT,upload.any(),deleteOne);
router.route('/deleteAll/:id').delete(verifyJWT,upload.any(),deleteAll);


export default router;