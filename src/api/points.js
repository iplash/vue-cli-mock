import request from '@/utils/request';

// 积分系统注册平台列表
export function getAuthList(query) {
  return request({
    url: 'api/authApps/page',
    method: 'get',
    params: query,
  });
}

// 积分系统注册平台列表 all
export function getAllAuthList() {
  return request({
    url: 'api/authApps/list',
    method: 'get',
  });
}

// 停用 || 启用 平台使用积分系统
export function openOrDown(data) {
  return request({
    url: 'api/authApps/openOrDown',
    method: 'post',
    data,
  });
}

// 开启 || 关闭 平台注册积分系统用户、增加积分、减少积分
export function updateRights(data) {
  return request({
    url: 'api/authApps/updateRights',
    method: 'post',
    data,
  });
}

// 删除积分系统注册平台
export function deletePlatForm(data) {
  return request({
    url: 'api/authApps/delete',
    method: 'post',
    data,
  });
}

// 添加积分系统注册平台
export function addPlatform(data) {
  return request({
    url: 'api/authApps/add',
    method: 'post',
    data,
  });
}

// 积分规则列表
export function getRuleList(query) {
  return request({
    url: 'api/pointsRule/page',
    method: 'get',
    params: query,
  });
}

// 添加积分规则
export function addRule(data) {
  return request({
    url: 'api/pointsRule/add',
    method: 'post',
    data,
  });
}

// 更新积分规则
export function updateRule(data) {
  return request({
    url: 'api/pointsRule/update',
    method: 'post',
    data,
  });
}

// 积分活动列表
export function getPromotionList(query) {
  return request({
    url: 'api/promotion/page',
    method: 'get',
    params: query,
  });
}

// 添加积分规则
export function addPromotion(data) {
  return request({
    url: 'api/promotion/add',
    method: 'post',
    data,
  });
}

// 更新积分活动
export function updatePromotion(data) {
  return request({
    url: 'api/promotion/update',
    method: 'post',
    data,
  });
}

// 更新积分活动
export function deletePromotion(data) {
  return request({
    url: 'api/promotion/delete',
    method: 'post',
    data,
  });
}

// 开启关闭活动积分活动
export function openOrDownPromotion(data) {
  return request({
    url: 'api/promotion/openOrDown',
    method: 'post',
    data,
  });
}

// 积分系统用户列表
export function getVipUser(query) {
  return request({
    url: 'api/vipUser/page',
    method: 'get',
    params: query,
  });
}

// 获取积分流水列表
export function getMinusPoints(query) {
  return request({
    url: 'api/minusPoints/page',
    method: 'get',
    params: query,
  });
}

// 获取异常积分列表
export function getPointsFails(query) {
  return request({
    url: 'api/addPointsFails/page',
    method: 'get',
    params: query
  })
}

// 异常积分处理
export function addPointsFails(data) {
  return request({
    url: 'api/addPointsFails/recover',
    method: 'post',
    data
  })
}
