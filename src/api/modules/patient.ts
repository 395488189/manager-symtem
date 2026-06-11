import http from '@/utils/request'
import type { Patient, PatientQuery, PaginationResult } from '@/types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock 数据
const mockPatients: Patient[] = [
  { id: 1, name: '张三', gender: '男', age: 45, idCard: '110101199001011234', phone: '13800138001', address: '北京市朝阳区建国路88号', status: '正常', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '李四', gender: '女', age: 32, idCard: '310101199201022345', phone: '13900139002', address: '上海市浦东新区世纪大道100号', status: '住院中', createTime: '2024-02-20 14:20:00' },
  { id: 3, name: '王五', gender: '男', age: 58, idCard: '440101198801033456', phone: '13700137003', address: '广州市天河区天河路123号', status: '已出院', createTime: '2024-03-10 09:15:00' },
  { id: 4, name: '赵六', gender: '女', age: 28, idCard: '510101199601044567', phone: '13600136004', address: '成都市武侯区科华北路66号', status: '正常', createTime: '2024-04-05 16:45:00' },
  { id: 5, name: '钱七', gender: '男', age: 67, idCard: '320101195901055678', phone: '13500135005', address: '南京市鼓楼区中山北路200号', status: '住院中', createTime: '2024-05-12 11:00:00' },
  { id: 6, name: '孙八', gender: '女', age: 41, idCard: '210101198301066789', phone: '13400134006', address: '沈阳市和平区太原街150号', status: '正常', createTime: '2024-06-18 08:30:00' },
  { id: 7, name: '周九', gender: '男', age: 35, idCard: '330101198901077890', phone: '13300133007', address: '杭州市西湖区文一路80号', status: '已出院', createTime: '2024-07-22 15:20:00' },
  { id: 8, name: '吴十', gender: '女', age: 52, idCard: '420101197201088901', phone: '13200132008', address: '武汉市江汉区解放大道688号', status: '正常', createTime: '2024-08-30 10:00:00' },
]

// API 接口
export const patientApi = {
  /**
   * 获取患者列表
   */
  async getList(params: PatientQuery): Promise<PaginationResult<Patient>> {
    await delay(300)

    let filtered = [...mockPatients]

    // 过滤
    if (params.name) {
      filtered = filtered.filter(p => p.name.includes(params.name!))
    }
    if (params.idCard) {
      filtered = filtered.filter(p => p.idCard.includes(params.idCard!))
    }
    if (params.phone) {
      filtered = filtered.filter(p => p.phone.includes(params.phone!))
    }
    if (params.status) {
      filtered = filtered.filter(p => p.status === params.status)
    }

    // 分页
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    const list = filtered.slice(start, start + params.pageSize)

    return { list, total, page: params.page, pageSize: params.pageSize }
  },

  /**
   * 获取患者详情
   */
  async getById(id: number): Promise<Patient> {
    await delay(200)
    const patient = mockPatients.find(p => p.id === id)
    if (!patient) throw new Error('患者不存在')
    return { ...patient }
  },

  /**
   * 新增患者
   */
  async create(data: Omit<Patient, 'id' | 'createTime'>): Promise<Patient> {
    await delay(300)
    const newPatient: Patient = {
      ...data,
      id: Math.max(...mockPatients.map(p => p.id)) + 1,
      createTime: new Date().toLocaleString()
    }
    mockPatients.unshift(newPatient)
    return { ...newPatient }
  },

  /**
   * 更新患者
   */
  async update(id: number, data: Partial<Patient>): Promise<Patient> {
    await delay(300)
    const index = mockPatients.findIndex(p => p.id === id)
    if (index === -1) throw new Error('患者不存在')

    mockPatients[index] = { ...mockPatients[index], ...data }
    return { ...mockPatients[index] }
  },

  /**
   * 删除患者
   */
  async delete(id: number): Promise<void> {
    await delay(300)
    const index = mockPatients.findIndex(p => p.id === id)
    if (index === -1) throw new Error('患者不存在')
    mockPatients.splice(index, 1)
  }
}