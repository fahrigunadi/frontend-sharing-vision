import axios from "axios";
import Layout from "../Components/Layout";
import { useState } from "react";
import { Navigate } from "react-router";

function CreatePost() {
  const [data, setData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/article`, data)
      .then((response) => {
        console.log(response);

        setData({
          title: "",
          content: "",
          category: "",
          status: "draft",
        });

        setLoading(false);

        setSuccess(true);
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
        setLoading(false);
      });
  }

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  return (
    <Layout>
      {success && (
          <Navigate to="/" replace={true} />
      )}
      <div className="container max-w-screen-xl mx-auto">
        <div className="pt-5 mb-6">
          <h1 className="text-3xl font-bold">Create Post</h1>
        </div>

        <div className="rounded w-full border p-6">
          {errors && (
            <ul className="mb-6">
              {Object.keys(errors).map((key, index) => (
                <ol className="text-red-500 mb-1" key={index}>
                  {errors[key]}
                </ol>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="mb-5">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
              <input value={data.title} onChange={handleChange} name="title" type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required placeholder="Title" />
            </div>

            <div className="mb-5">
              <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900">Content</label>
              <textarea value={data.content} onChange={handleChange} name="content" id="content" rows="5" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
            </div>

            <div className="mb-5">
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Category</label>
              <input value={data.category} onChange={handleChange} name="category" type="text" id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>

            <div className="mb-5 flex space-x-2 items-center">
              <button disabled={loading} onClick={() => setData({ ...data, status: "publish" })} type="button" className={`focus:outline-none text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 ${data.status === "publish" ? "bg-gray-400" : "bg-green-700"}`}>Publish</button>
              <button disabled={loading} onClick={() => setData({ ...data, status: "draft" })} type="button" className={`focus:outline-none text-white hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 ${data.status === "draft" ? "bg-gray-400" : "bg-yellow-500"}`}>Draft</button>
              <span>
                {data.status}
              </span>
            </div>

            <button disabled={loading} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
          </form>
        </div>

      </div>
    </Layout>
  );
}

export default CreatePost
