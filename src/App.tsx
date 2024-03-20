import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/providers"
import Layout from "@/Layout"
// TODO: Should be Lazy Loaded (Except main component all should be lazy loaded)
// import { Login, ForgotPassword } from "@/pages/auth"
import '@/styles/global.css'

const Intro = lazy(() => import('@/pages/intro'))
const Feed = lazy(() => import('@/pages/feed'))
const PostPage = lazy(() => import('@/pages/post'))
const Profile = lazy(() => import('@/pages/profile'))
const Signup = lazy(() => import('@/pages/auth/signup/Signup'))
const Login = lazy(() => import('@/pages/auth/login'))
const ForgotPassword = lazy(() => import('@/pages/auth/forgotpassword'))
const Discover = lazy(() => import('@/pages/discover'))
const Notifications = lazy(() => import('@/pages/notifications'))

const Account = lazy(() => import('@/pages/settings/account'))
const NotificationSetting = lazy(() => import('@/pages/settings/notifications'))
const SidebarNav = lazy(() => import('@/components/settings/SidebarNav'))

// TODO: Read below article about routing layers to build routes like next.js with layout and hierarchy
// https://semaphoreci.com/blog/routing-layer-react

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/:userHandler/:postId" element={<PostPage />} />
            <Route path="/:userHandler" element={<Profile />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route element={<Layout sidebar={<Suspense><SidebarNav /></Suspense>} />}>
            <Route path="/settings" element={<Navigate to='/settings/account' />} />
            <Route path="/settings/account" element={<Account />} />
            <Route path="/settings/notifications" element={<NotificationSetting />} />
          </Route>
          <Route path="/signup" element={<Suspense fallback={<div>Loading</div>}><Signup /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div>Loading</div>}><Login /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<div>Loading</div>}><ForgotPassword /></Suspense>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
