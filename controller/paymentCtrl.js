const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_zEYfygsbq3teOk",
  key_secret: "I1h44tbW7zZhUNcQgddkOQts",
});

const checkout = async (req, res) => {
  const amount = req.body?.amount;
  const recepitId = req.body?.orderId;
  try {
    const option = {
      amount: amount * 100,
      currency: "INR",
      receipt: recepitId
    };
    // receipt:
    console.log('option: ', option)
    const order = await instance.orders.create(option);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const paymentverification = async (req, res) => {
  try {
    const { razorpayOrderId, razorpaymentId } = req.body;
    res.json({
      razorpayOrderId,
      razorpaymentId,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  checkout,
  paymentverification,
};
