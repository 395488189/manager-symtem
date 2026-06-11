import { ElMessageBox, ElMessage, type ElMessageBoxOptions } from 'element-plus'

export interface UseConfirmOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

/**
 * 确认对话框 composable
 */
export function useConfirm() {
  /**
   * 删除确认
   */
  async function confirmDelete(
    name: string,
    options: UseConfirmOptions = {}
  ): Promise<boolean> {
    const {
      title = '删除确认',
      confirmText = '确定删除',
      cancelText = '取消',
      type = 'warning'
    } = options

    try {
      await ElMessageBox.confirm(
        `确定要删除「${name}」吗？此操作不可恢复。`,
        title,
        {
          confirmButtonText: confirmText,
          cancelButtonText: cancelText,
          type
        } as ElMessageBoxOptions
      )
      return true
    } catch {
      return false
    }
  }

  /**
   * 通用确认对话框
   */
  async function confirm(
    message: string,
    title: string = '确认',
    options: UseConfirmOptions = {}
  ): Promise<boolean> {
    const {
      confirmText = '确定',
      cancelText = '取消',
      type = 'warning'
    } = options

    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        type
      } as ElMessageBoxOptions)
      return true
    } catch {
      return false
    }
  }

  /**
   * 成功提示
   */
  function showSuccess(message: string = '操作成功') {
    ElMessage.success(message)
  }

  /**
   * 错误提示
   */
  function showError(message: string = '操作失败') {
    ElMessage.error(message)
  }

  /**
   * 警告提示
   */
  function showWarning(message: string) {
    ElMessage.warning(message)
  }

  /**
   * 信息提示
   */
  function showInfo(message: string) {
    ElMessage.info(message)
  }

  return {
    confirmDelete,
    confirm,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}