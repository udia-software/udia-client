declare interface UserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  verificationExpiry: number;
}