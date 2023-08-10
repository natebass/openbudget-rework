import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Layout from './pages/Layout'
import NoPage from './pages/NoPage'
import BudgetFlow from './pages/BudgetFlow'
import BudgetTree from './pages/BudgetTree'
import Compare from './pages/Compare'
import Contact from './pages/Contact'
import CustomQueries from './pages/CustomQueries'
import Timeline from './pages/Timeline'
import ToolsProjects from './pages/ToolsProjects'
import WhoWeAre from './pages/WhoWeAre'
import Home from './pages/Home'
import Blog from './pages/Blog'

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Compare/>}/>
          <Route path="home" element={<Home/>}/>
          <Route path="compare" element={<Compare/>}/>
          <Route path="budget-flow" element={<BudgetFlow/>}/>
          <Route path="budget-tree" element={<BudgetTree/>}/>
          <Route path="contact" element={<Contact/>}/>
          <Route path="custom-queries" element={<CustomQueries/>}/>
          <Route path="timeline" element={<Timeline/>}/>
          <Route path="tools-projects" element={<ToolsProjects/>}/>
          <Route path="who-we-are" element={<WhoWeAre/>}/>
          <Route path="blog" element={<Blog/>}/>
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
