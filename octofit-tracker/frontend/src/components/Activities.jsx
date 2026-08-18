import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const activitiesApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities`
  : 'http://localhost:8000/api/activities';

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

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      try {
        const response = await fetch(activitiesApiUrl);

        if (!response.ok) {
          throw new Error(`Request failed for activities: ${response.status}`);
        }

        const payload = await response.json();
        const data = normalizeCollection(payload);

        if (!isMounted) {
          return;
        }

        setActivities(data);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err.message || 'Unable to load activities.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading activities...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Minutes</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id || activity.id || activity.type}>
                  <td>{activity.type}</td>
                  <td>{activity.durationMinutes}</td>
                  <td>{activity.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
