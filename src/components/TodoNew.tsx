import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { FC } from "react";

export type TodoNewProps = {
  addTodo: (text: string) => void;
};

/**
 * Formulář pro přidání nového úkolu
 * @param addTodo Funkce pro přidání nového úkolu
 */
const TodoNew: FC<TodoNewProps> = ({ addTodo }) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    addTodo(text);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={e => { e.preventDefault(); handleAdd(); }}
      display="flex"
      sx={{ width: "100%" }}
    >
      <TextField
        type="text"
        value={text}
        onChange={t => setText(t.target.value)}
        size="small"
        fullWidth
      />
      <Button onClick={handleAdd}>Add</Button>
    </Box>
  );
};

export default TodoNew;