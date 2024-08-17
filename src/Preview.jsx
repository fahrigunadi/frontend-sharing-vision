import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Layout from "./Components/Layout";
import { Link } from "react-router-dom";

const limit = 6;

function Preview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(new URLSearchParams(window.location.search).get("page") || 1);

  useEffect(() => {
    const fetchData = async () => {
      const pageInt = parseInt(page) || 1;
      const offset = (pageInt === 1 ? 0 : pageInt - 1) * limit;
  
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/article/${limit}/${offset}?status=publish`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <div className="pt-5 text-center mb-8">
        <h1 className="text-3xl font-bold">Preview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-6 px-6">
        {data.map((item) => (
          <div key={item.id}>
            <Link to={`/preview/${item.id}`} className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item.title}</h5>
              <p className="font-normal text-gray-700">{item.content}</p>
              <div className="w-full text-start mt-3">
                <small>Category:</small> <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">{item.category}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex">
          {page != "1" ? (
            <Link onClick={() => handlePageChange(parseInt(page) - 1 || 1)} to={`?page=${parseInt(page) - 1 || 1}`} className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
              Previous
            </Link>
          ) : (
            <button disabled className="cursor-not-allowed flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
              Previous
            </button>
          )}

          {data && data.length < limit ? (
            <button disabled className="cursor-not-allowed flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
              Next
            </button>
          ) : (
            <Link onClick={() => handlePageChange(parseInt(page) + 1)} to={`?page=${parseInt(page) + 1}`} className="flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
              Next
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Preview
