import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

const navigation = [
  { label: 'Users', path: '/users' },
  { label: 'Teams', path: '/teams' },
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
];

function App() {
  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-semibold">OctoFit Tracker</span>
          <div className="navbar-nav w-100 justify-content-evenly flex-wrap gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded ${isActive ? 'bg-light text-dark' : 'text-white-50'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="alert alert-warning" role="alert">
        Define <strong>VITE_CODESPACE_NAME</strong> in <strong>.env.local</strong> for Codespaces URLs. If it is unset, the app falls back to localhost.
      </div>

      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
