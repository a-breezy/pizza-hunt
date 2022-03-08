const { Schema, model } = require("mongoose");

const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
	{
		pizzaName: {
			type: String,
			// required makes field validation
			required: "You must include a pizza name!",
			// trim removes whitespace before and after input
			trim: true,
		},
		createdBy: {
			type: String,
			required: true,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dateFormat(createdAtVal),
		},
		size: {
			type: String,
			required: true,
			// enumerable - data set that can be iterated over
			enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
			default: "Large",
		},
		toppings: [],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
);

// create Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// get total cound of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
	return this.comments.reduce(
		(total, comment) => total + comment.replies.length + 1,
		0
	);
});

module.exports = Pizza;
