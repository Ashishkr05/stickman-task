import Data from "../models/data.js";

export const adminHomePageController = async (req, res) => {
  if (req.auth?.type !== "admin") {
    return res.redirect("/login-admin");
  }
  let { left, right } = req.body;
  let leftDate = new Date(left || 0),
    rightDate = right ? new Date(right) : new Date();

  const data = await Data.aggregate([
    {
      $addFields: {
        created_on: { $toDate: "$_id" },
      },
    },
    {
      $match: {
        created_on: {
          $gt: leftDate,
          $lt: rightDate,
        },
      },
    }
  ]);
  console.log(data);

  return res.render("admin", {
    username: req.auth.username,
    right,
    left,
    data,
    err: data.length === 0 && "No data in given range",
  });
};
