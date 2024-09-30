const config = {
    verbose: true,
    collectCoverageFrom: [
        '**/src/*.{js,ts}',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/dist/**',
      ],
  };
  
module.exports = config;