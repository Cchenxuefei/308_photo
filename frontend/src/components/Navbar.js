import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            首页
          </RouterLink>
        </Typography>
        <Box>
          {/* 按照要求顺序：师资力量，博士后，博士研究生，硕士研究生，实验室支持团队，实验室生活 */}
          <Button color="inherit" component={RouterLink} to="/teachers">师资力量</Button>
          <Button color="inherit" component={RouterLink} to="/postdocs">博士后</Button>
          <Button color="inherit" component={RouterLink} to="/phd-students">博士研究生</Button>
          <Button color="inherit" component={RouterLink} to="/master-students">硕士研究生</Button>
          <Button color="inherit" component={RouterLink} to="/lab-assistants">实验室支持团队</Button>
          <Button color="inherit" component={RouterLink} to="/lab-life">实验室日常</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;