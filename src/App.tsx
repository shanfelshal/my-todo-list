import { useState, useEffect } from 'react'
import './App.css'

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  deadline: string;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputValue, setInputValue] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Функція для відмінювання слова "завдання"
  const getTaskWord = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "завдань";
    if (lastDigit === 1) return "завдання";
    if (lastDigit >= 2 && lastDigit <= 4) return "завдання";
    return "завдань";
  };

  const addTask = () => {
    if (inputValue.trim()) {
      const now = new Date();
      const createdAt = now.toLocaleString('uk-UA', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });

      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: createdAt,
        deadline: deadlineInput ? new Date(deadlineInput).toLocaleString('uk-UA', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        }) : "Не вказано"
      };

      setTodos([...todos, newTodo]);
      setInputValue("");
      setDeadlineInput("");
    }
  };

  const deleteTask = (id: number) => setTodos(todos.filter(t => t.id !== id));
  const toggleComplete = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const saveEdit = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditingId(null);
  };

  return (
    <div className="app-container">
      <div className="header-section">
        <h1>Сьогодні</h1>
        <p>{todos.length} {getTaskWord(todos.length)} заплановано</p>
      </div>

      <div className="content-body">
        <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="input-card">
          <input 
            className="main-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Напиши щось нове..."
          />
          <div className="input-footer">
            <input 
              type="datetime-local" 
              className="date-input"
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
            />
            <button type="submit" className="btn-add">Додати</button>
          </div>
        </form>

        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <div className="edit-mode">
                  <input className="main-input" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                  <button className="btn-ok" onClick={() => saveEdit(todo.id)}>OK</button>
                </div>
              ) : (
                <>
                  <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} className="custom-cb" />
                  <div className="todo-info">
                    <div className="todo-text">{todo.text}</div>
                    <div className="todo-dates">
                      <span>🕒 {todo.createdAt}</span>
                      <span className="deadline-text">🏁 {todo.deadline}</span>
                    </div>
                  </div>
                  <button className="btn-edit" onClick={() => { setEditingId(todo.id); setEditText(todo.text); }}>Змінити</button>
                  <button className="btn-delete" onClick={() => deleteTask(todo.id)}>Видалити</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;