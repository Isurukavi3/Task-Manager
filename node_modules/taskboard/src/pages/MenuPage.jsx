import '../styles/Menu.css';

function MenuPage({ onNavigate, currentUser }) {
  const menuItems = [
    { id: 'todo', title: 'To Do', color: '#e74c3c' },
    { id: 'doing', title: 'Doing', color: '#f39c12' },
    { id: 'done', title: 'Done', color: '#27ae60' }
  ];

  if (currentUser?.role === 'manager') {
    menuItems.push({ id: 'employees', title: 'Manage Employees', color: '#9b59b6' });
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Task Board Menu</h1>
        <button className="btn-profile" onClick={() => onNavigate('profile')}>
          Profile
        </button>
      </div>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="menu-card"
            style={{ borderColor: item.color }}
            onClick={() => onNavigate(item.id)}
          >
            <h2 style={{ color: item.color }}>{item.title}</h2>
            <p>{item.id === 'employees' ? 'Edit employee profiles' : `View ${item.title.toLowerCase()} tasks`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;
