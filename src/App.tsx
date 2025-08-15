import { useState } from 'react';
import { CameraPage, EditorPage } from './pages';

type PageType = 'camera' | 'editor';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('camera');

  if (currentPage === 'editor') {
    return <EditorPage onPageChange={setCurrentPage} />;
  }

  return <CameraPage onPageChange={setCurrentPage} />;
}

export default App
