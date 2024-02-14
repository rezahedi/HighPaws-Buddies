import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Public, Profile, New } from "@/pages"

function App() {

  // initialize a browser router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Public />,
    },
    // other pages....
    {
      path: "/:userHandler",
      element: <Profile />,
    },
    {
      path: "/new",
      element: <New />,
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
