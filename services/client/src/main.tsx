import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { store } from './store/store.tsx'

const CLIENT_ID =
  "621892134362-fsavmq6bn496765hrhji318bdcq3ej9f.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
       <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
