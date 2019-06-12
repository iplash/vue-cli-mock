export function setUserInfo(userInfo) {
  return sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function getUserInfo() {
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return {};
}

export function clearStorage() {
  return sessionStorage.clear();
}
