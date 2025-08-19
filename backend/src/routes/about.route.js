import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';
import { create, read, update,deleteAll ,deleteOne} from '../controllers/about.controller.js';

const router=Router();

router.route('/create').post(verifyJWT,upload.fields([
    { name: "aboutImage", maxCount: 1 },
    { name: "aboutBannerImage", maxCount: 1 },
    { name: "partnerImages", maxCount: 10 },
     { name: "ideaImage", maxCount: 10 }
  ]),create);
  
router.route('/read').get(read);
router.route('/update/:id').patch(verifyJWT,upload.fields([
    { name: "aboutImage", maxCount: 1 },
    { name: "aboutBannerImage", maxCount: 1 },
    { name: "partnerImages", maxCount: 10 },
     { name: "ideaImage", maxCount: 10 }
  ]),update);

router.route('/deleteOne/:id').patch(verifyJWT,deleteOne);
router.route('/deleteAll/:id').delete(verifyJWT,deleteAll);
export default router;