import { getOr } from 'lodash/fp';
import { logInfo } from "utils";

export default (err, req, res, next) => { //eslint-disable-line
  logInfo('Create error response back to client');

  if (err) {
    const { name: type } = err;
    const statusCode = getOr(500, 'statusCode', err);
    // Handle Sequlize error
    const validationErrorMessage = getOr(null, 'errors[0].messages[0]', err);
    const message = validationErrorMessage || err.message;
    return res.status(statusCode || 500).send({ type, message });
  }
};
