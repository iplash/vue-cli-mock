import Mock from 'mockjs';

Mock.mock('/account/login', 'post', (option) => {
  let { username, pwd } = JSON.parse(option.body)
  return (username === 'admin' && pwd === 'admin')
})