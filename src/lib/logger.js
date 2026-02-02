const formatPayload = (level, message, context = {}) => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  ...context,
});

export const logInfo = (message, context) => {
  console.info(formatPayload('info', message, context));
};

export const logWarn = (message, context) => {
  console.warn(formatPayload('warn', message, context));
};

export const logError = (message, context) => {
  console.error(formatPayload('error', message, context));
};
