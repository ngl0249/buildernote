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
import Privacy from "./pages/landing/undersider/Privacy"
import Terms from "./pages/landing/undersider/Terms"
import Guides from "./pages/landing/undersider/Guides"
import Produktoversigt from "./pages/landing/undersider/Produktoversigt"
import Hjaelpecenter from "./pages/landing/undersider/Hjaelpecenter"
import Priser from "./pages/landing/undersider/Priser"
import Kommende from "./pages/landing/undersider/Kommende"
import Status from "./pages/landing/undersider/Status"
import Team from "./pages/landing/undersider/Team"
import ResetPassword from "./pages/landing/undersider/ResetPassword"

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
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "guides",           element: <Guides /> },
      { path: "productoverview",  element: <Produktoversigt /> },
      { path: "hjaelpecenter",    element: <Hjaelpecenter /> },
      { path: "prices",           element: <Priser /> },
      { path: "upgrade",           element: <Priser /> },
      { path: "forthcoming",         element: <Kommende /> },
      { path: "status",           element: <Status />},
      { path: "reset",            element: <ResetPassword />},
      {path:  "team",             element: <Team />},
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