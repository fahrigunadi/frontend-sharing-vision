import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import IndexPost from "./Post/Index.jsx";
import CreatePost from "./Post/Create.jsx";
import EditPost from "./Post/EditPost.jsx";
import Preview from "./Preview.jsx";
import PreviewArticle from "./PreviewArticle.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPost />,
  },
  {
    path: "/create",
    element: <CreatePost />,
  },
  {
    path: "/:id/edit",
    element: <EditPost />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/preview/:id",
    element: <PreviewArticle />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);