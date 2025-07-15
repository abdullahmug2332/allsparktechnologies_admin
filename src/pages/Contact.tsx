import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: string;
}

interface ContactData {
  heroimg: string;
  title: string;
  description: string;
  methods: ContactMethod[];
  metadata?: any;
  script?: any;
}

const EditContactData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ContactData | null>(null);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [metadataText, setMetadataText] = useState("");
  const [scriptText, setScriptText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${baseURL}/contactdata`);
      setData(res.data);
      setMetadataText(JSON.stringify(res.data.metadata || {}, null, 2));
      setScriptText(JSON.stringify(res.data.script || {}, null, 2));
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const parsedMetadata = JSON.parse(metadataText);
      const parsedScript = JSON.parse(scriptText);
      const updatedData = {
        ...data,
        metadata: parsedMetadata,
        script: parsedScript,
      };
      await axios.put(`${baseURL}/contactdata`, updatedData);
      alert("Contact Page updated successfully!");

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert(
        "Error updating contact data. Make sure metadata and script are valid JSON."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // multer here
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${baseURL}/upload-contact-image`, formData);
      const imagePath = res.data.path;

      // Update state with new image path
      if (data) setData({ ...data, heroimg: imagePath });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  if (!data)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <>
      <div
        className={`${
          toggle === false
            ? "w-full"
            : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
        } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] p-6 space-y-6`}
      >
        {isLoading && <Loader />}

        <h1 className="color text-[32px] font-semibold my-[20px]">
          Contact Page
        </h1>

        {/* Hero Image */}
        <div className="flex gap-1 flex-col">
          <img
            src={`${baseURL}/images/contact/${data.heroimg}`}
            className="max-h-[300px] object-cover"
          />
          <input type="file" onChange={handleImageChange} />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-[18px] font-semibold mt-[10px]">Title:</h2>
          <input
            className="block w-full my-2 p-2 border"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <h2 className="text-[18px] font-semibold">Description:</h2>
          <textarea
            className="block w-full my-2 p-2 border"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
          <button
            className="bg text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

        {/* Contact Methods */}
        <div className="space-y-6">
          <h2 className="text-[25px] font-semibold">Contact Methods:</h2>
          {data.methods.map((method, i) => (
            <div key={i} className="space-y-2 my-4">
              <h3 className="font-medium">Method {i + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <input
                  className="block w-full p-2 border"
                  value={method.label}
                  placeholder="Label"
                  onChange={(e) => {
                    const newMethods = [...data.methods];
                    newMethods[i].label = e.target.value;
                    setData({ ...data, methods: newMethods });
                  }}
                />
                <input
                  className="block w-full p-2 border"
                  value={method.value}
                  placeholder="Value"
                  onChange={(e) => {
                    const newMethods = [...data.methods];
                    newMethods[i].value = e.target.value;
                    setData({ ...data, methods: newMethods });
                  }}
                />
                <input
                  className="block w-full p-2 border"
                  value={method.href}
                  placeholder="Href"
                  onChange={(e) => {
                    const newMethods = [...data.methods];
                    newMethods[i].href = e.target.value;
                    setData({ ...data, methods: newMethods });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className="bg text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>

        {/* Metadata JSON */}
        <div>
          <h2 className=" font-semibold mt-10">Metadata (JSON):</h2>
          <textarea
            className="w-full border p-2 h-48"
            value={metadataText}
            onChange={(e) => setMetadataText(e.target.value)}
          />
        </div>

        {/* Script JSON */}
        <div>
          <h2 className=" font-semibold mt-10">Script (JSON-LD):</h2>
          <textarea
            className="w-full border p-2 h-48"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          />
        </div>

        <button
          className="bg text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default EditContactData;
