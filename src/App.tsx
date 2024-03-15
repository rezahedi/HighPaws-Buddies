import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AuthProvider } from "@/providers"
import Layout from "@/Layout"
import { useAuth } from "@/providers/auth"

// TODO: Should be Lazy Loaded (Except main component all should be lazy loaded)
// import { Login, ForgotPassword } from "@/pages/auth"
import '@/styles/global.css'
import { profileProp } from "./types/firestore"

const Intro = lazy(() => import('@/pages/intro'))
const Feed = lazy(() => import('@/pages/feed'))
const PostPage = lazy(() => import('@/pages/post'))
const Profile = lazy(() => import('@/pages/profile'))
const Signup = lazy(() => import('@/pages/auth/signup/Signup'))
const Login = lazy(() => import('@/pages/auth/login'))
const ForgotPassword = lazy(() => import('@/pages/auth/forgotpassword'))
const Discover = lazy(() => import('@/pages/discover'))
const Notifications = lazy(() => import('@/pages/notifications'))

// TODO: Read below article about routing layers to build routes like next.js with layout and hierarchy
// https://semaphoreci.com/blog/routing-layer-react

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute redirectTo='/intro' />}>
              <Route path="/" element={<Feed />} />
            </Route>
            <Route element={<ProtectedRoute redirectTo="/login" />}>
              <Route path="/:userHandler/:postId" element={<PostPage />} />
              <Route path="/:userHandler" element={<Profile />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Route>
          <Route path="/signup" element={<Suspense fallback={<div>Loading</div>}><Signup /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div>Loading</div>}><Login /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<div>Loading</div>}><ForgotPassword /></Suspense>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

const ProtectedRoute = ({ redirectTo = '/login' }: {
  redirectTo?: string
}) => {
  const { profile, loading } = useAuth()
  if(loading) return <div>Loading</div>

  if (!profile) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};