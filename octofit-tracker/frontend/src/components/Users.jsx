import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const usersApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users`
  : 'http://localhost:8000/api/users';

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const response = await fetch(usersApiUrl);

        if (!response.ok) {
          throw new Error(`Request failed for users: ${response.status}`);
        }

        const payload = await response.json();
        const data = normalizeCollection(payload);

        if (!isMounted) {
          return;
        }

        setUsers(data);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err.message || 'Unable to load users.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Fitness</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id || `${user.name}-${user.email}`}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.fitnessLevel || 'beginner'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
