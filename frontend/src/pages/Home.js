import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';

const Home = () => {
  const categories = [
    {
      title: '师资力量',
      description: '实验室教师团队风采',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      link: '/teachers',
      color: '#1976d2'
    },
    {
      title: '博士后',
      description: '博士后研究人员风采',
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      link: '/postdocs',
      color: '#00838f'
    },
    {
      title: '博士研究生',
      description: '实验室博士研究生风采',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      link: '/phd-students',
      color: '#d32f2f'
    },
    {
      title: '硕士研究生',
      description: '实验室硕士研究生风采',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      link: '/master-students',
      color: '#1976d2'
    },
    {
      title: '实验室支持团队',
      description: '仪器管理、科研助理、卫生保洁等',
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      link: '/lab-assistants',
      color: '#455a64'
    },
    {
      title: '实验室日常',
      description: '记录实验室美好时光',
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      link: '/lab-life',
      color: '#7b1fa2'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 主标题区域 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          308的照片墙
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          记录学术路上的每一个精彩瞬间
        </Typography>
        
        {/* 上传按钮 */}
        <Button
          variant="contained"
          size="large"
          startIcon={<PhotoCameraIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
            }
          }}
          component={Link}
          to="/upload"
        >
          上传照片
        </Button>
      </Box>

      {/* 统计信息 */}
      <Paper elevation={2} sx={{ p: 3, mb: 6, borderRadius: 3 }}>
        <Grid container spacing={8} justifyContent="center">
          <Grid item xs={12} sm={3} textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">8</Typography>
            <Typography variant="body1" color="text.secondary">教师成员</Typography>
          </Grid>
          <Grid item xs={12} sm={3} textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">3</Typography>
            <Typography variant="body1" color="text.secondary">博士后</Typography>
          </Grid>
          <Grid item xs={12} sm={3} textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">9</Typography>
            <Typography variant="body1" color="text.secondary">博士生</Typography>
          </Grid>
          <Grid item xs={12} sm={3} textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">20+</Typography>
            <Typography variant="body1" color="text.secondary">硕士生</Typography>
          </Grid>
          <Grid item xs={12} sm={3} textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">50+</Typography>
            <Typography variant="body1" color="text.secondary">精彩照片</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 分类导航卡片 */}
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
        浏览照片分类
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
         
      </Typography>
      {[
        categories.slice(0, 3),
        categories.slice(3, 6)
      ].map((row, rowIndex) => (
        <Box key={rowIndex} sx={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(3, 1fr)'
          },
          mb: rowIndex === 0 ? 5 : 0
        }}>
          {row.map((category, index) => (
            <Card 
              key={`${rowIndex}-${index}`}
              component={Link} 
              to={category.link}
              sx={{
                width: '100%',
                height: '100%',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                borderRadius: 3,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ color: category.color, mb: 2 }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}

      {/* 实验室介绍 */}
      <Paper elevation={1} sx={{ mt: 6, p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" textAlign="center">
          关于我们的实验室
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          我们是一个充满活力的科研团队，致力于前沿技术研究与创新。每一张照片都记录着我们共同成长的足迹。
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;