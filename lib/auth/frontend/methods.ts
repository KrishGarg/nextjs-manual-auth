import axios from "@/lib/axios";
import { AxiosResponse } from "axios";

import {
  deleteAccessTokenInfo,
  deleteRefreshTokenInfo,
  getRefreshTokenInfo,
  setAccessTokenInfo,
  setRefreshTokenInfo,
} from "@/lib/auth/frontend/tokens";
import {
  LoginRequestBody,
  LoginResponseBody,
  LogoutRequestBody,
  LogoutResponseBody,
  RefreshRequestBody,
  RefreshResponseBody,
  SignupRequestBody,
  SignupResponseBody,
  SuperlogoutResponseBody,
  SuperlogoutRequestBody,
} from "@/lib/types/endpoint";

const signup = async (email: string, password: string) => {
  try {
    const res = await axios.post<
      {},
      AxiosResponse<SignupResponseBody>,
      SignupRequestBody
    >("/auth/signup", {
      email,
      password,
    });

    const { error } = res.data;

    if (!error) {
      const {
        tokens: {
          access: {
            token: accessToken,
            expiresInSeconds: accessTokenExpiresInSeconds,
          },

          refresh: {
            token: refreshToken,
            expiresInSeconds: refreshTokenExpiresInSeconds,
          },
        },
      } = res.data;
      if (accessToken && accessTokenExpiresInSeconds) {
        setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
      }
      if (refreshToken && refreshTokenExpiresInSeconds) {
        setRefreshTokenInfo(refreshToken, refreshTokenExpiresInSeconds);
      }
    }
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<
      {},
      AxiosResponse<LoginResponseBody>,
      LoginRequestBody
    >("/auth/login", {
      email,
      password,
    });

    const { error } = res.data;

    if (!error) {
      const {
        tokens: {
          access: {
            token: accessToken,
            expiresInSeconds: accessTokenExpiresInSeconds,
          },

          refresh: {
            token: refreshToken,
            expiresInSeconds: refreshTokenExpiresInSeconds,
          },
        },
      } = res.data;
      if (accessToken && accessTokenExpiresInSeconds) {
        setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
      }
      if (refreshToken && refreshTokenExpiresInSeconds) {
        setRefreshTokenInfo(refreshToken, refreshTokenExpiresInSeconds);
      }
    }
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

const logout = async () => {
  try {
    const token = getRefreshTokenInfo();
    const res = await axios.post<
      {},
      AxiosResponse<LogoutResponseBody>,
      LogoutRequestBody
    >("/auth/logout", {
      refreshToken: token?.token,
    });

    const { error } = res.data;

    if (!error) {
      deleteAccessTokenInfo();
      deleteRefreshTokenInfo();
    }

    return res.data;
  } catch (e) {
    console.error(e);
  }
};

const refresh = async () => {
  try {
    const token = getRefreshTokenInfo();
    const res = await axios.post<
      {},
      AxiosResponse<RefreshResponseBody>,
      RefreshRequestBody
    >("/auth/refresh", {
      refreshToken: token?.token,
    });

    const { error } = res.data;

    if (!error) {
      const {
        tokens: {
          access: {
            token: accessToken,
            expiresInSeconds: accessTokenExpiresInSeconds,
          },
          refresh: {
            token: refreshToken,
            expiresInSeconds: refreshTokenExpiresInSeconds,
          },
        },
      } = res.data;
      if (accessToken && accessTokenExpiresInSeconds) {
        setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
      }
      if (refreshToken && refreshTokenExpiresInSeconds) {
        setRefreshTokenInfo(refreshToken, refreshTokenExpiresInSeconds);
      }
    }

    return res.data;
  } catch (e) {
    console.error(e);
  }
};

const superlogout = async () => {
  try {
    const res = await axios.post<
      {},
      AxiosResponse<SuperlogoutResponseBody>,
      SuperlogoutRequestBody
    >("/superlogout");

    const { error } = res.data;
    if (!error) {
      deleteAccessTokenInfo();
      deleteRefreshTokenInfo();
    }
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export { signup, login, logout, refresh, superlogout };
