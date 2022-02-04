export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export type VKTokenPayload = {
  access_token: string;
  expires_in: number;
  user_id: number;
};

export type VKUserDataPayload = {
  id: number;
  first_name: string;
  last_name: string;
  deactivated?: string;
  can_access_closed: boolean;
  is_closed: boolean;
};

export type JWTPayload = {
  id: number;
  vkId: number;
  role: Role;
};
