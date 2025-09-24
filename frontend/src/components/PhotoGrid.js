import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Box, Fade, Chip, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoModal from './PhotoModal';

const PhotoGrid = ({ category, subCategory }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { grade } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (subCategory) params.append('subCategory', subCategory);
                if (grade) params.append('grade', grade);
                
                const response = await axios.get(`/api/photos?${params.toString()}`);
                setPhotos(response.data);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
            setLoading(false);
        };

        fetchPhotos();
    }, [category, subCategory, grade]);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setModalOpen(true);
    };

    const handlePhotoUpdate = (updatedPhoto) => {
        setPhotos(prev => prev.map(photo => 
            photo.id === updatedPhoto.id ? updatedPhoto : photo
        ));
        setSelectedPhoto(updatedPhoto);
    };

    const handlePhotoDelete = (photoId) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
        setModalOpen(false);
    };

    const getCategoryLabel = (cat, subCat, gradeParam) => {
        const labels = {
            teachers: '师资力量',
            phd_students: '博士研究生',
            master_students: '硕士研究生',
            lab_life: '实验室生活',
            postdocs: '博士后',
            lab_assistants: '实验室支持团队'
        };
        
        const subLabels = {
            phd: '博士生',
            master: '硕士生',
            instrument: '仪器管理',
            research: '科研助理',
            hygiene: '卫生保洁'
        };

        let label = labels[cat] || cat;
        if (subCat && subLabels[subCat]) {
            label += ` - ${subLabels[subCat]}`;
        }
        if (gradeParam) {
            label += ` - ${gradeParam}`;
        }
        return label;
    };

    const handleBackClick = () => {
        if (grade && (category === 'phd_students' || category === 'master_students')) {
            navigate(`/${category === 'phd_students' ? 'phd-students' : 'master-students'}`);
        } else {
            navigate('/');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 返回按钮 */}
            {(grade || category === 'teachers' || category === 'lab_life' || category === 'postdocs' || category === 'lab_assistants') && (
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBackClick}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        {grade ? '返回年级选择' : '返回首页'}
                    </Button>
                </Box>
            )}

            {/* 页面标题 */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    {getCategoryLabel(category, subCategory, grade)}
                </Typography>
                <Chip 
                    label={`共 ${photos.length} 张照片`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : photos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        暂无照片
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        还没有上传任何照片，快去上传一些精彩的瞬间吧！
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {photos.map((photo, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Fade in={true} timeout={300 + index * 100}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: 2,
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                        }
                                    }}
                                    onClick={() => handlePhotoClick(photo)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="220"
                                        image={photo.url}
                                        alt={photo.name}
                                        sx={{ 
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography 
                                            variant="h6" 
                                            component="div" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {photo.name || '未命名'}
                                        </Typography>
                                        {photo.uploadDate && (
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(photo.uploadDate).toLocaleDateString('zh-CN')}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* 照片详情弹窗 */}
            <PhotoModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                photo={selectedPhoto}
                onUpdate={handlePhotoUpdate}
                onDelete={handlePhotoDelete}
            />
        </Box>
    );
};

export default PhotoGrid;