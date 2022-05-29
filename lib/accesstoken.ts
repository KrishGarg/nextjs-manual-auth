let accessToken = "";

const setAccessToken = (val: string) => {
  accessToken = val;
  return;
};

const getAccessToken = () => {
  return accessToken;
};

export { setAccessToken, getAccessToken };
