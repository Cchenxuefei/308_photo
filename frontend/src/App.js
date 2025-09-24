import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import PhotoGrid from './components/PhotoGrid';
import GradeGrid from './components/GradeGrid';
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/photos' : undefined}>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teachers" element={<PhotoGrid category="teachers" />} />
            <Route path="/phd-students" element={<GradeGrid category="phd_students" />} />
            <Route path="/phd-students/:grade" element={<PhotoGrid category="phd_students" />} />
            <Route path="/master-students" element={<GradeGrid category="master_students" title="硕士研究生" />} />
            <Route path="/master-students/:grade" element={<PhotoGrid category="master_students" />} />
            <Route path="/lab-life" element={<PhotoGrid category="lab_life" />} />
            {/* New categories */}
            <Route path="/postdocs" element={<PhotoGrid category="postdocs" />} />
            <Route path="/lab-assistants" element={<PhotoGrid category="lab_assistants" />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
