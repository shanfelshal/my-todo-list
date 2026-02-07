import { useState, useEffect } from 'react'

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function App() {

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('todos');
  
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  const addTask = () => {
    if (inputValue.trim()) {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const deleteTask = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
  setTodos(todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Мій To-Do List</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Що треба зробити?"
        />
        <button onClick={addTask}>Додати</button>
      </div>

      <ul>
  {todos.map(todo => (
    <li key={todo.id} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '10px',
      textDecoration: todo.completed ? 'line-through' : 'none', // Закреслюємо, якщо виконано
      color: todo.completed ? 'gray' : 'black'
    }}>
      {/* Квадратик (Checkbox) */}
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => toggleComplete(todo.id)} 
        style={{ marginRight: '10px', cursor: 'pointer' }}
      />

      <span style={{ flexGrow: 1 }}>
        {todo.text}
      </span>

      <button 
        onClick={() => deleteTask(todo.id)} 
        style={{ color: 'red', marginLeft: '10px' }}
      >
        Видалити
      </button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;