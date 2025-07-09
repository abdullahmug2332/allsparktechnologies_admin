import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

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

const EditBlogPage: React.FC = () => {
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [data, setData] = useState<BlogPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
      alert("Error updating Blog data");
    }finally{
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
    formData.append("imageKey", imageKey); // e.g., 'logos[0].src'

    try {
      const res = await axios.post(`${baseURL}/upload-blog-image`, formData);
      const imagePath = res.data.path;

      // ✅ Update local state (data)
      setData((prevData: any) => {
        const newData = { ...prevData };

        // ✅ Parse and apply the key (e.g., 'logos[2].src')
        const keys = imageKey
          .replace(/\[(\w+)\]/g, ".$1") // convert [2] to .2
          .split(".");

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

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className={`${
        toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
      } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] space-y-6`}
    >
      {isLoading && <Loader />}
      <img
        src={`${baseURL}/images/blogs/${data.heroimg}`}
        className="mt-[20px] w-full h-[250px] object-cover"
      />
      <input
        type="file"
        onChange={(e) => handleDynamicImageUpload(e, `heroimg`)}
      />
      <h1 className="color text-[32px] font-semibold my-[20px]">
        Edit Blog Page
      </h1>
      <div>
        <div>
          <h2 className="text-[18px] font-semibold mt-[10px]">Title:</h2>
          <input 
            className="block w-full my-2 p-2 border"
            value={data?.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold mt-[10px]">Subtitle:</h2>
          <input
            className="block w-full my-2 p-2 border"
            value={data?.subTitle}
            onChange={(e) => setData({ ...data, subTitle: e.target.value })}
          />
        </div>
        <button
          className="bg text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>
        <h1 className="color text-[32px] font-semibold my-[20px]">
          Edit All Blogs
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-[10px] gap-y-[30px]  mt-[30px]">
          {data?.blogs?.map((blog, i) => (
            <div
              key={i}
              className="flex flex-col shadow-2xl cursor-pointer hover:scale-[1.009] duration-500 rounded-[10px] overflow-hidden"
            >
              <img
                src={`${baseURL}/images/blogs/${blog.image}`}
                alt="img"
                className="h-[330px] object-cover"
              />
              <div className="pb-6 p-4">
                <div>
                  <h2 className="text-[18px] font-semibold mt-[3px]">Title:</h2>
                  <input
                    className="block w-full  p-2 border"
                    value={blog.title}
                    onChange={(e) =>
                      setData({
                        ...data!,
                        blogs: data!.blogs.map((b, index) =>
                          index === i ? { ...b, title: e.target.value } : b
                        ),
                      })
                    }
                  />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold ">Subtitle:</h2>
                  <input
                    className="block w-full p-2 border"
                    value={blog.subtitle}
                    onChange={(e) =>
                      setData({
                        ...data!,
                        blogs: data!.blogs.map((b, index) =>
                          index === i ? { ...b, subtitle: e.target.value } : b
                        ),
                      })
                    }
                  />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold ">Service:</h2>
                  <input
                    className="block w-full p-2 border"
                    value={blog.service}
                    onChange={(e) =>
                      setData({
                        ...data!,
                        blogs: data!.blogs.map((b, index) =>
                          index === i ? { ...b, service: e.target.value } : b
                        ),
                      })
                    }
                  />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold ">Date:</h2>
                  <input
                    className="block w-full p-2 border"
                    value={blog.date}
                    onChange={(e) =>
                      setData({
                        ...data!,
                        blogs: data!.blogs.map((b, index) =>
                          index === i ? { ...b, date: e.target.value } : b
                        ),
                      })
                    }
                  />
                </div>
                <input
                  type="file"
                  onChange={(e) =>
                    handleDynamicImageUpload(e, `blogs[${i}].image`)
                  }
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-[10px]"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditBlogPage;
