module.exports = async function (globalConfig, projectConfig) {
  // Force process exit to bypass open handles preventing Jest from closing
  // Useful when Redis or Mongoose connection pools don't drain immediately
  setTimeout(() => process.exit(0), 500);
};
