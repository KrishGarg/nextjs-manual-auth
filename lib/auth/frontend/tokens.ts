const ACCESS_TOKEN_STORAGE_NAME = "access-token";
const REFRESH_TOKEN_STORAGE_NAME = "refresh-token";

interface AccessTokenStorage {
  token: string;
  expiresAt: number;
}

interface RefreshTokenStorage {
  token: string;
  expiresAt: number;
}

const setAccessTokenInfo = (token: string, expiresInSeconds: number) => {
  const storageInfo: AccessTokenStorage = {
    token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
  sessionStorage.setItem(
    ACCESS_TOKEN_STORAGE_NAME,
    JSON.stringify(storageInfo)
  );
  return;
};

const getAccessTokenInfo = () => {
  const info = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_NAME);
  if (info) return JSON.parse(info) as AccessTokenStorage;
  return null;
};

const deleteAccessTokenInfo = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_NAME);
  return;
};

const setRefreshTokenInfo = (token: string, expiresInSeconds: number) => {
  const storageInfo: RefreshTokenStorage = {
    token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
  localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, JSON.stringify(storageInfo));
  return;
};

const getRefreshTokenInfo = () => {
  const info = localStorage.getItem(REFRESH_TOKEN_STORAGE_NAME);
  if (info) return JSON.parse(info) as RefreshTokenStorage;
  return null;
};

const deleteRefreshTokenInfo = () => {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_NAME);
  return;
};

export {
  setAccessTokenInfo,
  getAccessTokenInfo,
  deleteAccessTokenInfo,
  setRefreshTokenInfo,
  getRefreshTokenInfo,
  deleteRefreshTokenInfo,
};
