import { ApiData } from "@/types/general";
import { User } from "@prisma/client";

export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface LoginResponseBody extends ApiData {
  tokens: {
    access: {
      token?: string;
      expiresInSeconds?: number;
    };
    refresh: {
      token?: string;
      expiresInSeconds?: number;
    };
  };
}

export interface SignupRequestBody {
  email?: string;
  password?: string;
}

export interface SignupResponseBody extends ApiData {
  tokens: {
    access: {
      token?: string;
      expiresInSeconds?: number;
    };
    refresh: {
      token?: string;
      expiresInSeconds?: number;
    };
  };
}

export interface LogoutRequestBody {
  refreshToken?: string;
}

export interface LogoutResponseBody extends ApiData {}

export interface RefreshRequestBody {
  refreshToken?: string;
}

export interface RefreshResponseBody extends ApiData {
  tokens: {
    access: {
      token?: string;
      expiresInSeconds?: number;
    };
    refresh: {
      token?: string;
      expiresInSeconds?: number;
    };
  };
}

export interface MeRequestBody {}

export interface MeResponseBody extends ApiData {
  user?: Omit<User, "password">;
}

export interface HealthRequestBody {}

export interface HealthResponseBody extends ApiData {}

export interface SuperlogoutRequestBody {}

export interface SuperlogoutResponseBody extends ApiData {}
