const Order = require("../model/ordermodel");

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        //  ONLY REAL REVENUE
        $match: {
          paymentStatus: "paid",
          orderStatus: { $ne: "cancelled" },
          refundStatus: "none",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "",
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                  ],
                  "$_id.month",
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          total: 1,
        },
      },
    ]);

    res.status(200).json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Monthly revenue calculation failed" });
  }
};
