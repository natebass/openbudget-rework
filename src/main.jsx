import React from 'react'
import ReactDOM from 'react-dom/client'
import Compare from './components/Compare.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Compare/>
    </QueryClientProvider>)
  </React.StrictMode>,
)
