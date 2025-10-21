import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageUploader from "quill-image-uploader";
Quill.register("modules/imageUploader", ImageUploader);




const EditBlogEditor = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [isLoading, setIsLoading] = useState(true);
  const { urlName } = useParams();

  const [blogId, setBlogId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [content, setContent] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");


  // Fetch the blog by slug/urlName
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseURL}/blogs/${urlName}`);
        if (!res.ok) throw new Error("Failed to fetch blog");

        const data = await res.json();
        setBlogId(data.id || null);
        setSlug(data.urlName || "");
        setTitle(data.title || "");
        setDescription(data.description || "");
        setMetaTitle(data.metatitle || "");
        setMetaDescription(data.metadescription || "");
        setFaqs(Array.isArray(data.faqs) ? data.faqs : JSON.parse(data.faqs || "[]"));
        setImagePreview(data.image ? `${baseURL}/images/blogs/${data.image}` : "");
        setContent(data.content)

      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (urlName) fetchBlog();
  }, [urlName]);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!title || !description || !urlName) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);

    // Clean contents

    const formData = new FormData();
    formData.append("id", String(blogId));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urlName", slug);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("faqs", JSON.stringify(faqs));
    formData.append("content", content);

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
        alert("✅ Blog updated successfully!");
      } else {
        alert("❌ Update failed: " + result.error);
      }
    } catch (err) {
      alert("❌ Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    imageUploader: {
      upload: async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${baseURL}/blogs/upload-image`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        return `${baseURL}/images/blogs/${data.filename}`;
      },
    },
  }), []); // 👈 keeps it stable between renders
  const formats = useMemo(() => [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "video",
    "color",
    "background",
  ], []);

  return (
    <div
      className={`${toggle === false
        ? "w-full"
        : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
        } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] space-y-1`}
    >
      <h1 className="color text-[32px] font-semibold my-[20px]">Edit Blog</h1>
      {isLoading && <Loader />}

      {/* Image */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="blogimg"
          className="h-[330px] object-cover rounded-md"
        />
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Title  */}
      <div className="!mt-[20px]">
        <h2 className="text-[18px] font-semibold">Title:</h2>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description  */}
      <div className="!mt-[20px]">
        <h2 className="text-[18px] font-semibold mt-[10px]">Description:</h2>
        <textarea
          className="border w-full p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Slug  */}
      <div className="!mt-[20px]">
        <h2 className="text-[18px] font-semibold mt-[10px]">Slug:</h2>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      {/* MetaTitle  */}
      <div className="!mt-[20px]">
        <h2 className="text-[18px] font-semibold mt-[10px]">Meta Title:</h2>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />
      </div>

      {/* MetaDescription  */}
      <div className="!mt-[20px]">
        <h2 className="text-[18px] font-semibold mt-[10px]">Meta Description:</h2>
        <textarea
          className="border w-full p-2 rounded"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </div>

      {/* FAQs */}
      <div className="!mt-[40px] border p-[10px]">
        <h2 className="text-[18px] font-semibold">FAQs:</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="flex flex-col border p-[10px] items-start gap-2 mb-2">
            <input
              type="text"
              placeholder="Question"
              value={faq.question}
              onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[index].question = e.target.value;
                setFaqs(newFaqs);
              }}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[index].answer = e.target.value;
                setFaqs(newFaqs);
              }}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
              className="bg text-white px-4 h-[40px] rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
          className="bg text-white px-3 py-1 rounded"
        >
          + Add FAQ
        </button>
      </div>

      <button
        onClick={handleUpdate}
        className="bg text-white px-4 py-2 rounded !my-[5px]"
      >
        Update Blog
      </button>

      <ReactQuill
       
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />


      {/* Update button */}
      <button
        onClick={handleUpdate}
        className="bg text-white px-4 py-2 rounded mt-[20px]"
      >
        Update Blog
      </button>
    </div>
  );
};

export default EditBlogEditor;
