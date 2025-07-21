import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface AboutCard {
  title: string;
  description: string;
}

interface AboutData {
  heroimg: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  alt1: string;
  alt2: string;
  alt3: string;
  alt4: string;
  subheading: string;
  mainHeading: string;
  split: string;
  paragraphs: string[];
  cards: AboutCard[];
  metadata?: any; // optional JSON metadata
  script?: any;
}

const EditAboutData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AboutData | null>(null);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [metadataText, setMetadataText] = useState("");
  const [scriptText, setScriptText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${baseURL}/aboutdata`);
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

      await axios.put(`${baseURL}/aboutdata`, updatedData);
      alert("About data updated successfully!");
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert(
        "Error updating about data. Make sure metadata and script are valid JSON."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDynamicImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: keyof AboutData
  ) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageKey", imageKey); // send which image to update

    try {
      const res = await axios.post(`${baseURL}/upload-about-image`, formData);
      const imagePath = res.data.path;

      // Update that specific image key
      if (data) setData({ ...data, [imageKey]: imagePath });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(`Failed to update ${imageKey}`);
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
        <h1 className="color text-[32px] font-semibold my-[10px]">
          About Page
        </h1>

        {/* Hero Image */}
        <div className="flex gap-1 flex-col">
          <img src={`${baseURL}/images/about/${data.heroimg}`} alt="img" />
          <input
            type="file"
            onChange={(e) => handleDynamicImageUpload(e, "heroimg")}
          />
        </div>
        {/* Cards */}
        <section className="space-y-6">
          <div>
            <h1 className="color text-[29px] font-semibold my-[0px]">Cards:</h1>
            {data.cards.map((card, i) => (
              <div key={i} className="space-y-2 my-4">
                <h2 className="text-[18px] font-semibold">Cards {i + 1}:</h2>
                <input
                  className="block w-full p-2 border"
                  type="text"
                  placeholder="Card Title"
                  value={card.title}
                  onChange={(e) => {
                    const newCards = [...data.cards];
                    newCards[i].title = e.target.value;
                    setData({ ...data, cards: newCards });
                  }}
                />
                <textarea
                  className="block w-full p-2 border"
                  placeholder="Card Description"
                  value={card.description}
                  onChange={(e) => {
                    const newCards = [...data.cards];
                    newCards[i].description = e.target.value;
                    setData({ ...data, cards: newCards });
                  }}
                />
              </div>
            ))}
            <button
              className="bg text-white px-4 py-2 rounded "
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>

          {/* Images */}
          <div className="flex gap-4">
            {/* Image1  */}
            <div className="flex gap-1 flex-col">
              <h1 className="color text-[22px] font-semibold my-[0px]">
                Image 1:
              </h1>
              <img
                src={`${baseURL}/images/about/${data.img1}`}
                className="h-[300px] object-cover"
              />
              <input
                type="file"
                onChange={(e) => handleDynamicImageUpload(e, "img1")}
              />
              <input
                type="text"
                value={data.alt1}
                placeholder="Alt Text"
                onChange={(e) => setData({ ...data, alt1: e.target.value })}
              />
            </div>

            {/* Image2  */}
            <div className="flex gap-1 flex-col">
              <h1 className="color text-[22px] font-semibold my-[0px]">
                Image 2:
              </h1>
              <img
                src={`${baseURL}/images/about/${data.img2}`}
                className="h-[300px] object-cover"
              />
              <input
                type="file"
                onChange={(e) => handleDynamicImageUpload(e, "img2")}
              />
              <input
                type="text"
                value={data.alt2}
                placeholder="Alt Text"
                onChange={(e) => setData({ ...data, alt2: e.target.value })}
              />
            </div>

            {/* Image3  */}
            <div className="flex gap-1 flex-col">
              <h1 className="color text-[22px] font-semibold my-[0px]">
                Image 3:
              </h1>
              <img
                src={`${baseURL}/images/about/${data.img3}`}
                className="h-[300px] object-cover"
              />
              <input
                type="file"
                onChange={(e) => handleDynamicImageUpload(e, "img3")}
              />
              <input
                type="text"
                value={data.alt3}
                placeholder="Alt Text"
                onChange={(e) => setData({ ...data, alt3: e.target.value })}
              />
            </div>
          </div>

          {/* Sub Heading */}
          <div>
            <h2 className="text-[18px] font-semibold">Subheading:</h2>
            <input
              className="block w-full my-2 p-2 border"
              type="text"
              placeholder="Subheading"
              value={data.subheading}
              onChange={(e) => setData({ ...data, subheading: e.target.value })}
            />
          </div>

          {/* Main Heading */}
          <div>
            <h2 className="text-[18px] font-semibold">Main Heading:</h2>
            <input
              className="block w-full my-2 p-2 border"
              type="text"
              placeholder="Main Heading"
              value={data.mainHeading}
              onChange={(e) =>
                setData({ ...data, mainHeading: e.target.value })
              }
            />
          </div>

          {/* Splite Word */}
          <div>
            <h2 className="text-[18px] font-semibold">Split Word:</h2>
            <input
              className="block w-full my-2 p-2 border"
              type="text"
              placeholder="From where to split the Heading"
              value={data.split}
              onChange={(e) => setData({ ...data, split: e.target.value })}
            />
          </div>

          {/* Paragraphs */}
          <div>
            <h2 className="text-[18px] font-semibold">Paragraphs:</h2>
            {data.paragraphs.map((p, i) => (
              <textarea
                key={i}
                className="block w-full my-2 p-2 border"
                placeholder={`Paragraph ${i + 1}`}
                value={p}
                onChange={(e) => {
                  const newParas = [...data.paragraphs];
                  newParas[i] = e.target.value;
                  setData({ ...data, paragraphs: newParas });
                }}
              />
            ))}
            <button
              className="bg text-white px-4 py-2 rounded "
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
          {/* Metadata JSON */}
          <div>
            <h2 className="text-[18px] font-semibold mt-10">
              Metadata (JSON):
            </h2>
            <textarea
              className="w-full border p-2 h-48"
              value={metadataText}
              onChange={(e) => setMetadataText(e.target.value)}
            />
          </div>

          {/* Script JSON */}
          <div>
            <h2 className="text-[18px] font-semibold mt-10">
              Script (JSON-LD):
            </h2>
            <textarea
              className="w-full border p-2 h-48"
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
            />
          </div>

          <button
            className="bg text-white px-4 py-2 rounded mt-4"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </section>
      </div>
    </>
  );
};

export default EditAboutData;
