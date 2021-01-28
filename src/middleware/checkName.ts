import Response from "../lib/Response";

export const checkName = async (req, res, next) => {
  if (!req.body.name) {
    let resp = new Response().failed("Name not specified!");
    res.status(400).json(resp.getMessage());
  }
  next();
};
