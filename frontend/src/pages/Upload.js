import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from 'axios';

const DropZone = styled(Paper)(({ theme, isdragover }) => ({
  border: `2px dashed ${isdragover ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isdragover ? theme.palette.action.hover : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  }
}));

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [grade, setGrade] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = {
    teachers: { label: '师资力量', subCategories: [] },
    phd_students: {
      label: '博士研究生',
      subCategories: [],
      hasGrades: true,
      grades: [
        { value: '2026', label: '2026级' },
        { value: '2025', label: '2025级' },
        { value: '2024', label: '2024级' },
        { value: '2023', label: '2023级' },
        { value: '2022', label: '2022级' },
        { value: '2021', label: '2021级' },
        { value: '2020', label: '2020级' }
      ]
    },
    master_students: {
      label: '硕士研究生',
      subCategories: [],
      hasGrades: true,
      grades: [
        { value: '2026', label: '2026级' },
        { value: '2025', label: '2025级' },
        { value: '2024', label: '2024级' },
        { value: '2023', label: '2023级' },
        { value: '2022', label: '2022级' },
        { value: '2021', label: '2021级' }
      ]
    },
    lab_life: { label: '实验室生活', subCategories: [] },
    postdocs: { label: '博士后', subCategories: [] },
    lab_assistants: {
      label: '实验室支持团队',
      subCategories: [
        { value: 'instrument', label: '仪器管理' },
        { value: 'research', label: '科研助理' },
        { value: 'hygiene', label: '卫生保洁' }
      ]
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    handleFileSelection(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(item => item.id !== id);
      // 清理预览URL
      const removed = prev.find(item => item.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleUpload = async () => {
    if (!category || selectedFiles.length === 0 || !name.trim()) {
      setMessage({ type: 'error', text: '请填写所有必填字段并选择至少一张照片' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      selectedFiles.forEach(item => {
        formData.append('photos', item.file);
      });
      formData.append('category', category);
      if (subCategory) {
        formData.append('subCategory', subCategory);
      }
      if (grade) {
        formData.append('grade', grade);
      }
      formData.append('name', name.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      if (location.trim()) {
        formData.append('location', location.trim());
      }
      if (photoDate.trim()) {
        formData.append('photoDate', photoDate.trim());
      }

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({ type: 'success', text: '照片上传成功！' });
      // 清理表单
      setSelectedFiles([]);
      setCategory('');
      setSubCategory('');
      setGrade('');
      setName('');
      setDescription('');
      setLocation('');
      setPhotoDate('');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: '上传失败，请重试' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <PhotoCameraIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          上传照片
        </Typography>
        <Typography variant="h6" color="text.secondary">
          分享实验室的精彩瞬间
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        {/* 文件上传区域 */}
        <DropZone
          isdragover={isDragOver ? "true" : "false"}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
          sx={{ mb: 3 }}
        >
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            拖拽照片到这里或点击选择
          </Typography>
          <Typography variant="body2" color="text.secondary">
            支持 JPG、PNG、GIF 格式，可同时选择多张照片
          </Typography>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </DropZone>

        {/* 已选择的文件预览 */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              已选择的照片 ({selectedFiles.length})
            </Typography>
            <Grid container spacing={2}>
              {selectedFiles.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Card sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={item.preview}
                      alt="预览"
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeFile(item.id)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* 表单字段 */}
        <Grid container spacing={3}>
          {/* 第一行：分类、姓名和年级 */}
          <Grid item xs={12} sm={4}>
            <FormControl 
              fullWidth 
              variant="outlined" 
              required 
              style={{ width: '100%', display: 'block', minWidth: '200px' }}
            >
              <InputLabel id="category-label">分类</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                  setGrade('');
                }}
                label="分类"
                style={{ width: '100%', minWidth: '200px' }}
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <MenuItem key={key} value={key}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入照片中人物的姓名"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              visibility: category && categories[category]?.hasGrades ? 'visible' : 'hidden',
              height: '100%',
              minHeight: '56px' // 保持和输入框一样的高度
            }}>
              <TextField
                fullWidth
                required
                label="年级"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                variant="outlined"
                placeholder="请输入年级，如：2023级"
              />
            </Box>
          </Grid>

          {/* 第二行：拍摄地点、拍摄日期、描述信息 */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="拍摄地点"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="请输入拍摄地点"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="拍摄日期"
              type="date"
              value={photoDate}
              onChange={(e) => setPhotoDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="描述信息"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入照片的描述信息"
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* 上传按钮 */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0 || !category || !name.trim() || (categories[category]?.hasGrades && !grade)}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 3,
            }}
          >
            {uploading ? '上传中...' : '上传照片'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Upload;