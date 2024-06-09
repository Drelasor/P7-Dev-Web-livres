const express = require('express');
const router = express.Router();
const bookCtrl = require("../controllers/books");
const auth = require('../middleware/auth');
const { upload, compressImage } = require('../middleware/multer-config');


router.post('/', auth, upload, compressImage, bookCtrl.createBook);
router.delete('/:id', auth,bookCtrl.deleteBook); 
router.put('/:id', auth, upload, compressImage, bookCtrl.modifyBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating',bookCtrl.getBestRatings);
router.get('/:id',bookCtrl.getOneBook);
router.post('/:id/rating',auth,bookCtrl.postRating);


module.exports = router;