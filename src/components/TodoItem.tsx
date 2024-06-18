import { FC } from 'react';
import React from 'react';
import { Box, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Save';

export type TodoItemProps = {
  id: string;
  text: string;
  completed: boolean;
  onDelete?: (id: string) => void;
  onComplete?: (id: string, completed: boolean) => void;
  onUpdate?: (id: string, text: string, completed: boolean) => void;
};

/**
 * Položka seznamu úkolů
 * @param id ID úkolu
 * @param text Text úkolu
 * @param completed Dokončenost úkolu
 * @param onDelete Funkce pro smazání úkolu
 * @param onComplete Funkce pro označení úkolu jako dokončený
 * @param onUpdate Funkce pro úpravu úkolu
 */
export const TodoItem: FC<TodoItemProps> = ({ id, text, completed, onDelete, onComplete, onUpdate }) => {
  const [edit, setEdit] = React.useState(false);
  const [editText, setEditText] = React.useState(text);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate && onUpdate(id, editText, completed);
    setEdit(false);
  };

  return (
    <ListItem
      key={id}
      secondaryAction={edit
        ? <IconButton
          edge="end"
          aria-label="update"
          onClick={handleUpdate}
        >
          <UpdateIcon />
        </IconButton>
        : onDelete && <IconButton
          edge="end"
          aria-label="tasks"
          onClick={() => onDelete(id)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={completed}
          tabIndex={-1}
          disableRipple
          disabled={id ? id.startsWith('tmp-') : false}
          inputProps={{ 'aria-labelledby': `checkbox-completed-${id}` }}
          onChange={() => onComplete && onComplete(id, !completed)}
        />
      </ListItemIcon>

      {!(onUpdate && edit)
        ? <ListItemText
          id={id} primary={text} onClick={() => setEdit(true)}
          sx={{ textDecoration: completed ? 'line-through' : 'none' }}
        />
        : <Box component="form" onSubmit={handleUpdate} sx={{ width: '100%' }}>
            <TextField
              id={id}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={handleUpdate}
              size='small'
              autoFocus
              fullWidth
              sx={{ mx: -1, p: 0 }}
              inputProps={{ style: { padding: '8px 8px' } }}
            />
          </Box>
      }

    </ListItem>
  );
};
