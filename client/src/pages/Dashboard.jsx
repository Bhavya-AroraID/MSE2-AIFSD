import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Users, Award, BrainCircuit } from 'lucide-react';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your AI-powered HR analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Reviews</p>
            <h3 style={{ margin: 0 }}>{analytics.length}</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--success-color)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Avg Performance</p>
            <h3 style={{ margin: 0 }}>
              {analytics.length > 0 ? (analytics.reduce((a, b) => a + parseFloat(b.avgScore), 0) / analytics.length).toFixed(1) : 'N/A'} / 10
            </h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--warning-color)' }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>AI Recommendations</p>
            <h3 style={{ margin: 0 }}>{analytics.filter(a => a.aiRecommendation).length} Generated</h3>
          </div>
        </div>
      </div>

      <h2>Top Performers</h2>
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Review Period</th>
              <th>Score</th>
              <th>AI Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : analytics.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No analytics available yet.</td></tr>
            ) : (
              analytics.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    {index === 0 ? <Award size={20} color="var(--warning-color)" /> : `#${index + 1}`}
                  </td>
                  <td style={{ fontWeight: 500 }}>{item.employee?.name || 'Unknown'}</td>
                  <td><span className="badge">{item.employee?.department || 'Unknown'}</span></td>
                  <td>{item.reviewPeriod}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${parseFloat(item.avgScore) * 10}%`, background: 'var(--success-color)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.avgScore}</span>
                    </div>
                  </td>
                  <td>
                    {item.aiRecommendation ? (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {item.aiRecommendation.substring(0, 40)}...
                      </span>
                    ) : (
                      <span style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>Not Generated</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
