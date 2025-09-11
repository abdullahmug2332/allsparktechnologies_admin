import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

function swap<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const temp = copy[from];
  copy[from] = copy[to];
  copy[to] = temp;
  return copy;
}

const ReorderButtons = ({ index, items, setItems }: any) => (

  <div className="flex gap-2 mt-2">
    {index > 0 && (
      <button
        type="button"
        className="bg-gray-200 text-sm px-2 py-1 rounded"
        onClick={() => setItems(swap(items, index, index - 1))}
      >
        ↑ Move Up
      </button>
    )}
    {index < items.length - 1 && (
      <button
        type="button"
        className="bg-gray-200 text-sm px-2 py-1 rounded"
        onClick={() => setItems(swap(items, index, index + 1))}
      >
        ↓ Move Down
      </button>
    )}
  </div>
);


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
  const [items, setItems] = useState<any[]>([]);

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

        // items ✅
        try {
          const parsedItems = Array.isArray(data.items)
            ? data.items
            : JSON.parse(data.items || "[]");
          setItems(parsedItems);
        } catch {
          setItems([]);
        }

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
  // --- IMAGE HELPERS FOR ITEMS (single/double/triple) ---

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${baseURL}/blogs/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data.filename || null;
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  // Single Image item change
  const handleSingleImageItemChange = async (file: File, idx: number) => {
    // 1) show local preview
    const previewUrl = URL.createObjectURL(file);
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...(copy[idx] || {}), type: "singleimage", value: previewUrl };
      return copy;
    });

    // 2) upload -> replace with server filename
    const filename = await uploadImage(file);
    if (filename) {
      setItems((prev) => {
        const copy = [...prev];
        copy[idx] = { ...(copy[idx] || {}), type: "singleimage", value: filename };
        return copy;
      });
    }
  };

  // Multiple Images (double/triple)
  const handleMultipleImagesItemChange = async (files: FileList, idx: number, maxCount: number) => {
    const selected = Array.from(files).slice(0, maxCount);

    // 1) show local previews
    const previews = selected.map((f) => URL.createObjectURL(f));
    setItems((prev) => {
      const copy = [...prev];
      const type = maxCount === 2 ? "doubleimage" : "tripleimage";
      copy[idx] = { ...(copy[idx] || {}), type, value: previews };
      return copy;
    });

    // 2) upload -> replace with server filenames
    const filenames: string[] = [];
    for (const f of selected) {
      const name = await uploadImage(f);
      if (name) filenames.push(name);
    }
    setItems((prev) => {
      const copy = [...prev];
      const type = maxCount === 2 ? "doubleimage" : "tripleimage";
      copy[idx] = { ...(copy[idx] || {}), type, value: filenames };
      return copy;
    });
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
    formData.append("items", JSON.stringify(items));

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

      {/* ITEMS EDITOR ✅ */}
      <div className="!mt-[100px]">
        <h2 className="text-[18px] font-semibold">Items (Headings, Lists, Tables):</h2>

        {items.map((item, index) => (
          <div key={index} className="border-2  border-[#18185E] p-3 my-2 rounded space-y-2">
            <select
              value={item.type}
              onChange={(e) => {
                const updated = [...items];
                const newType = e.target.value;
                const currentValue = updated[index].value; // Store current value

                updated[index].type = newType;

                // Preserve value for text-based types
                if (["h1", "h2", "h3", "p", "strong"].includes(newType)) {
                  updated[index].value = currentValue || ""; // Keep existing value or set to empty string
                } else if (["ul", "ol"].includes(newType)) {
                  updated[index].value = Array.isArray(currentValue) ? currentValue : [""]; 
                } else if (newType === "table") {
                  updated[index].headers = ["Header 1", "Header 2"];
                  updated[index].rows = [["Cell 1", "Cell 2"]];
                } else if (newType === "singleimage") {
                  updated[index] = { type: "singleimage", value: "" };
                } else if (newType === "doubleimage") {
                  updated[index] = { type: "doubleimage", value: ["", ""] };
                } else if (newType === "tripleimage") {
                  updated[index] = { type: "tripleimage", value: ["", "", ""] };
                }

                setItems(updated);
              }}
              className="border p-2 rounded w-full"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="p">Paragraph</option>
              <option value="strong">Bold Text</option>
              <option value="ul">Unordered List</option>
              <option value="ol">Ordered List</option>
              <option value="table">Table</option>
              <option value="singleimage">Single Image</option>
              <option value="doubleimage">Double Image</option>
              <option value="tripleimage">Triple Image</option>
            </select>


            {/* Text-based */}
            {["h1", "h2", "h3", "strong"].includes(item.type) && (
              <div>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].value = e.target.value;
                    setItems(updated);
                  }}
                  className="border p-2 rounded w-full"
                />
                <ReorderButtons index={index} items={items} setItems={setItems} />
              </div>


            )}
            {/* paragraph*/}
            {["p"].includes(item.type) && (
              <div>
                <textarea
                  value={item.value}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].value = e.target.value;
                    setItems(updated);
                  }}
                  className="border p-2 rounded w-full"
                ></textarea>
                <ReorderButtons index={index} items={items} setItems={setItems} />
              </div>


            )}

            {/* List-based */}
            {(item.type === "ul" || item.type === "ol") && (
              <div>
                {item.value.map((li: string, liIndex: number) => (
                  <div key={liIndex} className="flex gap-2 my-1">
                    <input
                      type="text"
                      value={li}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[index].value[liIndex] = e.target.value;
                        setItems(updated);
                      }}
                      className="border p-2 rounded w-full"
                    />
                    <button
                      onClick={() => {
                        const updated = [...items];
                        updated[index].value = updated[index].value.filter(
                          (_: string, i: number) => i !== liIndex
                        );
                        setItems(updated);
                      }}
                      className="bg-[#18185E] text-white px-2 rounded"
                    >
                      ✕
                    </button>

                  </div>
                ))}
                <button
                  onClick={() => {
                    const updated = [...items];
                    updated[index].value.push("");
                    setItems(updated);
                  }}
                  className="bg-[#18185E] text-white px-2 py-1 rounded mt-1"
                >
                  + Add List Item
                </button>
                <ReorderButtons index={index} items={items} setItems={setItems} />

              </div>
            )}

            {/* Table-based */}
            {item.type === "table" && (
              <div>
                <p className="font-semibold">Headers:</p>
                <div className="flex gap-2 flex-wrap">
                  {item.headers.map((header: string, hIndex: number) => (
                    <div key={hIndex} className="flex gap-1 items-center">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[index].headers[hIndex] = e.target.value;
                          setItems(updated);
                        }}
                        className="border p-1 rounded"
                      />
                      <button
                        onClick={() => {
                          const updated = [...items];
                          updated[index].headers = updated[index].headers.filter(
                            (_: string, i: number) => i !== hIndex
                          );
                          updated[index].rows = updated[index].rows.map((r: string[]) =>
                            r.filter((_, i) => i !== hIndex)
                          );
                          setItems(updated);
                        }}
                        className="bg-[#18185E] text-white px-2 py-[5px] rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...items];
                      updated[index].headers.push(`Header ${item.headers.length + 1}`);
                      updated[index].rows = updated[index].rows.map((r: string[]) => [
                        ...r,
                        `Cell ${r.length + 1}`,
                      ]);
                      setItems(updated);
                    }}
                    className="bg-[#18185E] text-white px-2 py-[5px] rounded"
                  >
                    + Add Column
                  </button>
                </div>

                <p className="font-semibold mt-3">Rows:</p>
                {item.rows.map((row: string[], rIndex: number) => (
                  <div key={rIndex} className="flex gap-2 my-1 items-center">
                    {row.map((cell: string, cIndex: number) => (
                      <input
                        key={cIndex}
                        type="text"
                        value={cell}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[index].rows[rIndex][cIndex] = e.target.value;
                          setItems(updated);
                        }}
                        className="border p-1 rounded"
                      />
                    ))}
                    <button
                      onClick={() => {
                        const updated = [...items];
                        updated[index].rows = updated[index].rows.filter(
                          (_: string[], i: number) => i !== rIndex
                        );
                        setItems(updated);
                      }}
                      className="bg-[#18185E] text-white px-2 rounded"
                    >
                      ✕ Row
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updated = [...items];
                    updated[index].rows.push(
                      Array(item.headers.length).fill("").map((_, i) => `Cell ${i + 1}`)
                    );
                    setItems(updated);
                  }}
                  className="bg-[#18185E] text-white px-2 py-1 rounded mt-2"
                >
                  + Add Row
                </button>
                <ReorderButtons index={index} items={items} setItems={setItems} />

              </div>
            )}

            {/* --- SINGLE IMAGE --- */}
            {item.type === "singleimage" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSingleImageItemChange(file, index);
                  }}
                />

                {item.value && (
                  <img
                    src={
                      String(item.value).startsWith("blob:")
                        ? item.value
                        : `${baseURL}/images/blogs/${item.value}`
                    }
                    alt="single"
                    className="w-40 h-40 object-cover mt-2 rounded"
                  />
                )}

                {item.value && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...items];
                      updated[index].value = "";
                      setItems(updated);
                    }}
                    className="bg-[#18185E] text-white px-3 py-1 rounded mt-2"
                  >
                    ✕ Remove Image
                  </button>
                )}
                <ReorderButtons index={index} items={items} setItems={setItems} />

              </div>
            )}

            {/* --- DOUBLE IMAGE --- */}
            {item.type === "doubleimage" && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Select up to 2 images</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) handleMultipleImagesItemChange(files, index, 2);
                  }}
                />

                <div className="flex gap-2 mt-2 flex-wrap">
                  {Array.isArray(item.value) &&
                    item.value.map((img: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img
                          src={img.startsWith("blob:") ? img : `${baseURL}/images/blogs/${img}`}
                          alt={`double-${idx}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...items];
                            const arr = Array.isArray(updated[index].value) ? [...updated[index].value] : [];
                            updated[index].value = arr.filter((_: string, i: number) => i !== idx);
                            setItems(updated);
                          }}
                          className="absolute top-1 right-1 bg-[#18185E] text-white px-2 py-[2px] rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
                <ReorderButtons index={index} items={items} setItems={setItems} />

              </div>
            )}

            {/* --- TRIPLE IMAGE --- */}
            {item.type === "tripleimage" && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Select up to 3 images</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) handleMultipleImagesItemChange(files, index, 3);
                  }}
                />

                <div className="flex gap-2 mt-2 flex-wrap">
                  {Array.isArray(item.value) &&
                    item.value.map((img: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img
                          src={img.startsWith("blob:") ? img : `${baseURL}/images/blogs/${img}`}
                          alt={`triple-${idx}`}
                          className="w-28 h-28 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...items];
                            const arr = Array.isArray(updated[index].value) ? [...updated[index].value] : [];
                            updated[index].value = arr.filter((_: string, i: number) => i !== idx);
                            setItems(updated);
                          }}
                          className="absolute top-1 right-1 bg-[#18185E] text-white px-2 py-[2px] rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
                <ReorderButtons index={index} items={items} setItems={setItems} />

              </div>
            )}



            <button
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="bg-[#18185E] text-white px-3 py-1 rounded mt-2"
            >
              ✕ Remove Item
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setItems([...items, { type: "p", value: "" }]) // default new item
          }
          className="bg text-white px-3 py-1 rounded mt-3"
        >
          + Add Item
        </button>
      </div>

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
