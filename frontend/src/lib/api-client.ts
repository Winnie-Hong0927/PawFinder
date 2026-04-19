/**
 * PawFinder 后端 API 客户端
 * 封装所有对后端微服务的 HTTP 请求
 */

import { API_ENDPOINTS, API_CONFIG } from './api-config';

// 标准响应格式
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 分页响应格式
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

// 请求选项
interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// 通用请求方法
async function request<T>(
  url: string,
  options: RequestInit = {},
  needAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // 如果需要认证，从 cookie 获取 token
  if (needAuth && typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();
  
  if (result.code !== 0) {
    throw new Error(result.message || 'Request failed');
  }

  return result.data;
}

// ============ Auth APIs ============

export async function sendVerificationCode(phone: string): Promise<void> {
  return request(
    API_ENDPOINTS.sendCode,
    {
      method: 'POST',
      body: JSON.stringify({ phone }),
    },
    false
  );
}

export async function verifyCode(phone: string, code: string, name?: string): Promise<{
  token: string;
  userId: string;
  user: {
    id: string;
    phone: string;
    name: string;
    role: string;
    avatar_url?: string;
  };
}> {
  return request(
    API_ENDPOINTS.verifyCode,
    {
      method: 'POST',
      body: JSON.stringify({ phone, code, name }),
    },
    false
  );
}

// ============ User APIs ============

export async function getCurrentUser(): Promise<{
  id: string;
  phone: string;
  name: string;
  role: string;
  email?: string;
  avatar_url?: string;
  institution_id?: string;
  adopter_status?: string;
}> {
  return request(API_ENDPOINTS.userInfo);
}

export async function updateUser(data: {
  name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  address?: string;
}): Promise<void> {
  return request(API_ENDPOINTS.updateUser, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ============ Institution APIs ============

export async function getInstitutions(params?: {
  type?: string;
  status?: string;
  page?: number;
  size?: number;
}): Promise<PageResult<{
  id: string;
  name: string;
  type: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  description?: string;
  logo_url?: string;
  status: string;
}>> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set('type', params.type);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.size) searchParams.set('size', String(params.size));

  const url = `${API_ENDPOINTS.institutions}${searchParams.toString() ? '?' + searchParams : ''}`;
  return request(url, {}, false);
}

export async function getInstitutionById(id: string): Promise<{
  id: string;
  name: string;
  type: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  description?: string;
  logo_url?: string;
  business_hours?: string;
}> {
  return request(API_ENDPOINTS.institutionById(id), {}, false);
}

// ============ Pet APIs ============

export interface PetVO {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  gender?: string;
  size?: string;
  images: string[];
  description?: string;
  traits?: string[];
  health_status?: string;
  vaccination_status?: boolean;
  sterilization_status?: boolean;
  shelter_location?: string;
  adoption_fee?: number;
  status: string;
  institution_id?: string;
  institution_name?: string;
  created_at: string;
  updated_at: string;
}

export async function getPets(params?: {
  species?: string;
  status?: string;
  institutionId?: string;
  page?: number;
  size?: number;
}): Promise<PageResult<PetVO>> {
  const searchParams = new URLSearchParams();
  if (params?.species) searchParams.set('species', params.species);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.institutionId) searchParams.set('institutionId', params.institutionId);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.size) searchParams.set('size', String(params.size));

  const url = `${API_ENDPOINTS.pets}${searchParams.toString() ? '?' + searchParams : ''}`;
  return request(url, {}, false);
}

export async function getPetById(id: string): Promise<PetVO & { application_count?: number }> {
  return request(API_ENDPOINTS.petById(id), {}, false);
}

export async function createPet(data: {
  name: string;
  species: string;
  breed?: string;
  age?: string;
  gender?: string;
  size?: string;
  images?: string[];
  description?: string;
  traits?: string[];
  health_status?: string;
  vaccination_status?: boolean;
  sterilization_status?: boolean;
  shelter_location?: string;
  adoption_fee?: number;
  institution_id?: string;
}): Promise<string> {
  return request(API_ENDPOINTS.pets, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePet(
  id: string,
  data: Partial<{
    name: string;
    breed: string;
    age: string;
    gender: string;
    size: string;
    images: string[];
    description: string;
    traits: string[];
    health_status: string;
    vaccination_status: boolean;
    sterilization_status: boolean;
    shelter_location: string;
    adoption_fee: number;
    status: string;
  }>
): Promise<void> {
  return request(API_ENDPOINTS.petById(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updatePetStatus(
  id: string,
  status: 'available' | 'pending' | 'adopted' | 'offline'
): Promise<void> {
  return request(API_ENDPOINTS.petStatus(id), {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function deletePet(id: string): Promise<void> {
  return request(API_ENDPOINTS.petById(id), {
    method: 'DELETE',
  });
}

export async function getPetApplicationCount(petId: string): Promise<number> {
  return request(API_ENDPOINTS.petApplicationCount(petId), {}, false);
}

// ============ Adoption APIs ============

export interface ApplicationVO {
  id: string;
  pet_id: string;
  user_id: string;
  pet?: PetVO;
  user?: {
    id: string;
    name: string;
    phone: string;
  };
  reason?: string;
  living_condition?: string;
  experience?: string;
  has_other_pets?: boolean;
  other_pets_detail?: string;
  status: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getMyApplications(): Promise<ApplicationVO[]> {
  return request(API_ENDPOINTS.myApplications);
}

export async function getPendingApplications(params?: {
  page?: number;
  size?: number;
}): Promise<PageResult<ApplicationVO>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.size) searchParams.set('size', String(params.size));

  const url = `${API_ENDPOINTS.pendingApplications}${searchParams.toString() ? '?' + searchParams : ''}`;
  return request(url);
}

export async function getApplicationById(id: string): Promise<ApplicationVO> {
  return request(API_ENDPOINTS.applicationById(id));
}

export async function createApplication(data: {
  pet_id: string;
  reason: string;
  living_condition?: string;
  experience?: string;
  has_other_pets?: boolean;
  other_pets_detail?: string;
}): Promise<string> {
  return request(API_ENDPOINTS.applications, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function reviewApplication(
  id: string,
  data: {
    status: 'approved' | 'rejected';
    admin_notes?: string;
  }
): Promise<void> {
  return request(API_ENDPOINTS.applicationReview(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getMyAdoptions(): Promise<{
  id: string;
  pet_id: string;
  pet?: PetVO;
  adoption_date: string;
  notes?: string;
}[]> {
  return request(API_ENDPOINTS.myAdoptions);
}
