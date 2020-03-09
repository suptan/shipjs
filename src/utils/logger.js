import ENABLE_LOG_DEBUG from 'src/config';

export const logError = (message, object) => {
  console.log(message, object);
};

export const logInfo = (message) => {
  console.log(message);
};

export const logDebug = (message, object) => {
  if (!ENABLE_LOG_DEBUG) return;
  console.log(message, object);
};

export const logWarn = (message, object) => {
  console.log(message, object);
};
