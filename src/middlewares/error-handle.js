

export default (err, req, res, next) => {
  if (err) {
    const { name: type, message, statusCode } = err;
    return res.status(statusCode).send({ type, message });
  }
};
