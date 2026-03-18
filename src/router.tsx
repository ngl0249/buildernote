import { createBrowserRouter, Navigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./lib/firebase/firebase"
import { useAuth } from "./pages/backend/hooks/useAuth"
import Landing     from "./pages/landing/Landing"
import Login       from "./pages/landing/pages/Login"
import Register    from "./pages/landing/pages/Register"
import Dashboard   from "./pages/backend/dashboard/dashboard"
import ProfilePage from "./pages/backend/profile/ProfilePage"
import BoardPage   from "./pages/backend/dashboard/board/BoardPage"
import NotFound    from "./pages/landing/components/NotFound"

const DashboardRedirect = () => {
  const [user, loading] = useAuthState(auth)
  const { profile, loading: profileLoading } = useAuth()

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#1e2433] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  const handle = profile?.username || user.uid
  return <Navigate to={`/${handle}/home`} replace />
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e2433] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    children: [
      { index: true,       element: <Landing /> },        
      { path: "login",     element: <Login /> },
      { path: "register",  element: <Register /> },
      { path: "dashboard", element: <PrivateRoute><DashboardRedirect /></PrivateRoute> },
      {
        path: ":username",
        children: [
          { index: true,              element: <NotFound /> },  
          { path: "home",             element: <PrivateRoute><Dashboard /></PrivateRoute> },
          { path: "profile",          element: <PrivateRoute><ProfilePage /></PrivateRoute> },
          { path: "board/:boardSlug", element: <PrivateRoute><BoardPage /></PrivateRoute> },
          { path: "*",                element: <NotFound /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
])

export default router