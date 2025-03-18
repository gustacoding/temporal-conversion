process.env.NODE_ENV = 'test';
process.env.PORT = 4001;

console.log = jest.fn();
console.error = jest.fn();
