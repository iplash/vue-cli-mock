import Mock from 'mockjs';

Mock.mock('/account/login', 'post', (option) => {
  console.log(option.body);
  const { username, pwd } = JSON.parse(option.body);
  if (username === 'admin' && pwd === 'admin') {
    return { code: 200, msg: 'success', data: { accessToken: Mock.mock('@guid'), userName: Mock.mock('@name') } };
  }
  return { code: 400, msg: '帐号或密码错误' };
});
