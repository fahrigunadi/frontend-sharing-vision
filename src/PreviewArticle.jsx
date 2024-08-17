import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Layout from "./Components/Layout";

function PreviewArticle() {
  const id = window.location.pathname.split("/").pop();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/article/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <div className="pt-5 text-center mb-8">
        <h1 className="text-3xl font-bold">{data.title}</h1>
      </div>

      <div className="w-full text-start mt-3 mb-8">
        <small>Category:</small> <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">{data.category}</span>
      </div>

      <p>{data.content}</p>
    </Layout>
  );
}

export default PreviewArticle
