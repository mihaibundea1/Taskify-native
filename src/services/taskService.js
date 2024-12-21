import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export const taskService = {
  getTasks: async (userId) => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  addTask: async (userId, task) => {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...task,
      userId
    });
    
    return {
      id: docRef.id,
      userId,
      ...task
    };
  },

  updateTask: async (taskId, task) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, task);
  },

  deleteTask: async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  },

  updateTaskNotifications: async (taskId, notifications) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { notifications });
  }
};
