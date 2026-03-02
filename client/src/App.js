import { useState, useEffect, useCallback } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
import './App.css';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== todo.title) {
      onEdit(todo._id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button
        className={`toggle-btn ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo._id, !todo.completed)}
        aria-label="Toggle completion"
      >
        {todo.completed && (
          <svg viewBox="0 0 12 10" fill="none">
            <polyline points="1,5 4,8 11,1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="todo-content">
        {isEditing ? (
          <input
            className="edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span className="todo-title" onDoubleClick={() => setIsEditing(true)}>
            {todo.title}
          </span>
        )}
        <span className="todo-date">
          {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="todo-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => setIsEditing(true)}
          title="Edit task"
          aria-label="Edit"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(todo._id)}
          title="Delete task"
          aria-label="Delete"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const res = await getTodos();
      setTodos(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setTodos([]);
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const res = await createTodo(newTitle.trim());
      setTodos(prev => [res.data.data, ...prev]);
      setNewTitle('');
    } catch {
      setError('Failed to add task.');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await updateTodo(id, { completed });
      setTodos(prev => prev.map(t => t._id === id ? res.data.data : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const handleEdit = async (id, title) => {
    try {
      const res = await updateTodo(id, { title });
      setTodos(prev => prev.map(t => t._id === id ? res.data.data : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pending = todos.filter(t => !t.completed).length;
  const done = todos.filter(t => t.completed).length;
  const progress = todos.length ? Math.round((done / todos.length) * 100) : 0;

  return (
    <div className="app">
      <div className="bg-grid" />

      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
                <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/>
                <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/>
                <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.2"/>
              </svg>
            </div>
            <h1>Todo App</h1>
          </div>
          <p className="tagline">Get things done, one task at a time.</p>
        </header>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-num">{todos.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-num pending">{pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-num done">{done}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-label">{progress}%</span>
          </div>
        </div>

        {/* Add Form */}
        <form className="add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="add-input"
            placeholder="Add a new task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={200}
          />
          <button type="submit" className="add-btn" disabled={adding || !newTitle.trim()}>
            {adding ? (
              <span className="spinner" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
            <span>Add Task</span>
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="tab-count">
                {f === 'all' ? todos.length : f === 'active' ? pending : done}
              </span>
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {loading ? (
            <div className="state-message">
              <div className="spinner large" />
              <p>Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="state-message">
              <div className="empty-icon">
                {filter === 'completed' ? '🎉' : filter === 'active' ? '✅' : '📋'}
              </div>
              <p>
                {filter === 'completed' ? 'No completed tasks yet' :
                 filter === 'active' ? 'No pending tasks!' :
                 'No tasks yet. Add one above!'}
              </p>
            </div>
          ) : (
            filtered.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>

        {done > 0 && (
          <div className="clear-wrap">
            <button
              className="clear-btn"
              onClick={async () => {
                const completed = todos.filter(t => t.completed);
                for (const t of completed) await handleDelete(t._id);
              }}
            >
              Clear {done} completed task{done > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
