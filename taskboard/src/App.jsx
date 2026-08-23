import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import TodoPage from './pages/TodoPage';
import DoingPage from './pages/DoingPage';
import DonePage from './pages/DonePage';
import ProfilePage from './pages/ProfilePage';
import EmployeesPage from './pages/EmployeesPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { email: 'isuru@gmail.com', password: 'isuru1234', name: 'Isuru Kavisanka', jobTitle: 'Manager', role: 'manager', profilePicture: null },
    { email: 'nadith@gmail.com', password: 'nadith1234', name: 'Nadith Dinsara', jobTitle: 'Software Developer', role: 'employee', profilePicture: null },
    { email: 'sahan@gmail.com', password: 'sahan1234', name: 'Dumidu Sahan', jobTitle: 'UI/UX Designer', role: 'employee', profilePicture: null },
    { email: 'manuja@gmail.com', password: 'manuja1234', name: 'Praveera Manuja', jobTitle: 'Backend Developer', role: 'employee', profilePicture: null }
  ]);
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: []
  });

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (email) => {
    const user = users.find(u => u.email === email);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentPage('menu');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleRegister = (userData) => {
    const newUser = {
      ...userData,
      role: 'employee',
      profilePicture: null
    };
    setUsers([...users, newUser]);
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  const updateEmployee = (employeeEmail, profileData) => {
    setUsers(users.map(u => u.email === employeeEmail ? { ...u, ...profileData } : u));
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      date: new Date().toISOString().split('T')[0]
    };
    setTasks({ ...tasks, todo: [...tasks.todo, newTask] });
  };

  const deleteTask = (stage, taskId) => {
    setTasks({
      ...tasks,
      [stage]: tasks[stage].filter(task => task.id !== taskId)
    });
  };

  const moveTask = (taskId, fromStage, toStage) => {
    const task = tasks[fromStage].find(t => t.id === taskId);
    if (task && task.assigneeEmail === currentUser.email) {
      setTasks({
        ...tasks,
        [fromStage]: tasks[fromStage].filter(t => t.id !== taskId),
        [toStage]: [...tasks[toStage], task]
      });
    }
  };

  const getEmployees = () => {
    return users.filter(u => u.role === 'employee');
  };

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'register') {
      return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigate('register')} />;
    }

    switch (currentPage) {
      case 'register':
        return <RegisterPage onNavigateToLogin={() => navigate('login')} onRegister={handleRegister} />;
      case 'menu':
        return <MenuPage onNavigate={navigate} currentUser={currentUser} />;
      case 'profile':
        return <ProfilePage 
          onNavigate={navigate}
          userProfile={currentUser}
          onUpdateProfile={updateProfile}
          onLogout={handleLogout}
        />;
      case 'employees':
        return <EmployeesPage 
          onNavigate={navigate}
          employees={getEmployees()}
          onUpdateEmployee={updateEmployee}
        />;
      case 'todo':
        return <TodoPage 
          onNavigate={navigate} 
          tasks={tasks.todo}
          onAddTask={addTask}
          onDeleteTask={(id) => deleteTask('todo', id)}
          onMoveTask={(id) => moveTask(id, 'todo', 'doing')}
          currentUser={currentUser}
          employees={getEmployees()}
        />;
      case 'doing':
        return <DoingPage 
          onNavigate={navigate}
          tasks={tasks.doing}
          onDeleteTask={(id) => deleteTask('doing', id)}
          onMoveTask={(id) => moveTask(id, 'doing', 'done')}
          currentUser={currentUser}
        />;
      case 'done':
        return <DonePage 
          onNavigate={navigate}
          tasks={tasks.done}
          onDeleteTask={(id) => deleteTask('done', id)}
          currentUser={currentUser}
        />;
      default:
        return <MenuPage onNavigate={navigate} currentUser={currentUser} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
