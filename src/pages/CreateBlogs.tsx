import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";
import  ReactQuill,{ Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageUploader from "quill-image-uploader";
Quill.register("modules/imageUploader", ImageUploader);





const BlogEditor = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlName, setUrlName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');



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



  type Faq = { question: string; answer: string };
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const addFaq = () => setFaqs(prev => [...prev, { question: "", answer: "" }]);
  const updateFaq = (idx: number, key: keyof Faq, value: string) => {
    setFaqs(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };
  const removeFaq = (idx: number) => setFaqs(prev => prev.filter((_, i) => i !== idx));




  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };



  // ✅ Save blog
  const handleSave = async () => {
    if (!title || !description || !urlName) {
      alert("Please fill in all fields and add at least one content block.");
      return;
    }
    setIsLoading(true);

    const cleanedFaqs = faqs.filter(f => f.question.trim() || f.answer.trim());

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urlName", urlName);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("faqs", JSON.stringify(cleanedFaqs));
    formData.append("content", content);

    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch(`${baseURL}/blogs`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setIsLoading(false);
      if (response.ok) {
        alert("✅ Blog created successfully!");
        setTitle(""); setDescription(""); setUrlName("");
        setImageFile(null); setImagePreview("");
        setMetaTitle(""); setMetaDescription("");
        setFaqs([]);; // reset
        navigate("/blog");
      } else {
        alert("❌ Blog creation failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      setIsLoading(false);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={`${toggle === false
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

      {/* FAQs */}
      <div className="!my-8">
        <h2 className="text-[18px] font-semibold">FAQs</h2>
        {faqs.length === 0 && <p className="text-sm text-gray-500 mt-1">No FAQs yet. Add your first one.</p>}
        <div className="space-y-3 mt-2">
          {faqs.map((f, i) => (
            <div key={i} className="border rounded p-3 space-y-2">
              <input type="text" placeholder="Question" className="border w-full p-2 rounded"
                value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
              <textarea placeholder="Answer" className="border w-full p-2 rounded"
                value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} />
              <button type="button" onClick={() => removeFaq(i)} className="text-red-600 text-sm">Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addFaq} className="bg-gray-100 border px-3 py-1 rounded mt-2">
          + Add FAQ
        </button>
      </div>


      <ReactQuill
        className="relative z-50 "
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />


      <button onClick={handleSave} className="bg text-white px-4 py-2 rounded mt-[10px] relative top-[20px]">
        Submit Blog
      </button>

    </div>
  );
};

export default BlogEditor;
