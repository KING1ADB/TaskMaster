export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  parentId?: string // For subtasks
  subtasks?: Task[]
  tags?: string[]
  recurring?: {
    type: "daily" | "weekly" | "monthly"
    interval: number
  }
}

export interface Category {
  id: string
  name: string
  color: string
  userId: string
}
