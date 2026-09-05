import { useState, useEffect, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import TodoPage from './pages/TodoPage';
import DoingPage from './pages/DoingPage';
import DonePage from './pages/DonePage';
import ProfilePage from './pages/ProfilePage';
import EmployeesPage from './pages/EmployeesPage';
import * as authApi from './api/authApi';
import * as usersApi from './api/usersApi';
import * as tasksApi from './api/tasksApi';
import './App.css';

function groupTasksByStatus(flatTasks) {
  return {
    todo: flatTasks.filter((t) => t.status === 'todo'),
    doing: flatTasks.filter((t) => t.status === 'doing'),
    done: flatTasks.filter((t) => t.status === 'done'),
  };
}

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = (page) => setCurrentPage(page);

  const refreshData = useCallback(async () => {
    try {
      const [flatTasks, employeeList] = await Promise.all([
        tasksApi.getTasks(),
        usersApi.getEmployees(),
      ]);
      setTasks(groupTasksByStatus(flatTasks));
      setEmployees(employeeList);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated, refreshData]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { token, user } = await authApi.login(email, password);
      localStorage.setItem('token', token);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentPage('menu');
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleRegister = async (userData) => {
    const { token, user } = await authApi.register(userData);
    localStorage.setItem('token', token);
    return user;
  };

  const updateProfile = async (profileData) => {
    const updated = await usersApi.updateUser(currentUser.email, profileData);
    setCurrentUser(updated);
  };

  const updateEmployee = async (employeeEmail, profileData) => {
    await usersApi.updateUser(employeeEmail, profileData);
    refreshData();
  };

  const addTask = async (taskData) => {
    await tasksApi.addTask(taskData);
    refreshData();
  };

  const deleteTask = async (id) => {
    await tasksApi.deleteTask(id);
    refreshData();
  };

  const moveTask = async (id, toStatus) => {
    await tasksApi.moveTask(id, toStatus);
    refreshData();
  };

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'register') {
      return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigate('register')} error={error} />;
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
          employees={employees}
          onUpdateEmployee={updateEmployee}
        />;
      case 'todo':
        return <TodoPage
          onNavigate={navigate}
          tasks={tasks.todo}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onMoveTask={(id) => moveTask(id, 'doing')}
          currentUser={currentUser}
          employees={employees}
        />;
      case 'doing':
        return <DoingPage
          onNavigate={navigate}
          tasks={tasks.doing}
          onDeleteTask={deleteTask}
          onMoveTask={(id) => moveTask(id, 'done')}
          currentUser={currentUser}
        />;
      case 'done':
        return <DonePage
          onNavigate={navigate}
          tasks={tasks.done}
          onDeleteTask={deleteTask}
          currentUser={currentUser}
        />;
      default:
        return <MenuPage onNavigate={navigate} currentUser={currentUser} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
