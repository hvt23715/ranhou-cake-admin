import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import AIAssistant from '@/pages/AIAssistant'
import StoreMap from '@/pages/StoreMap'
import CameraMonitor from '@/pages/CameraMonitor'
import Settings from '@/pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="map" element={<StoreMap />} />
        <Route path="camera" element={<CameraMonitor />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
