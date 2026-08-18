import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const teamsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams`
  : 'http://localhost:8000/api/teams';

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

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        const response = await fetch(teamsApiUrl);

        if (!response.ok) {
          throw new Error(`Request failed for teams: ${response.status}`);
        }

        const payload = await response.json();
        const data = normalizeCollection(payload);

        if (!isMounted) {
          return;
        }

        setTeams(data);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err.message || 'Unable to load teams.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading teams...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Members</th>
                <th>Sport</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id || team.id || team.name}>
                  <td>{team.name}</td>
                  <td>{team.members}</td>
                  <td>{team.sport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
