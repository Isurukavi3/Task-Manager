let tasks = [
  {
    id: 1,
    title: 'Set up project repo',
    description: 'Initialise the GitHub repo and invite the team',
    priority: 'high',
    status: 'todo',
    assignee: 'Nadith Dinsara',
    assigneeEmail: 'nadith@gmail.com',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    title: 'Design login screen',
    description: 'Create the UI for login/register pages',
    priority: 'medium',
    status: 'doing',
    assignee: 'Dumidu Sahan',
    assigneeEmail: 'sahan@gmail.com',
    date: new Date().toISOString().split('T')[0],
  },
];

let nextId = 3;

export function getAllTasks() {
  return tasks;
}

export function getTaskById(id) {
  return tasks.find((t) => t.id === Number(id));
}

export function addTask(taskData) {
  const newTask = {
    id: nextId++,
    status: 'todo',
    date: new Date().toISOString().split('T')[0],
    ...taskData,
  };
  tasks.push(newTask);
  return newTask;
}

export function updateTaskStatus(id, toStatus) {
  const task = getTaskById(id);
  if (!task) return null;
  task.status = toStatus;
  return task;
}

export function deleteTask(id) {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== Number(id));
  return tasks.length < before;
}

export default { getAllTasks, getTaskById, addTask, updateTaskStatus, deleteTask };
