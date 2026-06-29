import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import HomeScreen from './screens/HomeScreen';
import WorldMapScreen from './screens/WorldMapScreen';
import SessionScreen from './screens/SessionScreen';

function AppInit({ children }: { children: React.ReactNode }) {
  const { load } = useGameStore();
  useEffect(() => { load(); }, []);
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/map" element={<WorldMapScreen />} />
          <Route path="/session/:nodeId" element={<SessionScreen />} />
        </Routes>
      </AppInit>
    </BrowserRouter>
  );
}
