const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const crypto = require('crypto');

// 生成唯一ID的函数
const generateId = () => {
    return crypto.randomUUID();
};

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, 'public');
app.use('/uploads', express.static(publicPath));

// 数据库文件路径
const dbPath = path.join(__dirname, 'photos.json');

// 初始化数据库和目录
const initializeApp = async () => {
    // 创建上传目录
    const dirs = [
        path.join(publicPath, 'teachers'),
        path.join(publicPath, 'students', 'phd'),
        path.join(publicPath, 'students', 'master'),
        path.join(publicPath, 'lab_life'),
        // 新增分类目录
        path.join(publicPath, 'postdocs'),
        path.join(publicPath, 'lab_assistants'),
        // 可选：预先创建支持团队的子目录，便于分类管理
        path.join(publicPath, 'lab_assistants', 'instrument'),
        path.join(publicPath, 'lab_assistants', 'research'),
        path.join(publicPath, 'lab_assistants', 'hygiene')
    ];
    
    for (const dir of dirs) {
        try {
            await fs.mkdir(dir, { recursive: true });
        } catch (error) {
            console.error(`Error creating directory ${dir}:`, error);
        }
    }

    // 初始化数据库文件
    try {
        await fs.access(dbPath);
    } catch (error) {
        // 文件不存在，创建空数据库
        await fs.writeFile(dbPath, JSON.stringify([]), 'utf-8');
    }
};

// 读取数据库
const readDatabase = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return [];
    }
};

// 写入数据库
const writeDatabase = async (data) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing database:', error);
        throw error;
    }
};

// 获取照片数据 API
app.get('/api/photos', async (req, res) => {
    try {
        console.log('[/api/photos] Received query:', req.query);
        const { category, subCategory, grade } = req.query;
        const photos = await readDatabase();
        
        let filteredPhotos = photos;
        
        if (category) {
            filteredPhotos = filteredPhotos.filter(photo => photo.category === category);
        }
        if (subCategory) {
            filteredPhotos = filteredPhotos.filter(photo => photo.subCategory === subCategory);
        }
        if (grade) {
            filteredPhotos = filteredPhotos.filter(photo => photo.grade === grade);
        }
        
        // console.log(`[/api/photos] Returning ${filteredPhotos.length} photos for query:`, req.query);
        res.json(filteredPhotos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 更新照片信息 API
app.put('/api/photos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, photoDate } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ error: '姓名不能为空' });
        }
        
        const photos = await readDatabase();
        const photoIndex = photos.findIndex(photo => photo.id === id);
        
        if (photoIndex === -1) {
            return res.status(404).json({ error: '照片未找到' });
        }
        
        // 更新照片信息
        photos[photoIndex].name = name.trim();
        photos[photoIndex].description = description ? description.trim() : '';
        photos[photoIndex].location = location ? location.trim() : '';
        photos[photoIndex].photoDate = photoDate ? photoDate.trim() : '';
        photos[photoIndex].updatedAt = new Date().toISOString();
        
        await writeDatabase(photos);
        
        res.json(photos[photoIndex]);
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 删除照片 API
app.delete('/api/photos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const photos = await readDatabase();
        const photoIndex = photos.findIndex(photo => photo.id === id);
        
        if (photoIndex === -1) {
            return res.status(404).json({ error: '照片未找到' });
        }
        
        const photo = photos[photoIndex];
        
        // 删除文件
        try {
            await fs.unlink(photo.filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
        
        // 从数据库中删除
        photos.splice(photoIndex, 1);
        await writeDatabase(photos);
        
        res.json({ message: '照片删除成功' });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 文件上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 默认上传到 lab_life 目录，后续会根据实际分类移动文件
        const uploadPath = path.join(publicPath, 'lab_life');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// 上传照片 API
app.post('/api/upload', upload.array('photos', 10), async (req, res) => {
    try {
        // console.log('Received upload request body:', req.body);
        const { name, category, subCategory, grade, description, location, photoDate } = req.body;
        
        if (!name || !category || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: '请填写所有必填字段并选择照片' });
        }
        
        const photos = await readDatabase();
        const newPhotos = [];
        
        for (const file of req.files) {
            // 确定目标目录
            let targetDir = path.join(publicPath, category);
            if (subCategory) {
                targetDir = path.join(targetDir, subCategory);
            } else if (grade) {
                targetDir = path.join(targetDir, grade);
            }
            
            // 确保目标目录存在
            await fs.mkdir(targetDir, { recursive: true });
            
            // 移动文件到正确的目录
            const targetPath = path.join(targetDir, file.filename);
            await fs.rename(file.path, targetPath);
            
                let urlPath = `/${category}`;
                if (subCategory) {
                    urlPath += `/${subCategory}`;
                } else if (grade) {
                    urlPath += `/${grade}`;
                }

                const photoData = {
                    id: generateId(),
                    name: name.trim(),
                    description: description ? description.trim() : '',
                    location: location ? location.trim() : '',
                    photoDate: photoDate ? photoDate.trim() : '',
                    category,
                    subCategory: subCategory || null,
                    grade: grade || null,
                    filename: file.filename,
                    originalName: file.originalname,
                    filePath: targetPath,
                    url: `/uploads${urlPath}/${file.filename}`,
                    uploadDate: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
            
            photos.push(photoData);
            newPhotos.push(photoData);
        }
        
        await writeDatabase(photos);
        
        res.json({ 
            message: '照片上传成功',
            photos: newPhotos
        });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// 下载照片 API
app.get('/api/download/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const photos = await readDatabase();
        const photo = photos.find(p => p.id === id);
        
        if (!photo) {
            return res.status(404).json({ error: '照片未找到' });
        }
        
        res.download(photo.filePath, `${photo.name}.jpg`, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ error: '下载失败' });
            }
        });
    } catch (error) {
        console.error('Error downloading photo:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制（最大10MB）' });
        }
    }
    res.status(500).json({ error: error.message || 'Server error' });
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await initializeApp();
});