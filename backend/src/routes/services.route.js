import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';
import { create, deleteAll, read ,deleteOne,update} from '../controllers/services.controller.js';

const router=Router();
router.route('/create').post(verifyJWT,upload.fields([
    { name: "serviceImage", maxCount: 1 },
    { name: "toolImage", maxCount: 10 },
     { name: "image", maxCount: 10 }
  ]),create);

router.route('/update/:id').patch(verifyJWT,upload.fields([
   { name: "serviceImage", maxCount: 1 },
    { name: "toolImage", maxCount: 10 },
     { name: "image", maxCount: 10 }
  ]),update);

router.route('/read').get(read);
router.route('/deleteOne/:id').patch(verifyJWT,deleteOne);
router.route('/deleteAll/:id').delete(verifyJWT,deleteAll);

export default router;