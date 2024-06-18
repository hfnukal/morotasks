import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos, deleteTodo, optimisticDeleteTodo, optimisticAddTodo, completeTodo,
  optimisticCompleteTodo, addTodo, optimisticUpdateId, optimisticUpdateTodo, updateTodo,
} from '../redux/todo.ts';
import { RootState, AppDispatch } from '../redux/store.ts';
import React from 'react';
import {
  CircularProgress,
  List, ListItem, Toolbar, Button,
  ToggleButtonGroup, ToggleButton, Alert, Container, Box,
} from '@mui/material';
import { TodoItem } from './TodoItem.tsx';
import TodoNew from './TodoNew.tsx';

/**
 * Zobrazí seznam úkolů
 */
export const Todo: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todo.todos);
  const status = useSelector((state: RootState) => state.todo.status);
  const error = useSelector((state: RootState) => state.todo.error);

  const [filter, setFilter] = useState('all');

  // Načtení dat
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [dispatch, status]);

  // Přidání úkolu
  const handleAdd = async (text: string) => {
    const data = {
      id: `tmp-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
    };
    dispatch(optimisticAddTodo(data));
    const d: { payload: { id: string } } = await dispatch(addTodo(data)) as { payload: { id: string } };
    dispatch(optimisticUpdateId({ oldId: data.id, newId: d.payload.id }));
  }

  // Úprava úkolu
  const handleUpdate = async (id: string, text: string, completed: boolean) => {
    const data = {
      id,
      text,
      completed,
    };
    dispatch(optimisticUpdateTodo(data));
    await dispatch(updateTodo(data));
  }

  // Označení úkolu jako dokončený
  const handleCompleted = async (id: string, completed: boolean) => {
    dispatch(optimisticCompleteTodo({ id, completed }));
    await dispatch(completeTodo({ id, completed }));
  }

  // Smazání úkolu
  const handleDelete = async (id: string) => {
    dispatch(optimisticDeleteTodo(id));
    await dispatch(deleteTodo(id));
  };

  // Filtr viditelných úkolů
  const visibleTodos = () => (
    filter === 'all'
    ? todos
    : todos.filter(t => t.completed === (filter === 'c'))
  ) || [];

  // Zobrazení obsahu
  let content: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | null | undefined;
  if (status === "loading") {
    content = <CircularProgress />;
  } else if (status === "failed") {
    content = <Alert severity="error" sx={{ mx: 4 }}>{error}</Alert>;
  } else if (status === "succeeded") {
    content = (
      <List>

        <ListItem>
          <TodoNew addTodo={(text) => handleAdd(text)} />
        </ListItem>

        {visibleTodos().map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            completed={todo.completed}
            onDelete={handleDelete}
            onComplete={handleCompleted}
            onUpdate={handleUpdate}
          />
        ))}
      </List>
    );
  }

  return (
    <Container>
      <h1>Todos</h1>

      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <ToggleButtonGroup value={filter}>
          <ToggleButton value="all" onClick={() => setFilter('all')}>All</ToggleButton>
          <ToggleButton value="c" onClick={() => setFilter('c')}>Completed</ToggleButton>
          <ToggleButton value="nc" onClick={() => setFilter('nc')}>Not Completed</ToggleButton>
        </ToggleButtonGroup>
        <Button onClick={() => dispatch(fetchTodos())}>Refresh</Button>
        <Button
          onClick={async () => await Promise.all(visibleTodos().map(t => handleCompleted(t.id, true)))}
        >Set all completed</Button>
        <Button
          onClick={async () => await Promise.all(todos.filter(t => t.completed).map(t => handleDelete(t.id)))}
        >Remove completed</Button>
      </Toolbar>

      <Box>
        {content}
      </Box>
    </Container>
  );
};

export default Todo;