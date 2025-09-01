import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Task, Category } from "@/types/task"

export const tasksCollection = collection(db, "tasks")
export const categoriesCollection = collection(db, "categories")

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">, 
  userId: string) {
  const now = new Date()
  const taskData = {
    ...task,
    userId,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
  }

  return await addDoc(tasksCollection, taskData)
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const taskRef = doc(db, "tasks", taskId)
  const updateData = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
    dueDate: updates.dueDate ? Timestamp.fromDate(updates.dueDate) : null,
  }

  return await updateDoc(taskRef, updateData)
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, "tasks", taskId)
  return await deleteDoc(taskRef)
}

export function subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
  // Only filter by userId; remove orderBy to avoid index issues
  const q = query(tasksCollection, where("userId", "==", userId))

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || null,
      } as Task
    })

    // Sort tasks by createdAt descending on the client
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    callback(tasks)
  })
}


export async function createCategory(category: Omit<Category, "id">) {
  return await addDoc(categoriesCollection, category)
}

export async function getCategories(userId: string): Promise<Category[]> {
  const q = query(categoriesCollection, where("userId", "==", userId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Category,
  )
}
