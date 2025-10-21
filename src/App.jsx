import React, { useEffect, useState } from "react";
import './App.css'

export default function App() {
  const [todoItem, setTodoItem] = useState(() => {
    const stored = localStorage.getItem("todo");
    return stored ? JSON.parse(stored) : [];
  });
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    
    const newTodo = {
      id: Date.now(), 
      text: inputValue, 
      isCompleted: false,
      createdAt: new Date().toLocaleDateString()
    }
    setTodoItem([...todoItem, newTodo]);
    setInputValue("");
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const deleteTodo = (itemId) => {
    const updated = todoItem.filter(todo => todo.id !== itemId)
    setTodoItem(updated)
  }

  const checkComplete = (completeItem) => {
    const itemComplete = todoItem.map(todo => {
      if (todo.id === completeItem) {
        return {...todo, isCompleted: !todo.isCompleted}
      }
      return todo
    })
    setTodoItem(itemComplete)
  }

  const clearCompleted = () => {
    const activeTodos = todoItem.filter(todo => !todo.isCompleted);
    setTodoItem(activeTodos);
  }

  const getStats = () => {
    const total = todoItem.length
    const done = todoItem.filter(todo => todoItem.isCompleted === true).length
    const pending = (total - done)
    return {total, done, pending}
  }

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todoItem));
  }, [todoItem]);

  const stats = getStats();

  return (
    <div className="app">
      <div className="container">
        <div className="innercontainer">
          <header className="app-header">
            <h1>✨ My Todo List</h1>
            <p>Stay organized and productive</p>
          </header>

          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.done}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="todo-form">
            <div className="input-group">
              <input 
                type="text" 
                onChange={handleChange} 
                value={inputValue}
                placeholder="What needs to be done?"
                className="todo-input"
              />
              <button type="submit" className="submit-btn">
                <span>Add Task</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </form>

          <div className="todo-list">
            {todoItem.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Add a task above to get started!</p>
              </div>
            ) : (
              todoItem.map((item) => (
                <div className={`todo-item ${item.isCompleted ? 'completed' : ''}`} key={item.id}>
                  <div className="todo-content">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        onChange={() => checkComplete(item.id)} 
                        checked={item.isCompleted}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <div className="todo-text">
                      <p className={item.isCompleted ? "complete" : ''}>{item.text}</p>
                      <span className="todo-date">{item.createdAt}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTodo(item.id)} 
                    className="delete-btn"
                    aria-label="Delete todo"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {stats.done > 0 && (
            <div className="actions-container">
              <button onClick={clearCompleted} className="clear-btn">
                Clear Completed ({stats.done})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}