module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePaths: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper: {
      '^@/components/(.*)$': '<rootDir>/components/$1',
      '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
      '^@/services/(.*)$': '<rootDir>/services/$1',
      '^@/types/(.*)$': '<rootDir>/types/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/', '/coverage/', '/public/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
  };
  