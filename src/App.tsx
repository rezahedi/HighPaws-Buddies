import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Feed, Profile, New } from "@/pages"
import { PostPage } from "@/pages/post"
import { AuthProvider } from "@/providers"
// TODO: Should be Lazy Loaded (Except main component all should be lazy loaded)
import { Signup, Login, ForgotPassword } from "@/pages/auth"
import '@/styles/global.css'

// TODO: Read below article about routing layers to build routes like next.js with layout and hierarchy
// https://semaphoreci.com/blog/routing-layer-react

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Public />} /> */}
          <Route path="/" element={<Feed />} />
          <Route path="/:userHandler/:postId" element={<PostPage />} />
          <Route path="/:userHandler" element={<Profile />} />
          <Route path="/new" element={<New />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
