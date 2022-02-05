const { Comment, Pizza } = require("../models");
const { db } = require("../models/Pizza");

const commentController = {
	// add comment to a pizza
	addComment({ params, body }, res) {
		console.log(body);
		Comment.create(body)
			.then(({ _id }) => {
				return Pizza.findOneAndUpdate(
					{ _id: params.pizzaId },
					// $push adds comment _id to pizza being updated
					{ $push: { comments: _id } },
					// return the updated pizza with comment
					{ new: true }
				);
			})
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: "No pizza found with this id!" });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},

	// remove comment from a pizza
	removeComment({ params }, res) {
		Comment.findOneAndDelete({ _id: params.commentId })
			.then((deletedComment) => {
				if (!deletedComment) {
					return res.status(404).json({ message: "No comment with this id!" });
				}
				return Pizza.findOneAndUpdate(
					{ _id: params.pizzaId },
					{ $pull: { comments: params.commentId } },
					{ new: true }
				);
			})
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: "No pizza found with this id" });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},
};

module.exports = commentController;
