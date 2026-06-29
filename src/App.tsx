import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ArchivePage } from './pages/ArchivePage'
import { UpdatePage } from './pages/UpdatePage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/update/:id" element={<UpdatePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
