import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Box, Fade, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GradeGrid = ({ category }) => {
    const [gradeStats, setGradeStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGradeStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/photos?category=${category}`);
                const photos = response.data;
                
                // 按年级统计照片数量
                const gradeCount = {};
                photos.forEach(photo => {
                    if (photo.grade) {
                        gradeCount[photo.grade] = (gradeCount[photo.grade] || 0) + 1;
                    }
                });
                
                // 转换为数组并排序
                const gradeArray = Object.entries(gradeCount)
                    .map(([grade, count]) => ({ grade, count }))
                    .sort((a, b) => b.grade.localeCompare(a.grade)); // 按年级降序排列
                
                setGradeStats(gradeArray);
            } catch (error) {
                console.error('Error fetching grade stats:', error);
            }
            setLoading(false);
        };

        if (category) {
            fetchGradeStats();
        }
    }, [category]);

    const handleGradeClick = (grade) => {
        const pathCategory = category.replace('_', '-');
        navigate(`/${pathCategory}/${grade}`);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const getCategoryLabel = (cat) => {
        const labels = {
            'phd_students': '博士研究生',
            'master_students': '硕士研究生'
        };
        return labels[cat] || cat;
    };

    const getGradeColor = (index) => {
        const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2'];
        return colors[index % colors.length];
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 返回按钮 */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                >
                    返回首页
                </Button>
            </Box>

            {/* 页面标题 */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    {getCategoryLabel(category)}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    请选择年级查看照片
                </Typography>
                <Chip 
                    label={`共 ${gradeStats.reduce((sum, item) => sum + item.count, 0)} 张照片`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : gradeStats.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        暂无照片
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        还没有上传任何{getCategoryLabel(category)}的照片
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {gradeStats.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.grade}>
                            <Fade in={true} timeout={300 + index * 100}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${getGradeColor(index)}15, ${getGradeColor(index)}05)`,
                                        border: `2px solid ${getGradeColor(index)}30`,
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 24px ${getGradeColor(index)}30`,
                                            border: `2px solid ${getGradeColor(index)}`,
                                        }
                                    }}
                                    onClick={() => handleGradeClick(item.grade)}
                                >
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 2 }}>
                                            <SchoolIcon 
                                                sx={{ 
                                                    fontSize: 48, 
                                                    color: getGradeColor(index),
                                                    mb: 1
                                                }} 
                                            />
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            component="div" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                color: getGradeColor(index),
                                                mb: 1
                                            }}
                                        >
                                            {item.grade}
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                        >
                                            {item.count} 张照片
                                        </Typography>
                                        <Chip
                                            label="查看照片"
                                            sx={{
                                                backgroundColor: getGradeColor(index),
                                                color: 'white',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: getGradeColor(index),
                                                    opacity: 0.8
                                                }
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default GradeGrid;