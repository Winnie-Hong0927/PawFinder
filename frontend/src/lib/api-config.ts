// 后端微服务 API 客户端配置
// 所有对后端的请求都通过这个配置进行

// 是否使用网关模式（true: 通过网关调用, false: 直接调用各微服务）
const USE_GATEWAY = process.env.NEXT_PUBLIC_USE_GATEWAY !== 'false';

// 各微服务端口配置（优先从环境变量读取）
const SERVICE_PORTS = {
  user: parseInt(process.env.NEXT_PUBLIC_USER_SERVICE_PORT || '8081'),
  pet: parseInt(process.env.NEXT_PUBLIC_PET_SERVICE_PORT || '8082'),
  adoption: parseInt(process.env.NEXT_PUBLIC_ADOPTION_SERVICE_PORT || '8083'),
  order: parseInt(process.env.NEXT_PUBLIC_ORDER_SERVICE_PORT || '8084'),
  payment: parseInt(process.env.NEXT_PUBLIC_PAYMENT_SERVICE_PORT || '8085'),
  search: parseInt(process.env.NEXT_PUBLIC_SEARCH_SERVICE_PORT || '8086'),
};

// 基础地址
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost';

// 获取服务完整地址
const getServiceUrl = (serviceName: keyof typeof SERVICE_PORTS) => {
  if (USE_GATEWAY) {
    // 网关模式：所有请求通过网关
    const gatewayPort = process.env.NEXT_PUBLIC_API_GATEWAY_PORT || '8080';
    return `${BASE_URL}:${gatewayPort}`;
  } else {
    // 直连模式：直接调用各微服务
    return `${BASE_URL}:${SERVICE_PORTS[serviceName]}`;
  }
};

export const API_CONFIG = {
  // 是否使用网关
  useGateway: USE_GATEWAY,
  
  // 各服务地址
  services: {
    user: getServiceUrl('user'),
    pet: getServiceUrl('pet'),
    adoption: getServiceUrl('adoption'),
    order: getServiceUrl('order'),
    payment: getServiceUrl('payment'),
    search: getServiceUrl('search'),
  },
  
  // API版本
  version: 'v1',
};

// 完整的API端点URL
export const API_ENDPOINTS = {
  // ==================== 认证模块 (user-service: 8081) ====================
  // 发送验证码
  sendCode: `${API_CONFIG.services.user}/api/user/v1/auth/send-code`,
  // 验证码登录
  verifyCode: `${API_CONFIG.services.user}/api/user/v1/auth/verify-code`,
  // 获取当前用户信息
  me: `${API_CONFIG.services.user}/api/user/v1/auth/me`,
  // 更新当前用户信息
  updateMe: `${API_CONFIG.services.user}/api/user/v1/auth/update/me`,

  // ==================== 用户模块 (user-service: 8081) ====================
  // 获取用户详情
  userById: (userId: string) => `${API_CONFIG.services.user}/api/user/v1/users/${userId}`,
  // 根据手机号获取用户
  userByPhone: (phone: string) => `${API_CONFIG.services.user}/api/user/v1/users/phone/${phone}`,

  // ==================== 机构模块 (user-service: 8081) ====================
  // 机构列表
  institutions: `${API_CONFIG.services.user}/api/user/v1/institutions`,
  // 机构详情
  institutionById: (id: string) => `${API_CONFIG.services.user}/api/user/v1/institutions/${id}`,

  // ==================== 宠物模块 (pet-service: 8082) ====================
  // 宠物列表
  pets: `${API_CONFIG.services.pet}/api/pet/v1/pets`,
  // 宠物详情
  petById: (id: string) => `${API_CONFIG.services.pet}/api/pet/v1/pets/${id}`,
  // 更新宠物
  updatePet: (id: string) => `${API_CONFIG.services.pet}/api/pet/v1/pets/update/${id}`,
  // 更新宠物状态
  updatePetStatus: (id: string) => `${API_CONFIG.services.pet}/api/pet/v1/pets/status/${id}`,
  // 删除宠物
  deletePet: (id: string) => `${API_CONFIG.services.pet}/api/pet/v1/pets/delete/${id}`,
  // 宠物申请人数
  petApplicationCount: (id: string) => `${API_CONFIG.services.pet}/api/pet/v1/pets/${id}/application-count`,

  // ==================== 领养模块 (adoption-service: 8083) ====================
  // 申请列表（管理员）
  applications: `${API_CONFIG.services.adoption}/api/adoption/v1/applications`,
  // 申请详情
  applicationById: (id: string) => `${API_CONFIG.services.adoption}/api/adoption/v1/applications/${id}`,
  // 我的申请列表
  myApplications: `${API_CONFIG.services.adoption}/api/adoption/v1/applications/my`,
  // 宠物申请人数
  applicationCountByPet: (petId: string) => `${API_CONFIG.services.adoption}/api/adoption/v1/applications/pet/${petId}/count`,
  // 审核申请
  reviewApplication: (id: string) => `${API_CONFIG.services.adoption}/api/adoption/v1/applications/${id}/review`,
  // 取消申请
  cancelApplication: (id: string) => `${API_CONFIG.services.adoption}/api/adoption/v1/applications/cancel/${id}`,

  // ==================== 订单模块 (order-service: 8084) ====================
  // 创建订单 / 获取用户订单列表
  orders: `${API_CONFIG.services.order}/api/order/v1/orders`,
  // 所有订单（管理员）
  allOrders: `${API_CONFIG.services.order}/api/order/v1/all`,
  // 订单详情 / 取消订单
  orderByOrderNo: (orderNo: string) => `${API_CONFIG.services.order}/api/order/v1/orders/${orderNo}`,
  cancelOrder: (orderNo: string) => `${API_CONFIG.services.order}/api/order/v1/orders/${orderNo}/cancel`,

  // ==================== 支付模块 (payment-service: 8085) ====================
  // 创建支付
  createPayment: `${API_CONFIG.services.payment}/api/payment/v1/create`,
  // 支付回调
  paymentCallback: `${API_CONFIG.services.payment}/api/payment/v1/callback`,
  // 查询支付状态
  paymentStatus: (transactionNo: string) => `${API_CONFIG.services.payment}/api/payment/v1/status/${transactionNo}`,

  // ==================== 搜索模块 (search-service: 8086) ====================
  // 搜索宠物
  searchPets: `${API_CONFIG.services.search}/api/search/v1/pets`,
  // 同步宠物数据到 ES
  syncPets: `${API_CONFIG.services.search}/api/search/v1/sync`,
};
