const Razorpay = require("razorpay");
var crypto = require("crypto");

var instance = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET,
});

module.exports.payment = async (req, response) => {
  const { amount } = req.body;
  let receipt_id = Math.random();
  receipt_id = receipt_id * 10000;
  receipt_id = Math.floor(receipt_id);
  var options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_" + receipt_id,
  };
  try {
    let order = await instance.orders.create(options);
    response.status(200).send({
      status: true,
      order,
    });
  } catch (error) {
    response.status(500).send({
      status: false,
      message: "server error",
      error,
    });
  }
};

module.exports.callback = async (request, response) => {
  let { payment_id, order_id, signature } = request.body;

  let bodyText = order_id + "|" + payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_SECRET)
    .update(bodyText.toString())
    .digest("hex");

  console.log("sig received ", signature);
  console.log("sig generated ", expectedSignature);

  var result = { status: false };

  if (expectedSignature === signature) result = { status: true };
  response.status(200).send(result);
};
