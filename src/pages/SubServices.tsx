"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface SubServiceData {
  title: string;
  section2: { title: string; des: string };
  section3: { title: string; data: { title: string; description: string }[] };
  section4: { title: string; des: string };
  section5: { title: string; steps: { step: number; title: string; description: string; margin: string }[] };
  section6: { title: string; des: string; des2: string };
  section7: { quote: string; author: string };
  section8: { title: string; data: { title: string; description: string }[] };
  section9: { title: string; para: string; industries: string[] };
  faq: { title: string; faqs: { item: string; ques: string; ans: string }[] };
  contact: { title: string; subTitle: string };
}

const SubServices: React.FC = () => {

  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [data, setData] = useState<SubServiceData | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("enterprise-software-solutions");
  const [slugs, setSlugs] = useState<string[]>(["enterprise-software-solutions"]);

  // Fetch available slugs
  useEffect(() => {
    const fetchSlugs = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(`${baseURL}/getslug`);
        const filteredSlugs = res.data.filter((slug: string) => slug !== "");
        setSlugs(filteredSlugs);
        // Set initial slug if default not in list
        if (filteredSlugs.length > 0 && !filteredSlugs.includes(selectedSlug)) {
          setSelectedSlug(filteredSlugs[0]);
        }
      } catch (error) {
        console.error("Error fetching slugs:", error);
        setError("Failed to fetch slugs.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSlugs();
  }, []);

  // Fetch subservice data based on selected slug
  const fetchSubServiceData = async (slug: string) => {
    setIsFetching(true);
    try {
      const res = await axios.post(`${baseURL}/getbyslug`, { slug });
      const fullData = res.data; // Full row
      setId(fullData.id);
      setService(fullData.service);
      setData(fullData.json); // Only the parsed JSON
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (selectedSlug) fetchSubServiceData(selectedSlug);
  }, [selectedSlug]);

  // Handle saving changes to the backend
  const handleSave = async () => {
    if (!id || !service || !data) {
      alert("Missing required data for save.");
      return;
    }
    setIsSaving(true);
    try {
      await axios.put(`${baseURL}/updatesubservice`, {
        id,
        slug: selectedSlug,
        service,
        json: data,
      });
      alert("Data updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle changes to nested data
  const handleChange = (path: string, value: any) => {
    if (!data) return;
    const keys = path.split(".");
    const newData = { ...data } as any;
    let temp = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!temp[keys[i]]) return;
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    setData(newData);
  };


  // Helper to reindex steps (for section5)
  const reindexSteps = (steps: any[]) => {
    return steps.map((step, index) => ({ ...step, step: index + 1 }));
  };

  // Helper to reindex FAQ items (for faq.faqs)
  const reindexFaqs = (faqs: any[]) => {
    return faqs.map((faq, index) => ({ ...faq, item: `item-${index + 1}` }));
  };

  if (error) return <div>{error}</div>;

  return (
    <div
      className={`${
        toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
      } duration-500 font-semibold ml-auto py-[20px] px-[10px] md:px-[30px] mt-[40px] p-6 space-y-6 relative`}
    >
      {(isFetching || isSaving) && <Loader />}

      {/* Select Subservice */}
      <div className="relative">
        <h1 className="text-[32px] font-semibold mt-[20px]">
          Edit SubService Page
        </h1>
        <select
          className="bg-[#18185E] text-white text-center py-[10px] border p-2 rounded relative md:fixed md:top-[70px] md:right-[20px] focus:outline-0 cursor-pointer"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
        >
          {slugs.map((slug) => (
            <option key={slug} value={slug}>
              {slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {data && (
        <div className="space-y-[40px]">
          {/* Main Title */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Main Title</h2>
            <input
              className="w-full p-2 border rounded"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Main Title"
            />
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 2 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 2</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section2.title}
              onChange={(e) => handleChange("section2.title", e.target.value)}
              placeholder="Section 2 Title"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Description:
            </h3>
            <textarea
              className="w-full p-2 border rounded"
              value={data.section2.des}
              onChange={(e) => handleChange("section2.des", e.target.value)}
              placeholder="Section 2 Description"
            />
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 3 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 3</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section3.title}
              onChange={(e) => handleChange("section3.title", e.target.value)}
              placeholder="Section 3 Title"
            />
            {data.section3.data.map((item, i) => (
              <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                <h3 className="font-semibold text-[18px]">Item {i + 1}:</h3>
                <input
                  className="w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...data.section3.data];
                    items[i].title = e.target.value;
                    handleChange("section3.data", items);
                  }}
                  placeholder="Item Title"
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...data.section3.data];
                    items[i].description = e.target.value;
                    handleChange("section3.data", items);
                  }}
                  placeholder="Item Description"
                />
                <button
                  className="bg-[#18185E] text-white px-3 py-1 rounded"
                  onClick={() => {
                    const newItems = data.section3.data.filter(
                      (_, index) => index !== i
                    );
                    handleChange("section3.data", newItems);
                  }}
                >
                  Remove Item
                </button>
              </div>
            ))}
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
              onClick={() => {
                const newItem = { title: "", description: "" };
                const newItems = [...data.section3.data, newItem];
                handleChange("section3.data", newItems);
              }}
            >
              Add Item
            </button>
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 4 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 4</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section4.title}
              onChange={(e) => handleChange("section4.title", e.target.value)}
              placeholder="Section 4 Title"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Description:
            </h3>
            <textarea
              className="w-full p-2 border rounded"
              value={data.section4.des}
              onChange={(e) => handleChange("section4.des", e.target.value)}
              placeholder="Section 4 Description"
            />
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 5 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 5</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section5.title}
              onChange={(e) => handleChange("section5.title", e.target.value)}
              placeholder="Section 5 Title"
            />
            {data.section5.steps.map((step, i) => (
              <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                <h3 className="font-semibold text-[18px]">Step {i + 1}:</h3>
                <input
                  className="w-full p-2 border rounded"
                  value={step.title}
                  onChange={(e) => {
                    const steps = [...data.section5.steps];
                    steps[i].title = e.target.value;
                    handleChange("section5.steps", reindexSteps(steps));
                  }}
                  placeholder="Step Title"
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={step.description}
                  onChange={(e) => {
                    const steps = [...data.section5.steps];
                    steps[i].description = e.target.value;
                    handleChange("section5.steps", reindexSteps(steps));
                  }}
                  placeholder="Step Description"
                />
                <input
                  className="w-full p-2 border rounded"
                  value={step.margin}
                  onChange={(e) => {
                    const steps = [...data.section5.steps];
                    steps[i].margin = e.target.value;
                    handleChange("section5.steps", reindexSteps(steps));
                  }}
                  placeholder="Step Margin (e.g., 0px)"
                />
                <button
                  className="bg-[#18185E] text-white px-3 py-1 rounded"
                  onClick={() => {
                    const newSteps = data.section5.steps.filter(
                      (_, index) => index !== i
                    );
                    handleChange("section5.steps", reindexSteps(newSteps));
                  }}
                >
                  Remove Step
                </button>
              </div>
            ))}
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
              onClick={() => {
                const newStep = {
                  step: data.section5.steps.length + 1,
                  title: "",
                  description: "",
                  margin: `${data.section5.steps.length * 100}px`,
                };
                const newSteps = [...data.section5.steps, newStep];
                handleChange("section5.steps", reindexSteps(newSteps));
              }}
            >
              Add Step
            </button>
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 6 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 6</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section6.title}
              onChange={(e) => handleChange("section6.title", e.target.value)}
              placeholder="Section 6 Title"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Description 1:
            </h3>
            <textarea
              className="w-full p-2 border rounded"
              value={data.section6.des}
              onChange={(e) => handleChange("section6.des", e.target.value)}
              placeholder="Section 6 Description 1"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Description 2:
            </h3>
            <textarea
              className="w-full p-2 border rounded"
              value={data.section6.des2}
              onChange={(e) => handleChange("section6.des2", e.target.value)}
              placeholder="Section 6 Description 2"
            />
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 7 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 7</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Quote:</h3>
            <textarea
              className="w-full p-2 border rounded"
              value={data.section7.quote}
              onChange={(e) => handleChange("section7.quote", e.target.value)}
              placeholder="Quote"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Author:
            </h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section7.author}
              onChange={(e) => handleChange("section7.author", e.target.value)}
              placeholder="Quote Author"
            />
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 8 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 8</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section8.title}
              onChange={(e) => handleChange("section8.title", e.target.value)}
              placeholder="Section 8 Title"
            />
            {data.section8.data.map((item, i) => (
              <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                <h3 className="font-semibold text-[18px]">Item {i + 1}:</h3>
                <input
                  className="w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...data.section8.data];
                    items[i].title = e.target.value;
                    handleChange("section8.data", items);
                  }}
                  placeholder="Item Title"
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...data.section8.data];
                    items[i].description = e.target.value;
                    handleChange("section8.data", items);
                  }}
                  placeholder="Item Description"
                />
                <button
                  className="bg-[#18185E] text-white px-3 py-1 rounded"
                  onClick={() => {
                    const newItems = data.section8.data.filter(
                      (_, index) => index !== i
                    );
                    handleChange("section8.data", newItems);
                  }}
                >
                  Remove Item
                </button>
              </div>
            ))}
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
              onClick={() => {
                const newItem = { title: "", description: "" };
                const newItems = [...data.section8.data, newItem];
                handleChange("section8.data", newItems);
              }}
            >
              Add Item
            </button>
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Section 9 */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Section 9</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.section9.title}
              onChange={(e) => handleChange("section9.title", e.target.value)}
              placeholder="Section 9 Title"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Paragraph:
            </h3>
            <textarea
              className="w-full p-2 border rounded"
              value={data.section9.para}
              onChange={(e) => handleChange("section9.para", e.target.value)}
              placeholder="Section 9 Paragraph"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Industries:
            </h3>
            {data.section9.industries.map((industry, i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <input
                  className="flex-1 p-2 border rounded"
                  value={industry}
                  onChange={(e) => {
                    const industries = [...data.section9.industries];
                    industries[i] = e.target.value;
                    handleChange("section9.industries", industries);
                  }}
                  placeholder={`Industry ${i + 1}`}
                />
                <button
                  className="bg-[#18185E] text-white px-2 py-1 rounded"
                  onClick={() => {
                    const newIndustries = data.section9.industries.filter(
                      (_, index) => index !== i
                    );
                    handleChange("section9.industries", newIndustries);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
              onClick={() => {
                const newIndustries = [...data.section9.industries, ""];
                handleChange("section9.industries", newIndustries);
              }}
            >
              Add Industry
            </button>
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* FAQ Section */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">FAQ Section</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.faq.title}
              onChange={(e) => handleChange("faq.title", e.target.value)}
              placeholder="FAQ Title"
            />
            {data.faq.faqs.map((faq, i) => (
              <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                <h3 className="font-semibold text-[18px]">FAQ {i + 1}:</h3>
                <input
                  className="w-full p-2 border rounded"
                  value={faq.item}
                  onChange={(e) => {
                    const faqs = [...data.faq.faqs];
                    faqs[i].item = e.target.value;
                    handleChange("faq.faqs", reindexFaqs(faqs));
                  }}
                  placeholder="FAQ Item ID"
                />
                <input
                  className="w-full p-2 border rounded"
                  value={faq.ques}
                  onChange={(e) => {
                    const faqs = [...data.faq.faqs];
                    faqs[i].ques = e.target.value;
                    handleChange("faq.faqs", reindexFaqs(faqs));
                  }}
                  placeholder="FAQ Question"
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={faq.ans}
                  onChange={(e) => {
                    const faqs = [...data.faq.faqs];
                    faqs[i].ans = e.target.value;
                    handleChange("faq.faqs", reindexFaqs(faqs));
                  }}
                  placeholder="FAQ Answer"
                />
                <button
                  className="bg-[#18185E] text-white px-3 py-1 rounded"
                  onClick={() => {
                    const newFaqs = data.faq.faqs.filter(
                      (_, index) => index !== i
                    );
                    handleChange("faq.faqs", reindexFaqs(newFaqs));
                  }}
                >
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
              onClick={() => {
                const newFaq = { item: `item-${data.faq.faqs.length + 1}`, ques: "", ans: "" };
                const newFaqs = [...data.faq.faqs, newFaq];
                handleChange("faq.faqs", reindexFaqs(newFaqs));
              }}
            >
              Add FAQ
            </button>
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

          {/* Contact Section */}
          <div className="border p-2 rounded-[10px] shadow-xl">
            <h2 className="text-[25px] font-semibold my-[10px]">Contact Section</h2>
            <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
            <input
              className="w-full p-2 border rounded"
              value={data.contact.title}
              onChange={(e) => handleChange("contact.title", e.target.value)}
              placeholder="Contact Title"
            />
            <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">
              Subtitle:
            </h3>
            <input
              className="w-full p-2 border rounded"
              value={data.contact.subTitle}
              onChange={(e) => handleChange("contact.subTitle", e.target.value)}
              placeholder="Contact Subtitle"
            />
            <button
              className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubServices;