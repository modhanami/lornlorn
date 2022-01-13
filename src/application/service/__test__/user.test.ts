import { User } from "../../../domain/user";
import { createUserService } from "../user";

describe(`User service`, () => {
  let userGateway;
  let userService;

  const user1: User = {
    email: 'abc@def.com',
    username: 'abc',
    password: '123',
  };

  const user1Persisted: User = {
    ...user1,
    id: 1,
  };

  beforeEach(() => {
    userGateway = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    userService = createUserService(userGateway);
  });

  describe('create', () => {
    it('should create a user', async () => {
      userGateway.findByUsername.mockResolvedValue(null);
      userGateway.save.mockResolvedValue(user1Persisted);

      const createdUser = await userService.create(user1);

      expect(createdUser).toEqual(user1Persisted);
    });

    it('should throw an error if user already exists', async () => {
      userGateway.findByUsername.mockResolvedValue(user1Persisted);

      await expect(userService.create(user1)).rejects.toThrow('User already exists');
    });
  });


  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      userGateway.findByEmail.mockResolvedValue(user1Persisted);

      const user = await userService.findByEmail(user1.email);

      expect(user).toEqual(user1Persisted);
    });

    it('should return null if user does not exist', async () => {
      userGateway.findByEmail.mockResolvedValue(null);

      const user = await userService.findByEmail(user1.email);

      expect(user).toBeNull();
    });
  });


  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      userGateway.findByUsername.mockResolvedValue(user1Persisted);

      const user = await userService.findByUsername(user1.username);

      expect(user).toEqual(user1Persisted);
    });

    it('should return null if user does not exist', async () => {
      userGateway.findByUsername.mockResolvedValue(null);

      const user = await userService.findByUsername(user1.username);

      expect(user).toBeNull();
    });
  });


  describe('findById', () => {
    it('should find a user by id', async () => {
      userGateway.findById.mockResolvedValue(user1Persisted);

      const user = await userService.findById(user1Persisted.id);

      expect(user).toEqual(user1Persisted);
    });

    it('should return null if user does not exist', async () => {
      userGateway.findById.mockResolvedValue(null);

      const user = await userService.findById(user1Persisted.id);

      expect(user).toBeNull();
    });
  });
});