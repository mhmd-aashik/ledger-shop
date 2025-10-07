export interface CreateUserData {
 clerkId: string;
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