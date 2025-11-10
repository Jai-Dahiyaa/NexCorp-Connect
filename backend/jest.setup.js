jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn().mockResolvedValue({ rows: [] }),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

jest.mock('redis', () => {
  return {
    createClient: jest.fn(() => ({
      connect: jest.fn(),
      on: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      quit: jest.fn(),
    })),
  };
});
