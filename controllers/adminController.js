import Data from "../models/data.js";

export const adminHomePageController = async (req, res) => {
  if (req.auth?.type !== "admin") {
    return res.redirect("/login-admin");
  }
  let { left, right } = req.body;

  const data = await Data.find({
    id: {
      $gt: String(left || "0000"),
      $lt: String(right || "9999"),
    },
  }, null, { sort: { _id: -1 }});
  return res.render("admin", {
    username: req.auth.username,
    right,
    left,
    data,
    err: data.length === 0 && "No data in given range",
  });
};
