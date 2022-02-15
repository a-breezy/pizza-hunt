const { Schema, model, Types } = require("mongoose");

const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
	{
		// sets custom id to prevent confusion with parent comment_id
		replyId: {
			type: Schema.Types.ObjectId,
			default: () => new Types.ObjectId(),
		},
		replyBody: {
			type: String,
			required: "You didn't reply!",
			trim: true,
		},
		writtenBy: {
			type: String,
			required: "You didn't give your name!",
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dateFormat(createdAtVal),
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
);

const CommentSchema = new Schema(
	{
		writtenBy: {
			type: String,
			required: "You didn't give your name!",
		},
		commentBody: {
			type: String,
			required: "You didn't comment!",
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dateFormat(createdAtVal),
		},
		// associate replies with comments.
		// populate replies with array from ReplySchema
		// nested within comment's data and not refered to
		replies: [ReplySchema],
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
);

CommentSchema.virtual("replyCount").get(function () {
	return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
