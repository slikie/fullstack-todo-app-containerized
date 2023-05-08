import React from 'react';

const Todo = ({todo, deleteTodo, completeTodo}) => {
  const handleDelete = () => {
    deleteTodo(todo);
  };

  const handleComplete = () => {
    completeTodo(todo);
  };

  return (
    <div>
      <p>{todo.text}</p>
      <button onClick={handleComplete}>Complete</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Todo;