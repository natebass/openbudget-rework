import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Compare from './components/Compare'
import Layout from './components/Layout'
import NoPage from './components/NoPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/openbudget-rework" element={<Layout/>}>
          <Route index element={<Compare/>}/>
          <Route path="compare" element={<Compare/>}/>
          <Route path="*" element={<NoPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App></App>
    </QueryClientProvider>
  </React.StrictMode>
)
