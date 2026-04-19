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
  },
  
  // API版本
  version: 'v1',
};

// 完整的API端点URL
export const API_ENDPOINTS = {
  // Auth
  sendCode: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/send-code`,
  verifyCode: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/verify-code`,
  
  // User
  userInfo: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/users/me`,
  updateUser: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/users/me`,
  
  // Institution
  institutions: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/institutions`,
  institutionById: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/institutions/${id}`,
  
  // Pet
  pets: `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets`,
  petById: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/${id}`,
  petByInstitution: (institutionId: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets?institutionId=${institutionId}`,
  petStatus: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/${id}/status`,
  petApplicationCount: (petId: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/pet/${petId}/count`,
  
  // Adoption
  applications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications`,
  applicationById: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/${id}`,
  myApplications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/my`,
  pendingApplications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/pending`,
  applicationReview: (id: string) => `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/${id}/review`,
  myAdoptions: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/adoptions/my`,
};
