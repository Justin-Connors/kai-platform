import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography  from '@mui/material/Typography';

import styles from './styles';

const ChatHistory = () => {

  const [hoveredItem, setHoveredItem] = useState(null);

  // Test Data
  const chatHistory = [
    { date: 'Today', title: 'test title 1'},
    { date: 'Today', title: 'test title 2'},
    { date: 'Yesterday', title: 'test title 3'},
    { date: 'June 5th, 2024', title: 'test title 4'},
  ];

  return (
    <List>
      {chatHistory.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 || item.date !== chatHistory[index - 1].date ? (
            <Typography variant="overline" {...styles.historyItem}>
              {item.date}
            </Typography>
          ) : null}
          <ListItemButton
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <ListItemText 
              primary={item.title} 
              sx={hoveredItem === index ? styles.listItemHover : null} 
            />
          </ListItemButton>
          <Divider {...styles.divider} />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ChatHistory;
