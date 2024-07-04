import { List, ListItem, ListItemText } from '@mui/material';

const ChatHistory = ({ history }) => (
  // eslint-disable-next-line prettier/prettier
    <List>
    {history.map((entry) => (
      <ListItem key={entry.id}>
        <ListItemText primary={`${entry.timestamp}: ${entry.message}`} />
      </ListItem>
    ))}
  </List>
);
export default ChatHistory;
