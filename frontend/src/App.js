import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateBoard from './pages/CreateBoard';
import ReportQueue from './pages/ReportQueue';
import ThicketBoard from './pages/ThicketBoard';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditAvatar from './pages/EditAvatar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-board" element={<CreateBoard />} />
        <Route path="/reports" element={<ReportQueue />} />
        <Route path="/thickets/:thicketName" element={<ThicketBoard />} />
        <Route path="/thickets/:thicketName/new-post" element={<CreatePost />} />
        <Route path="/thickets/:thicketName/posts/:postId" element={<PostDetail />} />
        <Route path="/edit-avatar" element={<EditAvatar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
