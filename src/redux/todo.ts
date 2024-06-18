import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = process.env.API_URL || "http://localhost:8080";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Načtení všech úkolů
export const fetchTodos = createAsyncThunk<Todo[]> ("todos/fetchTodos", async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
});

// Načtení neukončených úkolů
export const fetchNoCompletedTodos = createAsyncThunk<Todo[]> ("todos/fetchTodos", async () => {
  const response = await fetch(`${API_URL}/tasks`);
  const res = await response.json()
  return res.filter((todo: Todo) => !todo.completed);
});

// Načtení ukončených úkolů
export const fetchCompletedTodos = createAsyncThunk<Todo[]> ("todos/fetchTodos", async () => {
  const response = await fetch(`${API_URL}/tasks/completed`);
  return response.json();
});

// Přidání nového úkolu
export const addTodo = createAsyncThunk<Todo, Todo> ("todos/addTodo", async (todo) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
});

// Úprava úkolu
export const updateTodo = createAsyncThunk<Todo, Todo> ("todos/updateTodo", async (todo) => {
  const response = await fetch(`${API_URL}/tasks/${todo.id}`, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
});

// Smazání úkolu
export const deleteTodo = createAsyncThunk<string, string> ("todos/deleteTodo", async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return response.json();
});

// Označení úkolu jako dokončený
export const completeTodo = createAsyncThunk<Todo, { id: string, completed: boolean }>
    ("todos/completeTodo", async ({ id, completed }) => {
  const response = await fetch(`${API_URL}/tasks/${id}/${completed ? 'complete' : 'incomplete'}`, {
    method: "POST",
    body: JSON.stringify({ completed }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
});

const initialState: TodoState = {
  todos: [],
  status: "idle",
  error: null,
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Optimistické změny
    optimisticAddTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    optimisticUpdateTodo: (state, action: PayloadAction<Todo>) => {
      const i = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (i !== -1) {
        state.todos[i] = action.payload;
      }
    },
    optimisticUpdateText: (state, action: PayloadAction<{ id: string, text: string}>) => {
      const i = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (i !== -1) {
        state.todos[i].text = action.payload.text;
      }
    },
    optimisticUpdateId: (state, action: PayloadAction<{ oldId: string, newId: string }>) => {
      const i = state.todos.findIndex((todo) => todo.id === action.payload.oldId);
      if (i !== -1) {
        state.todos[i].id = action.payload.newId;
      }
    },
    optimisticDeleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    optimisticCompleteTodo: (state, action: PayloadAction<{ id: string, completed: boolean }>) => {
      const i = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (i !== -1) {
        state.todos[i].completed = action.payload.completed;
      }
    }
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchTodos.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.todos = action.payload;
    })
    .addCase(fetchTodos.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || 'Chyba při načítání dat';
    })
    .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
      const i = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (i !== -1) {
        state.todos[i] = action.payload;
      }
    })
    .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    });
  }
});

export const {
  optimisticAddTodo,
  optimisticDeleteTodo,
  optimisticCompleteTodo,
  optimisticUpdateId,
  optimisticUpdateTodo,
} = todoSlice.actions;

export default todoSlice.reducer;