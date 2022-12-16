import Data from "../models/data.js";

export const formController = async (req, res) => {
  const { name, len } = req.body;
  for (let i = 0; i < Number(len); i++) {
    const number = req.body[`input-${i}`];
    const count = (await Data.find().count()) + 1001;
    const data = new Data({ name, number, id: count });
    await data.save();
  }
  res.render("form", {
    username: req.auth.username,
    status: "Data Entry Successful",
  });
};
