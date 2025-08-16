import { useState } from 'react';
import { CameraPage, EditorPage } from './pages';

type PageType = 'camera' | 'editor';

interface AppState {
  currentPage: PageType;
  editingImage?: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'camera'
  });

  const handlePageChange = (page: PageType, imageData?: string) => {
    setAppState({
      currentPage: page,
      editingImage: imageData
    });
  };

  if (appState.currentPage === 'editor') {
    return <EditorPage onPageChange={handlePageChange} initialImage={appState.editingImage} />;
  }

  return <CameraPage onPageChange={handlePageChange} />;
}

export default App
