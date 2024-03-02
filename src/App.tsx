import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/providers"
// TODO: Should be Lazy Loaded (Except main component all should be lazy loaded)
// import { Login, ForgotPassword } from "@/pages/auth"
import '@/styles/global.css'

const Feed = lazy(() => import('@/pages/feed'))
const PostPage = lazy(() => import('@/pages/post'))
const Profile = lazy(() => import('@/pages/profile'))
const New = lazy(() => import('@/pages/new'))
const Signup = lazy(() => import('@/pages/auth/signup/Signup'))
const Login = lazy(() => import('@/pages/auth/login'))
const ForgotPassword = lazy(() => import('@/pages/auth/forgotpassword'))
const Discover = lazy(() => import('@/pages/discover'))
const Notifications = lazy(() => import('@/pages/notifications'))

// TODO: Read below article about routing layers to build routes like next.js with layout and hierarchy
// https://semaphoreci.com/blog/routing-layer-react

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Suspense fallback={<div>Loading</div>}><Feed /></Suspense>} />
          <Route path="/:userHandler/:postId" element={<Suspense fallback={<div>Loading</div>}><PostPage /></Suspense>} />
          <Route path="/:userHandler" element={<Suspense fallback={<div>Loading</div>}><Profile /></Suspense>} />
          <Route path="/discover" element={<Suspense fallback={<div>Loading</div>}><Discover /></Suspense>} />
          <Route path="/notifications" element={<Suspense fallback={<div>Loading</div>}><Notifications /></Suspense>} />
          <Route path="/new" element={<Suspense fallback={<div>Loading</div>}><New /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<div>Loading</div>}><Signup /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div>Loading</div>}><Login /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<div>Loading</div>}><ForgotPassword /></Suspense>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
