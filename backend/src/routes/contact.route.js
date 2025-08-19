import {Router} from 'express';
import { create, deleteAll, deleteOne, read,update } from '../controllers/contact.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router=Router();

router.route('/create').post(verifyJWT,upload.single('contactImage'),create);
router.route('/read').get(read);
router.route('/update/:id').patch(verifyJWT,upload.single('contactImage'),update);
router.route('/deleteOne/:id').patch(verifyJWT,deleteOne);
router.route('/deleteAll/:id').delete(verifyJWT,deleteAll);

export default router;