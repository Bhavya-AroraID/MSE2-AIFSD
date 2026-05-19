import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Sparkles, Trash2 } from 'lucide-react';

const Employees = () => {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add Employee Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', department: '', skills: '' });

  // AI Recommendation State
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [aiForm, setAiForm] = useState({ reviewPeriod: 'Q1 2026', kpiScore: 8, technicalSkillsScore: 8, softSkillsScore: 8, comments: '' });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormData({ name: '', email: '', role: '', department: '', skills: '' });
        fetchEmployees();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const payload = { employeeId: selectedEmployee._id, ...aiForm };
      const res = await fetch('http://localhost:5000/api/analytics/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('AI Recommendation Generated Successfully!');
        setSelectedEmployee(null);
      } else {
        alert('Failed to generate recommendation. Check your API key.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Employee Directory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your workforce and generate insights</p>
        </div>
        <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={18} />
          {showAddForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Employee</h2>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-2">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Role / Job Title</label>
              <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Department</label>
              <input type="text" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Skills (comma separated)</label>
              <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. React, Node.js, Leadership" />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn">Save Employee</button>
            </div>
          </form>
        </div>
      )}

      {selectedEmployee && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-color)" />
              AI Recommendation for {selectedEmployee.name}
            </h2>
            <button className="btn btn-secondary" onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
          <form onSubmit={handleGenerateAI} className="grid grid-cols-3">
            <div className="input-group">
              <label>Review Period</label>
              <input type="text" required value={aiForm.reviewPeriod} onChange={e => setAiForm({...aiForm, reviewPeriod: e.target.value})} />
            </div>
            <div className="input-group">
              <label>KPI Score (1-10)</label>
              <input type="number" min="1" max="10" required value={aiForm.kpiScore} onChange={e => setAiForm({...aiForm, kpiScore: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Technical Score (1-10)</label>
              <input type="number" min="1" max="10" required value={aiForm.technicalSkillsScore} onChange={e => setAiForm({...aiForm, technicalSkillsScore: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Soft Skills Score (1-10)</label>
              <input type="number" min="1" max="10" required value={aiForm.softSkillsScore} onChange={e => setAiForm({...aiForm, softSkillsScore: e.target.value})} />
            </div>
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Manager Comments</label>
              <input type="text" value={aiForm.comments} onChange={e => setAiForm({...aiForm, comments: e.target.value})} placeholder="Brief comments on performance..." />
            </div>
            <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn" disabled={generating}>
                {generating ? 'Generating Insights...' : 'Generate AI Recommendation'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Skills</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No employees found.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td style={{ fontWeight: 500 }}>
                    <div>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td>{emp.role}</td>
                  <td><span className="badge">{emp.department}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {emp.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{skill}</span>
                      ))}
                      {emp.skills.length > 3 && <span className="badge">+{emp.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setSelectedEmployee(emp)}>
                        <Sparkles size={14} /> AI Eval
                      </button>
                      <button className="btn btn-secondary btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(emp._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default Employees;
