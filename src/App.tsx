import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Public, Profile } from "@/pages"

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
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
