import React, { useRef, useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

// Formats outside the component
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

// Toolbar modules creator
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

const BlogEditor = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlName, setUrlName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quillRef = useRef<any>(null);

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

  const handleSave = async () => {
    if (!title || !description || !urlName || !content) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urlName", urlName);
    formData.append("content", content);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch(`${baseURL}/blogs`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setIsLoading(false);
      alert("Blog created Successfully ! ");
      if (response.ok) {
        setTitle("");
        setDescription("");
        setUrlName("");
        setImageFile(null);
        setImagePreview("");
        setContent("");
        navigate("/blog");
      } else {
        alert("❌ Blog creation failed: " + result.error);
      }
    } catch (error) {
      setIsLoading(false);
      alert("❌ Something went wrong. Please try again.");
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
      {isLoading && <Loader />}
      <h1 className="color text-[32px] font-semibold my-[20px]">Create Blog</h1>

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
          value={urlName}
          onChange={(e) => setUrlName(e.target.value)}
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
        onClick={handleSave}
        className="bg text-white px-4 py-2 rounded mt-[10px] relative top-[70px]"
      >
        Submit Blog
      </button>
    </div>
  );
};

export default BlogEditor;
