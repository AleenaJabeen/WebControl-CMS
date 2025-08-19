import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { create, update,read, deleteAll, deleteOne } from '../controllers/home.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router=Router();

router.route('/create').post(verifyJWT, upload.fields([

  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "imageUrl", maxCount: 5 },
  { name: "directorImage", maxCount: 1 },
  { name: "directorSignature", maxCount: 1 },
   { name: "logoUrl", maxCount: 1 },
]), // Add as many banner image fields as needed
   
  create);

router.route('/read').get(read);

router.route('/update/:id').patch(verifyJWT, upload.fields([

  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "imageUrl", maxCount: 5 },
  { name: "directorImage", maxCount: 1 },
  { name: "directorSignature", maxCount: 1 },
   { name: "logoUrl", maxCount: 1 },
]), // Add as many banner image fields as needed
   update);

router.route('/deleteOne/:id').patch(verifyJWT, upload.fields([

  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "imageUrl", maxCount: 5 },
  { name: "directorImage", maxCount: 1 },
  { name: "directorSignature", maxCount: 1 },
   { name: "logoUrl", maxCount: 1 },
]), // Add as many banner image fields as needed
   deleteOne);
router.route('/deleteAll/:id').delete(verifyJWT, upload.fields([

  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "imageUrl", maxCount: 5 },
  { name: "directorImage", maxCount: 1 },
  { name: "directorSignature", maxCount: 1 },
   { name: "logoUrl", maxCount: 1 },
]), // Add as many banner image fields as needed
   deleteAll);



export default router;    