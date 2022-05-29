import { ApiData } from "@/lib/constants";
import { User } from "@prisma/client";

export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface LoginResponseBody extends ApiData {
  accessToken?: string;
  refreshToken?: string;
}

export interface SignupRequestBody {
  email?: string;
  password?: string;
}

export interface SignupResponseBody extends ApiData {
  accessToken?: string;
  refreshToken?: string;
}

export interface LogoutRequestBody {
  refreshToken?: string;
}

export interface LogoutResponseBody extends ApiData {}

export interface RefreshRequestBody {
  refreshToken?: string;
}

export interface RefreshResponseBody extends ApiData {
  accessToken?: string;
  refreshToken?: string;
}

export interface MeRequestBody {}

export interface MeResponseBody extends ApiData {
  user?: Omit<User, "password">;
}
