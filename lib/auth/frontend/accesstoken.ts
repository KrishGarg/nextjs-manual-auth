let accessToken = "";
let accessTokenExpiresAt = 0;

const setAccessToken = (val: string) => {
  accessToken = val;
  return;
};

const getAccessToken = () => {
  return accessToken;
};

const setAccessTokenExpiresAt = (val: number) => {
  accessTokenExpiresAt = val;
  return;
};

const getAccessTokenExpiresAt = () => {
  return accessTokenExpiresAt;
};

export {
  setAccessToken,
  getAccessToken,
  setAccessTokenExpiresAt,
  getAccessTokenExpiresAt,
};
