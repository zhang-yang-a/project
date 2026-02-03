module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'jsx',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  testMatch: [
    '**/tests/unit/**/*.test.(js|jsx|vue)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,vue,jsx}',
    '!src/main.js' // Exclude entry point
  ]
};