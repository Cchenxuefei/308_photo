import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Slide,
  Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const PhotoModal = ({ open, onClose, photo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  React.useEffect(() => {
    if (photo) {
      setEditedName(photo.name || '');
      setEditedLocation(photo.location || '');
      setEditedDate(photo.photoDate || '');
      setEditedDescription(photo.description || '');
    }
  }, [photo]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        name: editedName,
        location: editedLocation,
        photoDate: editedDate,
        description: editedDescription
      };

      const response = await axios.put(`/api/photos/${photo.id}`, updatedData);
      // 后端返回的是更新后的照片对象，不包含 success 字段
      const updatedPhoto = response.data;

      setMessage({ type: 'success', text: '照片信息已成功更新！' });
      setIsEditing(false);
      onUpdate(updatedPhoto);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('更新照片信息失败:', error);
      setMessage({ type: 'error', text: '更新失败，请重试' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(photo.name || '');
    setEditedLocation(photo.location || '');
    setEditedDate(photo.photoDate || '');
    setEditedDescription(photo.description || '');
    setIsEditing(false);
    setMessage(null);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name || 'photo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这张照片吗？此操作不可撤销。')) {
      setLoading(true);
      try {
        await axios.delete(`/api/photos/${photo.id}`);
        // 后端返回 { message: '照片删除成功' }，不包含 success 字段，直接本地更新列表即可
        setMessage({ type: 'success', text: '照片已成功删除！' });
        onDelete(photo.id);
        onClose();
      } catch (error) {
        console.error('删除照片失败:', error);
        setMessage({ type: 'error', text: '删除失败，请重试' });
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const getCategoryLabel = (category, subCategory) => {
    const categoryMap = {
      'teachers': '师资力量',
      'phd_students': '博士研究生',
      'master_students': '硕士研究生',
      'lab_life': '实验室生活',
      'postdocs': '博士后',
      'lab_assistants': '实验室支持团队'
    };
    const subMap = {
      'instrument': '仪器管理',
      'research': '科研助理',
      'hygiene': '卫生保洁'
    };
    
    let label = categoryMap[category] || category;
    if (subCategory && subMap[subCategory]) {
      label += ` - ${subMap[subCategory]}`;
    }
    return label;
  };

  if (!photo) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '800px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6">照片详情</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: '100%' }}>
        {message && (
          <Box sx={{ p: 2 }}>
            <Alert severity={message.type}>
              {message.text}
            </Alert>
          </Box>
        )}

        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* 左侧：照片显示区域 */}
          <Box sx={{ 
            flex: '1 1 60%', 
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Fade in={open} timeout={800}>
              <img
                src={photo.url}
                alt={photo.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
            </Fade>
          </Box>

          {/* 右侧：信息区域 */}
          <Slide direction="left" in={open} timeout={600}>
            <Box sx={{ 
              flex: '1 1 40%',
              p: 3,
              backgroundColor: '#fafafa',
              borderLeft: '1px solid #e0e0e0',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {/* 标题区域 */}
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {photo.name || '未命名照片'}
                </Typography>
                <Chip 
                  label={getCategoryLabel(photo.category, photo.subCategory)}
                  color="primary"
                  variant="filled"
                  sx={{ fontSize: '0.875rem' }}
                />
              </Box>

              {/* 上传时间 */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  上传时间
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {new Date(photo.uploadTime).toLocaleString('zh-CN')}
                </Typography>
              </Box>

              {/* 姓名 */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  姓名
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="请输入姓名"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {photo.name || '未设置'}
                  </Typography>
                )}
              </Box>

              {/* 拍摄地点 */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  拍摄地点
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    placeholder="请输入拍摄地点"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {photo.location || '未设置'}
                  </Typography>
                )}
              </Box>

              {/* 拍摄日期 */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  拍摄日期
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {photo.photoDate || '未设置'}
                  </Typography>
                )}
              </Box>

              {/* 描述信息 */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  描述信息
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="请输入照片描述信息"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500" sx={{ minHeight: '1.5em' }}>
                    {photo.description || '未设置'}
                  </Typography>
                )}
              </Box>

              {/* 编辑按钮 */}
              {!isEditing && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => setIsEditing(true)} 
                    color="primary"
                    sx={{ 
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.12)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Slide>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              color="primary"
            >
              下载
            </Button>
            <Button
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
              color="error"
              disabled={loading}
            >
              删除
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PhotoModal;