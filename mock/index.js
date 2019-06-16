import Mock from 'mockjs';

const platform = [];
const cout = 100;

for (let i = 0; i < cout; i++) {
  platform.push(Mock.mock({
    add: 1,
    sub: 1,
    stat: 0,
    reg: 1,
    appName: '@first',
    appId: '@guid',
    id: '@increment'
  }))
}

Mock.mock('account/login', 'post', (option) => {
  const { username, psd } = JSON.parse(option.body);
  if (username === 'admin' && psd === 'admin') {
    return { code: 200, msg: 'success', data: { accessToken: Mock.mock('@guid'), userName: Mock.mock('@name') } };
  }
  return { code: 400, msg: '帐号或密码错误' };
});

Mock.mock('api/authApps/page?pageNum=1&pageSize=20', 'get', response => {
  console.log(response)
  const pageNum = 1;
  const pageSize = 20;
  const pagelist = platform.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))
  return {
    code: 200,
    msg: '请求成功',
    pageData: pagelist,
    pageNum: 1,
    pageSize: 20,
    total: platform.length
  };
});
