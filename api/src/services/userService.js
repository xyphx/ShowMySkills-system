export const userService = {
  authenticate: async (email, password) => {
    return { id: "123", email, token: "jwt-token-example" };
  },

  createUser: async (userData) => {
    return { id: "123", ...userData };
  }
};
