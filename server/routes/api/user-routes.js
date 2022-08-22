const router = require('express').Router();
const envRoute = process.env.ENV_ROUTE;

const {
  createUser,
  getBooks,
  getSingleBook,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

router.route('/').post(createUser)
router.route('/books').get(getBooks);
// router.route(`/${envRoute}`).post(saveBook);
router.route('/login').post(login);
router.route('/me').get(authMiddleware, getSingleUser);
router.route(`/books/:bookId`).get(getSingleBook);
router.route(`/${envRoute}/:bookId`).delete(deleteBook);

module.exports = router;
