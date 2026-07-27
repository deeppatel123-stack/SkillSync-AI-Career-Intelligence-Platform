import { useState, useEffect } from 'react';
import { taskApi } from '../utils/api';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, [filter]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const data = await taskApi.list(filter);
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const data = await taskApi.create(title);
      setTasks((prev) => [data.task, ...prev]);
      setTitle('');
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleTask(id) {
    try {
      const data = await taskApi.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteTask(id) {
    try {
      await taskApi.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const filters = [
    { label: 'All', value: '' },
    { label: 'Completed', value: 'completed' },
    { label: 'Incomplete', value: 'incomplete' },
  ];

  return (
    <div className="ai-card">
      <div className="ai-card-header">
        <i className="bi bi-check2-square" />
        <div>
          <h3>To-Do List</h3>
          <p>Manage your tasks</p>
        </div>
      </div>

      <form onSubmit={addTask} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          className="ai-form-input"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="ai-btn-primary" disabled={!title.trim()}>
          <i className="bi bi-plus-lg" /> Add
        </button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? 'ai-btn-primary' : 'ai-btn-secondary'}
            style={{ padding: '6px 16px', fontSize: 13 }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="ai-loading"><i className="bi bi-arrow-repeat" /> Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
          <i className="bi bi-inbox" style={{ fontSize: 32 }} />
          <p style={{ marginTop: 8 }}>No tasks found</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                borderRadius: 8, marginBottom: 6,
                border: '1px solid var(--border-light)',
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 18, color: task.completed ? 'var(--success)' : 'var(--text-muted)',
                  padding: 0, lineHeight: 1,
                }}
                title={task.completed ? 'Mark incomplete' : 'Mark completed'}
              >
                <i className={`bi ${task.completed ? 'bi-check-circle-fill' : 'bi-circle'}`} />
              </button>
              <span style={{
                flex: 1, fontSize: 14, color: 'var(--text-primary)',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, color: 'var(--error)', padding: '2px 4px', lineHeight: 1,
                }}
                title="Delete task"
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
