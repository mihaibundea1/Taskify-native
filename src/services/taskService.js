import { db } from '../config/firebase';
import firestore from '@react-native-firebase/firestore';

class TaskService {
  async getTasks(userId) {
    const tasksRef = firestore().collection('tasks');
    const q = tasksRef.where('userId', '==', userId);
    const querySnapshot = await q.get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async addTask(userId, task) {
    const tasksRef = firestore().collection('tasks');
    const taskWithUser = { ...task, userId };
    const docRef = await tasksRef.add(taskWithUser);
    
    return {
      id: docRef.id,
      ...taskWithUser
    };
  }

  async updateTask(taskId, task) {
    const taskRef = firestore().collection('tasks').doc(taskId);
    await taskRef.update(task);
  }

  async deleteTask(taskId) {
    const taskRef = firestore().collection('tasks').doc(taskId);
    await taskRef.delete();
  }
}

export const taskService = new TaskService();