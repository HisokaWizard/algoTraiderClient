import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectProps } from '@mui/material';
import React, { memo } from 'react';
import { Dictionary } from '../models/Dictionary';

interface Props extends SelectProps {
  id: string;
  items: Dictionary[];
}

export const Select = memo((props: Props) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size={props.size}>
      <InputLabel id={'label_' + props.id}>{props.label}</InputLabel>
      <MuiSelect
        {...props}
        id={props.id}
        value={props.value}
        label={props.label}
        onChange={props.onChange}
      >
        {props.items.map((it) => {
          return (
            <MenuItem key={it.code} value={it.code}>
              {it.name}
            </MenuItem>
          );
        })}
      </MuiSelect>
    </FormControl>
  );
});
