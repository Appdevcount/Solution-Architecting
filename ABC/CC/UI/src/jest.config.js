module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  "coveragePathIgnorePatterns": [
      "/node_modules/",
      "/src/assets/",
      "/src/auth/",
      "/src/components/ErrorBoundary/",
      "/src/components/RequestSummary/Attachments.tsx",
      "/src/config/",
      "/src/context/",
      "/src/enum/",
      "/src/layout/",
      "/src/pages/",
      "/src/services/",
      "/src/state/",
      "/src/types/",
      "/src/utils/",
    ]
};
