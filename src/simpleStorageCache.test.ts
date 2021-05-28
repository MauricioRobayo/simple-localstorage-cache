import Cache from "./simpleStorageCache";

interface TestData {
  test: string;
}

const STORAGE_KEY = "test";
const ONE_SECOND = 1000;

const testData: TestData = { test: "data" };

const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

afterEach(() => {
  jest.clearAllMocks();
});

it("should return null when it haven't been updated", () => {
  const cache = new Cache<TestData>(STORAGE_KEY, ONE_SECOND);
  expect(cache.get()).toBe(null);
  expect(getItemSpy).toBeCalledTimes(1);
  expect(getItemSpy).toBeCalledWith(`ssc-${STORAGE_KEY}`);
});

it("should update the cache", () => {
  const cache = new Cache<TestData>(STORAGE_KEY, ONE_SECOND);
  cache.update(testData);
  expect(setItemSpy).toBeCalledTimes(1);
  const cached = cache.get();
  expect(cached).not.toBeNull();
  expect(cached?.data).toEqual(testData);
  expect(cached?.expiration).toBeGreaterThan(Date.now());
  expect(getItemSpy).toBeCalledTimes(1);
});

it("should expire after a given number of seconds", async () => {
  const cache = new Cache<TestData>(STORAGE_KEY, ONE_SECOND);
  cache.update(testData);
  expect(cache.get()).toEqual({
    data: testData,
    expiration: expect.any(Number),
  });
  global.Date.now = jest.fn(() => new Date().getTime() + ONE_SECOND);
  expect(cache.get()).toBe(null);
});

it("should return null if expiration time is set to '0'", () => {
  const cache = new Cache<TestData>(STORAGE_KEY, 0);
  cache.update(testData);
  expect(setItemSpy).toBeCalledTimes(1);
  expect(cache.get()).toBe(null);
  expect(getItemSpy).toBeCalledTimes(1);
});

it("should use sessionStorage instead of localStorage", () => {
  const cache = new Cache<TestData>(STORAGE_KEY, ONE_SECOND, sessionStorage);
  cache.update(testData);
  expect(setItemSpy).toBeCalledTimes(1);
  const cached = cache.get();
  expect(cached).not.toBeNull();
  expect(cached?.data).toEqual(testData);
  expect(cached?.expiration).toBeGreaterThan(Date.now());
  expect(getItemSpy).toBeCalledTimes(1);
});
