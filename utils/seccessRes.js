module.exports = successRes = (res, code, result) =>
  res.status(code).json({ status: "success", data: result });
