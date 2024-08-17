import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Layout from "../Components/Layout";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const statuses = ["publish", "draft", "trash"];
const limit = 2;

function IndexPost() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(new URLSearchParams(window.location.search).get("page") || 1);

  const [filterStatus, setFilterStatus] = useState(new URLSearchParams(window.location.search).get("status") || "publish");

  const fetchData = async (offset, status) => {

    console.log(status, filterStatus, offset);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/article/${limit}/${offset}?status=${status}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleTrash = async (item) => {
    if (confirm("Are you sure you want to trash this post?")) {
      try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/article/${item.id}`, {
          title: item.title,
          content: item.content,
          category: item.category,
          status: "trash",
        });
        fetchData(0, filterStatus);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/article/${id}`);
        fetchData(0, filterStatus);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const pageInt = parseInt(page) || 1;
    const offset = (pageInt === 1 ? 0 : pageInt - 1) * limit;

    fetchData(offset, filterStatus);
  }, []);

  function setFilter(status) {
    statuses.includes(status) ? setFilterStatus(status) : setFilterStatus("publish");

    setPage(1);

    fetchData(0, status);
  }

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);

    const pageInt = parseInt(pageNumber) || 1;
    const offset = (pageInt === 1 ? 0 : pageInt - 1) * limit;

    fetchData(offset, filterStatus);
  };

  const tabs = [
    { name: "Published", status: "publish", href: "/", current: filterStatus === "publish" },
    { name: "Drafts", status: "draft", href: "?status=draft", current: filterStatus === "draft" },
    { name: "Trashed", status: "trash", href: "?status=trash", current: filterStatus === "trash" },
  ];

  if (error) return <p>Error: {error.message}</p>;
  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto">
        <div className="pt-5 mb-6">
          <h1 className="text-3xl font-bold">All Posts</h1>
        </div>

        <div className="relative overflow-x-auto">

          <div className="flex justify-between mb-2 border-b border-gray-200">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
                {tabs.map((tab) => (
                    <li key={tab.name} className="mr-2">
                        <Link
                            onClick={() => setFilter(tab.status)}
                            to={tab.href}
                            className={tab.current ? "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50"}
                        >
                            {tab.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="create" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Add New</Link>
          </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    )}

                    {data && data.map((item) => (
                      <tr className="bg-white border-b" key={item.id}>
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {item.title}
                          </th>
                          <td className="px-6 py-4">
                              {item.category}
                          </td>
                          <td className="px-6 py-4">
                            <Link to={`/${item.id}/edit`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center me-2">
                              <PencilSquareIcon className="size-4" />
                            </Link>
                            {filterStatus !== "trash" ? (
                              <button onClick={() => handleTrash(item)} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2">
                                <TrashIcon className="size-4" />
                              </button>
                            ) : (
                              <button onClick={() => handleDelete(item.id)} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2">
                                <TrashIcon className="size-4" />
                              </button>
                            )}
                          </td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="flex justify-end mt-6">
          <div className="flex">
            {page != "1" ? (
              <Link onClick={() => handlePageChange(parseInt(page) - 1 || 1)} to={`?page=${parseInt(page) - 1 || 1}&status=${filterStatus}`} className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
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
              <Link onClick={() => handlePageChange(parseInt(page) + 1)} to={`?page=${parseInt(page) + 1}&status=${filterStatus}`} className="flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPost
