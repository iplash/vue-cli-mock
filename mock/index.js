import Mock from 'mockjs';

Mock.mock('/account/login', 'post', (option) => {
  const { username, pwd } = JSON.parse(option.body);
  if (username === 'admin' && pwd === 'admin') {
    return { code: 200, msg: 'success', data: { accessToken: Mock.mock('@guid'), userName: Mock.mock('@name') } };
  }
  return { code: 400, msg: '帐号或密码错误' };
});

Mock.mock('/api/authApps/page', 'post', (option) => {
  const { username, pwd } = JSON.parse(option.body);
  return { code: 400, msg: '帐号或密码错误' };
});
