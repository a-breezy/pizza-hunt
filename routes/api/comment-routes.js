const router = require("express").Router();
const {
	addComment,
	removeComment,
	addReply,
	removeReply,
} = require("../../controllers/comment-controller.js");

// /api/comments/:pizzaId
router.route("/:pizzaId").post(addComment);

// /api/comments/:pizzaId/:commentId
// route to update reply based on comment and delete comment
// these routes can be combined because reply updates a comment
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

// /api/comment/:pizzaId/:commentId/:replyId
// route to delete reply by id
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
