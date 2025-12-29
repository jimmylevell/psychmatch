export interface User {
  _id: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}
