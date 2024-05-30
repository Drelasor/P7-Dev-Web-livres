const express = require('express');
const router = express.Router();
const bookCtrl = require("../controllers/books");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, bookCtrl.createBook);
router.delete('/:id', auth, bookCtrl.deleteBook); 
router.put('/:id', auth, bookCtrl.modifyBook);
router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, bookCtrl.getOneBook);


module.exports = router;