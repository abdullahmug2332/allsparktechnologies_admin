import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
  "align",
];

const createModules = (imageHandler: () => void) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      [{ align: [] }],
      ["clean"],
    ],
    handlers: {
      image: imageHandler,
    },
  },
});

const EditBlogEditor = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [isLoading, setIsLoading] = useState(true);
  const { urlName } = useParams();
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");

  const [blogId, setBlogId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const quillRef = useRef<any>(null);

  // Fetch the blog by slug/urlName
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseURL}/blogs/${urlName}`);
        const data = await res.json();
        setSlug(data.urlName);
        setBlogId(data.id);
        setTitle(data.title);
        setDescription(data.description);
        setContent(data.content);
        setMetaTitle(data.metatitle);
        setMetaDescription(data.metadescription);
        setImagePreview(`${baseURL}/images/blogs/${data.image}`);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    if (urlName) fetchBlog();
  }, [urlName]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await fetch(`${baseURL}/blogs/upload-image`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          quill?.insertEmbed(
            range?.index || 0,
            "image",
            `${baseURL}/images/blogs/${data.filename}`
          );
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }
    };
  };

  const modules = useMemo(() => createModules(imageHandler), []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUpdate = async () => {
    if (!title || !description || !urlName || !content) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", String(blogId));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urlName", slug);
    formData.append("content", content);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", imagePreview.split("/").pop() || "");
    }

    try {
      const res = await fetch(`${baseURL}/blog/${blogId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Update Blog successfully !");
      } else {
        alert("❌ Update failed: " + result.error);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      alert("❌ Something went wrong.");
    }
  };

  return (
    <div
      className={`${
        toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
      } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] space-y-1`}
    >
      <h1 className="color text-[32px] font-semibold my-[20px]">Edit Blog</h1>
      {isLoading && <Loader />}

      {imagePreview && (
        <img
          src={imagePreview}
          alt="blogimg"
          className="h-[330px] object-cover rounded-md"
        />
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <div className="mt-4">
        <h2 className="text-[18px] font-semibold">Title:</h2>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-[18px] font-semibold mt-[10px]">Description:</h2>
        <textarea
          className="border w-full p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-[18px] font-semibold mt-[10px]">Slug:</h2>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <div>
        <h2 className="text-[18px] font-semibold mt-[10px]">Meta Title:</h2>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-[18px] font-semibold mt-[10px]">
          Meta Description:
        </h2>
        <textarea
          className="border w-full p-2 rounded"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </div>

      <div className="mb-[40px]">
        <h2 className="text-[18px] font-semibold mt-[10px]">Content:</h2>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          theme="snow"
          style={{ height: "400px", marginTop: "10px" }}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="bg text-white px-4 py-2 rounded mt-[10px] relative top-[70px]"
      >
        Update Blog
      </button>
    </div>
  );
};

export default EditBlogEditor;
