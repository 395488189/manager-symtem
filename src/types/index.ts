// ========== 通用类型 ==========

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页结果 */
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 通用响应结构 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// ========== 患者相关 ==========

export interface Patient {
  id: number
  name: string
  gender: string
  age: number
  idCard: string
  phone: string
  address: string
  status: PatientStatus
  createTime: string
  updateTime?: string
}

export type PatientStatus = '正常' | '住院中' | '已出院'

export interface PatientQuery extends PaginationParams {
  name?: string
  idCard?: string
  phone?: string
  status?: PatientStatus
}

// ========== 医生相关 ==========

export interface Doctor {
  id: number
  name: string
  gender: string
  age: number
  phone: string
  departmentId: number
  departmentName: string
  title: string
  specialty: string
  avatar?: string
  status: DoctorStatus
  createTime: string
}

export type DoctorStatus = '在职' | '离职' | '休假'

export interface DoctorQuery extends PaginationParams {
  name?: string
  departmentId?: number
  title?: string
}

// ========== 科室相关 ==========

export interface Department {
  id: number
  name: string
  code: string
  description: string
  phone: string
  headDoctorId?: number
  headDoctorName?: string
  bedCount: number
  usedBedCount: number
  createTime: string
}

// ========== 预约相关 ==========

export interface Appointment {
  id: number
  patientId: number
  patientName: string
  doctorId: number
  doctorName: string
  departmentId: number
  departmentName: string
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  reason: string
  createTime: string
}

export type AppointmentStatus = '待确认' | '已确认' | '已就诊' | '已取消'

// ========== 药品相关 ==========

export interface Medicine {
  id: number
  name: string
  code: string
  specification: string
  unit: string
  price: number
  stock: number
  minStock: number
  manufacturer: string
  expiryDate: string
  status: MedicineStatus
  createTime: string
}

export type MedicineStatus = '正常' | '缺货' | '已停用'

// ========== 收费相关 ==========

export interface Charge {
  id: number
  patientId: number
  patientName: string
  orderNo: string
  totalAmount: number
  discountAmount: number
  actualAmount: number
  paymentMethod: PaymentMethod
  status: ChargeStatus
  createTime: string
}

export type PaymentMethod = '现金' | '医保' | '银行卡' | '微信' | '支付宝'
export type ChargeStatus = '待支付' | '已支付' | '已退款' | '已作废'

// ========== 用户相关 ==========

export interface User {
  id: string
  username: string
  nickname: string
  avatar?: string
  role: UserRole
  email?: string
  phone?: string
  status: UserStatus
  createTime: string
}

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'cashier'
export type UserStatus = '正常' | '禁用'

// ========== 操作日志 ==========

export interface OperationLog {
  id: number
  userId: string
  userName: string
  action: string
  module: string
  method: string
  url: string
  ip: string
  params?: string
  result?: string
  duration: number
  createTime: string
}

// ========== 就诊记录 ==========

export interface MedicalRecord {
  id: number
  patientId: number
  patientName: string
  doctorId: number
  doctorName: string
  departmentId: number
  departmentName: string
  diagnosis: string
  prescription: string
  advice: string
  createTime: string
}