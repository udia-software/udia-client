// Setup test file for running browser application tests using NodeJS

interface ITestGlobal extends NodeJS.Global {
  localStorage: any
}

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}

declare var global: ITestGlobal;
global.localStorage = localStorageMock;
