import { User } from '../types';

const MOCK_DELAY = 500;

export const AuthService = {
  login: async (email: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate login - in real app would validate creds
        resolve({
          id: 'user_1', // Mock ID
          name: email.split('@')[0],
          email,
          currentGameId: undefined, // Default no game
          streak: 3,
        });
      }, MOCK_DELAY);
    });
  },

  signup: async (name: string, email: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          name,
          email,
          streak: 1,
        });
      }, MOCK_DELAY);
    });
  },
  
  // Helper to switch user for testing
  mockSwitchUser: async (userId: string): Promise<User> => {
      return {
          id: userId,
          name: userId === 'user_1' ? 'Player One' : 'Player Two',
          email: userId === 'user_1' ? 'p1@test.com' : 'p2@test.com',
          streak: 3
      }
  }
};
