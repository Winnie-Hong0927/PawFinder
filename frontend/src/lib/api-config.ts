// 后端微服务 API 客户端配置
// 所有对后端的请求都通过这个配置进行

export const API_CONFIG = {
  // 后端网关地址
  gateway: process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080',
  
  // 各服务路径（通过网关路由）
  services: {
    user: '/api/user',
    pet: '/api/pet',
    adoption: '/api/adoption',
    order: '/api/order',
    payment: '/api/payment',
    search: '/api/search',
  },
  
  // API版本
  version: 'v1',
};

// 完整的API端点URL
export const API_ENDPOINTS = {
  // ==================== 认证模块 ====================
  // 发送验证码
  sendCode: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/send-code`,
  // 验证码登录
  verifyCode: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/verify-code`,
  // 获取当前用户信息
  me: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/me`,
  // 更新当前用户信息
  updateMe: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/update/me`,

  // ==================== 用户模块 ====================
  // 获取用户详情
  userById: (userId: string) => `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/users/${userId}`,
  // 根据手机号获取用户
  userByPhone: (phone: string) => `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/users/phone/${phone}`,

  // ==================== 机构模块 ====================
  // 机构列表
  institutions: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/institutions`,
  // 机构详情
  institutionById: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/institutions/${id}`,

  // ==================== 宠物模块 ====================
  // 宠物列表
  pets: `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets`,
  // 宠物详情
  petById: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/${id}`,
  // 更新宠物
  updatePet: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/update/${id}`,
  // 更新宠物状态
  updatePetStatus: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/status/${id}`,
  // 删除宠物
  deletePet: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/delete/${id}`,
  // 宠物申请人数
  petApplicationCount: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/${id}/application-count`,

  // ==================== 领养模块 ====================
  // 申请列表（管理员）
  applications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications`,
  // 申请详情
  applicationById: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/${id}`,
  // 我的申请列表
  myApplications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/my`,
  // 宠物申请人数
  applicationCountByPet: (petId: string) => `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/pet/${petId}/count`,
  // 审核申请
  reviewApplication: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/${id}/review`,
  // 取消申请
  cancelApplication: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/cancel/${id}`,

  // ==================== 订单模块 ====================
  // 创建订单 / 获取用户订单列表
  orders: `${API_CONFIG.gateway}${API_CONFIG.services.order}/v1/orders`,
  // 所有订单（管理员）
  allOrders: `${API_CONFIG.gateway}${API_CONFIG.services.order}/v1/all`,
  // 订单详情 / 取消订单
  orderByOrderNo: (orderNo: string) => `${API_CONFIG.gateway}${API_CONFIG.services.order}/v1/orders/${orderNo}`,
  cancelOrder: (orderNo: string) => `${API_CONFIG.gateway}${API_CONFIG.services.order}/v1/orders/${orderNo}/cancel`,

  // ==================== 支付模块 ====================
  // 创建支付
  createPayment: `${API_CONFIG.gateway}${API_CONFIG.services.payment}/v1/create`,
  // 支付回调
  paymentCallback: `${API_CONFIG.gateway}${API_CONFIG.services.payment}/v1/callback`,
  // 查询支付状态
  paymentStatus: (transactionNo: string) => `${API_CONFIG.gateway}${API_CONFIG.services.payment}/v1/status/${transactionNo}`,

  // ==================== 搜索模块 ====================
  // 搜索宠物
  searchPets: `${API_CONFIG.gateway}${API_CONFIG.services.search}/v1/pets`,
  // 同步宠物数据到 ES
  syncPets: `${API_CONFIG.gateway}${API_CONFIG.services.search}/v1/sync`,
};
