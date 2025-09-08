import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";


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
  const [items, setItems] = useState<any[]>([]);

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

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${baseURL}/blogs/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data.filename; // save this in `items`
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  // Single Image
  const handleSingleImageChange = async (file: File, idx: number) => {
    const filename = await uploadImage(file);
    if (filename) {
      const copy = [...items];
      (copy[idx] as any).value = filename;
      setItems(copy);
    }
  };

  // Multiple Images (double/triple)
  const handleMultipleImagesChange = async (files: FileList, idx: number) => {
    const filenames: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const name = await uploadImage(files[i]);
      if (name) filenames.push(name);
    }
    const copy = [...items];
    (copy[idx] as any).value = filenames;
    setItems(copy);
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
    formData.append("items", JSON.stringify(items));

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
  function swap<T>(arr: T[], from: number, to: number): T[] {
    const copy = [...arr];
    const temp = copy[from];
    copy[from] = copy[to];
    copy[to] = temp;
    return copy;
  }
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

      <div>
        {/* Existing Items */}
        {items.map((item, i) => (
          <div key={i} className="border-2 border-[#18185E] p-3 rounded mb-3">
            {/* H1-H3-P-Strong */}
            {["h1", "h2", "h3", "strong"].includes(item.type) && (
              <div>
                <p>{item.type.toUpperCase()}</p>
                <input
                  type="text"
                  placeholder={`Enter ${item.type.toUpperCase()} text`}
                  value={item?.value}
                  onChange={(e) => {
                    const copy = [...items];
                    (copy[i] as any).value = e.target.value;
                    setItems(copy);
                  }}
                  className="border w-full p-2 rounded"
                />
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* paragraphs  */}
            {["p"].includes(item.type) && (
              <div>
                <p>{item.type.toUpperCase()}</p>
                <textarea placeholder={`Enter ${item.type.toUpperCase()} text`}
                  value={item?.value}
                  onChange={(e) => {
                    const copy = [...items];
                    (copy[i] as any).value = e.target.value;
                    setItems(copy);
                  }}
                  className="border w-full p-2 rounded"></textarea>
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* UL / OL */}
            {["ul", "ol"].includes(item.type) && (
              <div>
                <p>{item.type.toUpperCase()}</p>
                {(item?.value as string[]).map((li, liIdx) => (
                  <input
                    key={liIdx}
                    type="text"
                    placeholder={`List item ${liIdx + 1}`}
                    value={li}
                    onChange={(e) => {
                      const copy = [...items];
                      (copy[i] as any).value[liIdx] = e.target.value;
                      setItems(copy);
                    }}
                    className="border w-full p-2 rounded mt-1"
                  />
                ))}
                <button
                  type="button"
                  className="bg-gray-100 px-2 py-1 rounded mt-2"
                  onClick={() => {
                    const copy = [...items];
                    (copy[i] as any).value.push("");
                    setItems(copy);
                  }}
                >
                  + Add List Item
                </button>
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TABLE */}
            {item.type === "table" && (
              <div>
                <h3 className="font-semibold">Table Headers</h3>
                {(item.headers as string[]).map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      placeholder={`Header ${hIdx + 1}`}
                      value={h}
                      onChange={(e) => {
                        const copy = [...items];
                        (copy[i] as any).headers[hIdx] = e.target.value;
                        setItems(copy);
                      }}
                      className="border w-full p-2 rounded"
                    />
                    <button
                      type="button"
                      className="bg-red-100 px-2 py-1 rounded text-red-600"
                      onClick={() => {
                        const copy = [...items];
                        (copy[i] as any).headers.splice(hIdx, 1);
                        // also remove that column from all rows
                        (copy[i] as any).rows = (copy[i] as any).rows.map((row: string[]) =>
                          row.filter((_, idx) => idx !== hIdx)
                        );
                        setItems(copy);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-gray-100 px-2 py-1 rounded mt-2"
                  onClick={() => {
                    const copy = [...items];
                    (copy[i] as any).headers.push("");
                    // add empty col in each row as well
                    (copy[i] as any).rows = (copy[i] as any).rows.map((row: string[]) => [...row, ""]);
                    setItems(copy);
                  }}
                >
                  + Add Header
                </button>

                <h3 className="font-semibold mt-3">Table Rows</h3>
                {(item.rows as string[][]).map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-2 mt-1">
                    {row.map((cell, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          placeholder={`Row ${rIdx + 1} Col ${cIdx + 1}`}
                          value={cell}
                          onChange={(e) => {
                            const copy = [...items];
                            (copy[i] as any).rows[rIdx][cIdx] = e.target.value;
                            setItems(copy);
                          }}
                          className="border p-1 rounded w-full"
                        />
                        <button
                          type="button"
                          className="bg-red-100 px-2 rounded text-red-600"
                          onClick={() => {
                            const copy = [...items];
                            (copy[i] as any).rows[rIdx].splice(cIdx, 1);
                            setItems(copy);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-gray-100 px-2 rounded"
                      onClick={() => {
                        const copy = [...items];
                        (copy[i] as any).rows[rIdx].push("");
                        setItems(copy);
                      }}
                    >
                      + Col
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-gray-100 px-2 py-1 rounded mt-2"
                  onClick={() => {
                    const copy = [...items];
                    // create new row with same number of cols as headers
                    const newRow = Array((copy[i] as any).headers.length).fill("");
                    (copy[i] as any).rows.push(newRow);
                    setItems(copy);
                  }}
                >
                  + Add Row
                </button>
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>
              </div>
            )}


            {/* Single Image */}
            {item.type === "singleimage" && (
              <div>
                <p>{"Single Image"}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // show preview immediately
                      const previewUrl = URL.createObjectURL(file);
                      const copy = [...items];
                      (copy[i] as any).value = previewUrl;  // for preview
                      setItems(copy);

                      // upload to server
                      handleSingleImageChange(file, i);
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>
                {/* show preview if exists */}
                {(item.value as string) && (
                  <img
                    src={
                      item.value.startsWith("blob:")
                        ? item.value // local preview
                        : `${baseURL}/images/blogs/${item.value}` // saved image
                    }
                    alt="preview"
                    className="w-40 h-40 object-cover mt-2 rounded"
                  />
                )}
              </div>

            )}

            {/* Double Image */}
            {item.type === "doubleimage" && (
              <div>
                <p>{"Double Image"}</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const previews = Array.from(files).map((file) =>
                        URL.createObjectURL(file)
                      );
                      const copy = [...items];
                      (copy[i] as any).value = previews; // show previews
                      setItems(copy);

                      handleMultipleImagesChange(files, i); // upload
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  {(item.value as string[]).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith("blob:") ? img : `${baseURL}/images/blogs/${img}`}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Triple Image */}
            {item.type === "tripleimage" && (
              <div>
                <p>{"Triple Image"}</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const previews = Array.from(files).map((file) =>
                        URL.createObjectURL(file)
                      );
                      const copy = [...items];
                      (copy[i] as any).value = previews; // show previews
                      setItems(copy);

                      handleMultipleImagesChange(files, i); // upload
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  {/* Move Up */}
                  {i > 0 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i - 1))}
                    >
                      ↑ Move Up
                    </button>
                  )}

                  {/* Move Down */}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                      onClick={() => setItems(swap(items, i, i + 1))}
                    >
                      ↓ Move Down
                    </button>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {(item.value as string[]).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith("blob:") ? img : `${baseURL}/images/blogs/${img}`}
                      alt="preview"
                      className="w-28 h-28 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}


            {/* Remove Button */}
            <button
              type="button"
              className="text-red-600 text-sm mt-2"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            >
              Remove Block
            </button>
          </div>
        ))}

        {/* 🚀 Add New Block Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["h1", "h2", "h3", "p", "strong", "ul", "ol", "table"].map((type) => (
            <button
              key={type}
              type="button"
              className="bg  text-white px-3 py-1 rounded"
              onClick={() => {
                const newItem =
                  type === "ul" || type === "ol"
                    ? { type, value: [""] }
                    : type === "table"
                      ? { type, headers: [""], rows: [[""]] }
                      : { type, value: "" };
                setItems([...items, newItem]);
              }}
            >
              + {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* "singleimage", "doubleimage", "tripleimage"  */}
        {["singleimage", "doubleimage", "tripleimage"].map((type) => (
          <button
            key={type}
            type="button"
            className="bg text-white px-3 py-1 rounded mt-[20px] mr-[10px]"
            onClick={() => {
              const newItem =
                type === "singleimage" ? { type, value: "" } :
                  type === "doubleimage" ? { type, value: ["", ""] } :
                    { type, value: ["", "", ""] };
              setItems([...items, newItem]);
            }}
          >
            + {type.toUpperCase()}
          </button>
        ))}

      </div>



      <button onClick={handleSave} className="bg text-white px-4 py-2 rounded mt-[10px] relative top-[20px]">
        Submit Blog
      </button>

    </div>
  );
};

export default BlogEditor;
