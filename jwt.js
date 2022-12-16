import { expressjwt } from "express-jwt";
import { config } from "dotenv";
config();

export default expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  getToken: (req) => {
    if(req.cookies.token) {
      return req.cookies.token;
    }
    return null
  }
});
