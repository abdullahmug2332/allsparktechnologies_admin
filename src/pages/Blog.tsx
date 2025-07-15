import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

export interface BlogItem {
  id: number;
  image: string;
  service: string;
  title: string;
  subtitle: string;
  date?: string;
}

export interface BlogPageData {
  heroimg: string;
  title: string;
  subTitle: string;
  blogs: BlogItem[];
}

interface Blogs {
  id: number;
  title: string;
  description: string;
  urlName: string;
  image: string;
  created_at: string;
  content: string;
}

const EditBlogPage: React.FC = () => {
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [data, setData] = useState<BlogPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blogs[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`${baseURL}/blogs`);
        setBlogs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch blogs :", error);
      }
    };

    fetchBlogData();
  }, []);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`${baseURL}/blogdata`);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      }
    };

    fetchBlogData();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedData = {
        ...data,
      };
      await axios.put(`${baseURL}/blogdata`, updatedData);
      setIsLoading(false);
      alert("Blog Page updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating Blog data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDynamicImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageKey", imageKey);

    try {
      const res = await axios.post(`${baseURL}/upload-blog-image`, formData);
      const imagePath = res.data.path;

      setData((prevData: any) => {
        const newData = { ...prevData };
        const keys = imageKey.replace(/\[(\w+)\]/g, ".$1").split(".");
        let ref: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = imagePath;
        return newData;
      });

      alert(`${imageKey} updated`);
    } catch (err) {
      console.error(err);
      alert(`Failed to upload image for ${imageKey}`);
    }
  };

  // Pagination Logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs?.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = blogs ? Math.ceil(blogs.length / blogsPerPage) : 0;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDeleteBlog = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await axios.delete(`${baseURL}/blog`, {
        data: { id },
      });
      setBlogs(
        (prevBlogs) => prevBlogs?.filter((blog) => blog.id !== id) || []
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Failed to delete blog:", error);
      alert("Error deleting blog.");
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div
      className={`${
        toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
      } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] space-y-6`}
    >
      {isLoading && <Loader />}
      <h1 className="color text-[32px] font-semibold my-[20px]">Blog Page</h1>
      <img
        src={`${baseURL}/images/blogs/${data.heroimg}`}
        className="mt-[20px] w-full h-[250px] object-cover"
      />
      <input
        type="file"
        onChange={(e) => handleDynamicImageUpload(e, `heroimg`)}
      />
      <div className="relative">
        <h2 className="text-[18px] font-semibold mt-[10px]">Title:</h2>
        <input
          className="block w-full my-2 p-2 border"
          value={data?.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        <h2 className="text-[18px] font-semibold mt-[10px]">Subtitle:</h2>
        <input
          className="block w-full my-2 p-2 border"
          value={data?.subTitle}
          onChange={(e) => setData({ ...data, subTitle: e.target.value })}
        />

        <button
          className="bg text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>
        <div className="relative">
          <h1 className="color text-[32px] font-semibold my-[20px]">
            All Blogs
          </h1>
          <Link to={"/createblog"}>
            <button className="bg px-[25px] py-[5px] rounded-[4px] text-white absolute top-7 right-0 hover:scale-[1.04] duration-300 ">
              Add Blog
              <FaPlus className="inline" />
            </button>
          </Link>
          <Table className="cursor-pointer min-w-[800px] overflow-x-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="color"> </TableHead>
                <TableHead className="color">Image</TableHead>
                <TableHead className="color">Title</TableHead>
                <TableHead className="color">Slug</TableHead>
                <TableHead className="color">Created At</TableHead>
                <TableHead className="color">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBlogs?.map((blog, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {(currentPage - 1) * blogsPerPage + index + 1}
                  </TableCell>

                  <TableCell>
                    <img
                      className="w-[70px] h-[50px] object-cover rounded-[4px]"
                      src={`${baseURL}/images/blogs/${blog.image}`}
                      alt="blogimg"
                    />
                  </TableCell>
                  <TableCell>
                    {blog.title.length > 29
                      ? blog.title.slice(0, 29) + "..."
                      : blog.title}
                  </TableCell>
                  <TableCell>
                    {blog.urlName.length > 29
                      ? blog.urlName.slice(0, 29) + "..."
                      : blog.urlName}
                  </TableCell>

                  <TableCell>
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link to={`/editblog/${blog.urlName}`}>
                        <CiEdit className="color text-[22px] hover:scale-[1.1] duration-300" />
                      </Link>
                      <MdOutlineDelete
                        className="color text-[22px] hover:scale-[1.1] duration-300"
                        onClick={() => handleDeleteBlog(blog.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex gap-2 mt-4 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border color rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded  ${
                  currentPage === index + 1 ? "bg text-white" : " color"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 color border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPage;
