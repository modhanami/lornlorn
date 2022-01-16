export type Mocked<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer U
  ? T[P] & jest.Mock<U>
  : T[P];
};