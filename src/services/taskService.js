// services/taskService.js
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

export const taskService = {
  // Get tasks for a specific user
  getTasks: async (userId) => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    }));
  },

  // Listen to real-time updates for tasks
  subscribeToTasks: (userId, onTasksUpdate, onError) => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    
    return onSnapshot(q, 
      (querySnapshot) => {
        const tasks = querySnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data()
        }));
        onTasksUpdate(tasks);
      },
      (error) => {
        console.error('Error subscribing to tasks:', error);
        if (onError) onError(error);
      }
    );
  },

  // Add a new task
  addTask: async (userId, taskData) => {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      userId,
      createdAt: new Date().toISOString(),
      completed: false,
      notifications: {
        enabled: false,
        // Add other default notification settings
      }
    });
    
    return {
      id: docRef.id,
      userId,
      ...taskData
    };
  },

  // Update an existing task
  updateTask: async (taskId, taskUpdates) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...taskUpdates,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  },

  // Update task notifications
  updateTaskNotifications: async (taskId, notifications) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { 
      notifications,
      updatedAt: new Date().toISOString()
    });
  },

  // Batch update tasks (useful for bulk operations)
  batchUpdateTasks: async (tasks) => {
    const batch = writeBatch(db);
    
    tasks.forEach((task) => {
      const taskRef = doc(db, 'tasks', task.id);
      batch.update(taskRef, {
        ...task,
        updatedAt: new Date().toISOString()
      });
    });

    await batch.commit();
  },

  // Search tasks with filtering
  searchTasks: async (userId, searchTerm) => {
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef, 
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(task => 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        false
      );
  },

  // Update task completion status
  updateTaskStatus: async (taskId, completed) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { 
      completed,
      updatedAt: new Date().toISOString()
    });
  },

  // Additional custom methods can be added here based on specific requirements
  // For example:
  getTasksByDate: async (userId, date) => {
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef, 
      where('userId', '==', userId),
      where('date', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

// Export as a default export for easier importing
export default taskService;