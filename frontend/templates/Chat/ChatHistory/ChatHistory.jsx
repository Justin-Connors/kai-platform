import React, { useEffect, useRef, useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChatIcon from '@mui/icons-material/Chat';
import { Drawer, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import styles from './styles';

const ChatHistory = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    // adjusting button position when drawer is opening
    if (buttonRef.current) {
      if (open) {
        buttonRef.current.style.bottom = 'calc(50vh + 16px)';
      } else {
        buttonRef.current.style.bottom = '16px';
      }
    }
  }, [open]); // Run effect whenever state changes on open

  // Test Data
  const chatHistory = [
    { date: 'Today', title: 'test title 1test title 1test title 1' },
    { date: 'Today', title: 'test title 2' },
    { date: 'Yesterday', title: 'test title 3' },
    { date: 'June 5th, 2024', title: 'test title 4' },
  ];

  return (
    <div>
      <IconButton
        onClick={toggleDrawer}
        edge="start"
        color="white"
        aria-label="open drawer"
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          ':hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <ChatIcon />
        Chat History
        <ArrowDropUpIcon />
      </IconButton>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            height: '60vh',
            width: '13rem',
            overflowY: 'auto',
            backgroundColor: '#121319',
            pt: 4,
            borderRadius: '8px 8px 0 0',
          },
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
          }}
        >
          <IconButton
            ref={buttonRef}
            onClick={toggleDrawer}
            fullWidth
            edge="start"
            color="white"
            aria-label="close drawer"
            sx={{
              position: 'absolute',
              top: -24,
              left: 16,
              ':hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <ChatIcon />
            Chat History
            <ArrowDropDownIcon />
          </IconButton>
        </div>
        <List sx={{ mt: 2 }}>
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
                  primary={
                    item.title.length > 25
                      ? `${item.title.slice(0, 25)}...`
                      : item.title
                  }
                  sx={hoveredItem === index ? styles.listItemHover : null}
                />
              </ListItemButton>
              <Divider {...styles.divider} />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default ChatHistory;
