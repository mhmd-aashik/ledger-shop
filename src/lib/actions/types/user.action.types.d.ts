export interface CreateUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}
