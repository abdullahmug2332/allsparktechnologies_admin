import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface ServiceHeroData {
  btnText: string;
  btnText2: string;
  btnText3: string;
  title: string;
  description: string;
  formSubtitle: string;
  formTitle: string;
}

interface ServiceLogosData {
  logos: any[];
}

interface ServiceCardItem {
  icon: any;
  number: number | string;
  text: string;
  symbol?: string;
}

interface ServiceCardData {
  title: string;
  cards: ServiceCardItem[];
}

interface ServiceAboutFeature {
  icon: any;
  title: string;
}


interface ServiceAboutData {
  image1: any;
  image2: any;
  image3: any;
  subTitle: string;
  title: string;
  des: string;
  features: ServiceAboutFeature[];
}

interface ServiceProcessStep {
  image: any;
  heading: string;
  des: string;
  dir?: any;
}

interface ServiceProcessData {
  title: string;
  des: string;
  letters: string[];
  process: ServiceProcessStep[];
}

interface ServiceTechnologiesItem {
  name: string;
  Icon: any;
}

interface ServiceTechnologiesData {
  title: string;
  des: string;
  frontend: ServiceTechnologiesItem[];
  backend: ServiceTechnologiesItem[];
  database: ServiceTechnologiesItem[];
  others: ServiceTechnologiesItem[];
}

interface ServiceOfferingCard {
  icon: any;
  heading: string;
  des: string;
  btnText: string;
}

interface ServiceOfferingData {
  title: string;
  letters: string[];
  des: string;
  cards: ServiceOfferingCard[];
}

interface ServiceBannerData {
  image: any;
  Subtitle: string;
  title: string;
  des: string;
  btnText: string;
}

interface ServiceIndusData {
  image1: any;
  image2: any;
  image3: any;
  title: string;
  letters: string[];
  des1: string;
  des2: string;
}

interface ServiceIndustriesItem {
  image: any;
  title: string;
  des: string;
  btnText: string;
}

interface ServiceIndustriesData {
  title: string;
  letters: string[];
  industries: ServiceIndustriesItem[];
}

interface ServiceClientData {
  image1: any;
  image2: any;
  image3: any;
  image4: any;
  imageText: string;
  title: string;
  letters: string[];
  des1: string;
  des2: string;
  lis: string[];
}

interface ServiceFAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQsData {
  image1: any;
  image2: any;
  image3: any;
  subTitle: string;
  title: string;
  faqs: ServiceFAQItem[];
}

interface ServiceContactData {
  image: any;
  subTitle: string;
  title: string;
  btnText: string;
}

interface ServicePageData {
  serviceHero: ServiceHeroData;
  serviceLogos: ServiceLogosData;
  serviceCard: ServiceCardData;
  serviceAbout: ServiceAboutData;
  serviceProcess: ServiceProcessData;
  serviceTechnologies: ServiceTechnologiesData;
  serviceOffering: ServiceOfferingData;
  serviceBanner: ServiceBannerData;
  serviceIndus: ServiceIndusData;
  serviceIndustries: ServiceIndustriesData;
  serviceClient: ServiceClientData;
  serviceFAQs: ServiceFAQsData;
  serviceContact: ServiceContactData;
}

const EditServicePage = () => {
  const serviceOptions = [
    "website-development",
    "mobile-app-development",
    "ai-and-machine-learning",
    "cloud-and-devops-solutions",
    "ui-ux-design",
    "ecommerce-development",
    "customer-support",
    "email-marketing",
    "live-chat-support",
    "seo",
    "digital-marketing",
  ];

  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [data, setData] = useState<ServicePageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedName, setSelectedName] = useState(
    "website-development"
  );

  const fetchServiceData = async (name: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/service`, { name });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServiceData(selectedName);
  }, [selectedName]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${baseURL}/service`, {
        name: selectedName,
        json: data,
      });
      setLoading(false);
      alert("Data updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (path: string, value: any) => {
    setLoading(true);
    const keys = path.split(".");
    const newData = { ...data } as any;
    let temp = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    setData(newData);
    setLoading(false);
  };
  const handleDynamicImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: string,
    selectedName: string
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file || !selectedName) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageKey", imageKey);
    formData.append("name", selectedName);

    try {
      setLoading(true);
      const res = await fetch(`${baseURL}/upload-service-image`, {
        method: "POST",
        body: formData,
      });

      const result: { message?: string; path?: string; error?: string } =
        await res.json();

      if (res.ok && result.path) {
        setLoading(false);
        // ✅ Reflect the image update instantly in UI
        handleChange(imageKey, result.path);
      } else {
        alert(result.error || "Unknown error occurred during image upload.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <>
      <div
        className={`${toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
          } duration-500 font-semibold ml-auto py-[20px] px-[10px] md:px-[30px] mt-[40px] p-6 space-y-6`}
      >
        {loading && <Loader />}

        {/* Select  */}
        <div className="relative">
          <h1 className="text-[32px] font-semibold mt-[20px]">Edit Service Page</h1>
          <select
            className="bg-[#18185E] text-white text-center py-[10px] border p-2 rounded relative md:absolute top-[0px] right-0 focus:outline-0 cursor-pointer"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
          >
            {serviceOptions.map((name) => (
              <option key={name} value={name} className="cursor-pointer">
                {name
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {data && (
          <div className="space-y-[40px]">
            {/* serviceHero Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[30px] font-semibold my-[20px]">Hero Section</h2>
              <div className="flex flex-wrap items-center gap-[5px] ">
                <div className="w-[49%] lg:w-[32%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Button Text:</h3>
                  <input
                    className="w-full p-2 border rounded"
                    value={data.serviceHero.btnText}
                    onChange={(e) => handleChange("serviceHero.btnText", e.target.value)}
                    placeholder="Button Text"
                  />
                </div>
                <div className="w-[49%] lg:w-[32%]">
                  <h3 className="font-semibold text-[18px]  mb-[5px]">Button Text 2:</h3>
                  <input
                    className="w-full p-2 border rounded"
                    value={data.serviceHero.btnText2}
                    onChange={(e) => handleChange("serviceHero.btnText2", e.target.value)}
                    placeholder="Button Text 2"
                  />
                </div>
                <div className="w-[49%] lg:w-[32%]">
                  <h3 className="font-semibold text-[18px]  mb-[5px]">Button Text 3:</h3>
                  <input
                    className="w-full p-2 border rounded"
                    value={data.serviceHero.btnText3}
                    onChange={(e) => handleChange("serviceHero.btnText3", e.target.value)}
                    placeholder="Button Text 3"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceHero.title}
                onChange={(e) => handleChange("serviceHero.title", e.target.value)}
                placeholder="Hero Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceHero.description}
                onChange={(e) => handleChange("serviceHero.description", e.target.value)}
                placeholder="Hero Description"
              />
              <div className="flex flex-wrap items-center gap-[5px]">
                <div className="w-[49%]">
                  <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Form Subtitle:</h3>
                  <input
                    className="w-full p-2 border rounded"
                    value={data.serviceHero.formSubtitle}
                    onChange={(e) => handleChange("serviceHero.formSubtitle", e.target.value)}
                    placeholder="Form Subtitle"
                  />
                </div>
                <div className="w-[49%]">
                  <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Form Title:</h3>
                  <input
                    className="w-full p-2 border rounded"
                    value={data.serviceHero.formTitle}
                    onChange={(e) => handleChange("serviceHero.formTitle", e.target.value)}
                    placeholder="Form Title"
                  />
                </div>
              </div>


              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceLogos Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Logos Section</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[5px]">
                {data.serviceLogos.logos.map((logo, i) => (
                  <div key={i} className="mt-2">
                    <h3 className="font-semibold text-[18px] mb-[5px]">Logo {i + 1}:</h3>
                    <img
                      src={`${baseURL}/images/services/${logo}`}
                      alt={`logo-${i}`}
                      className="w-full h-[100px] object-contain border"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleDynamicImageUpload(e, `serviceLogos.logos.${i}`, selectedName)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* serviceCard Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Cards Section</h2>
              <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceCard.title}
                onChange={(e) => handleChange("serviceCard.title", e.target.value)}
                placeholder="Cards Title"
              />
              {data.serviceCard.cards.map((card, i) => (
                <div key={i} className="mt-4 space-y-2 border p-2">
                  <h3 className="font-semibold text-[18px]">Card {i + 1}:</h3>
                  <img
                    src={`${baseURL}/images/services/${card.icon}`}
                    alt={`card-icon-${i}`}
                    className="w-[50px] h-[50px] object-contain"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      handleDynamicImageUpload(e, `serviceCard.cards.${i}.icon`, selectedName)
                    }
                  />

                  <div className="flex gap-[5px] items-center ">
                    <input
                      className="w-full p-2 border rounded "
                      value={card.number}
                      onChange={(e) => {
                        const cards = [...data.serviceCard.cards];
                        cards[i].number = e.target.value;
                        handleChange("serviceCard.cards", cards);
                      }}
                      placeholder="Card Number"
                    />
                    <input
                      className="w-full p-2 border rounded"
                      value={card.text}
                      onChange={(e) => {
                        const cards = [...data.serviceCard.cards];
                        cards[i].text = e.target.value;
                        handleChange("serviceCard.cards", cards);
                      }}
                      placeholder="Card Text"
                    />
                    <input
                      className="w-full p-2 border rounded"
                      value={card.symbol}
                      onChange={(e) => {
                        const cards = [...data.serviceCard.cards];
                        cards[i].symbol = e.target.value;
                        handleChange("serviceCard.cards", cards);
                      }}
                      placeholder="Card Symbol"
                    />
                  </div>

                </div>
              ))}
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceAbout Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">About Section</h2>
              <div className="flex flex-wrap gap-[5px]">
                <div className="w-[49%] md:w-[32%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 1:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceAbout.image1}`}
                    alt="about-image1"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceAbout.image1", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[32%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 2:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceAbout.image2}`}
                    alt="about-image2"
                    className="w-full h-[200px] md:h-[300px] object-contain  border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceAbout.image2", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[32%]">
                  <h3 className="font-semibold text-[18px]  mb-[5px]">Image 3:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceAbout.image3}`}
                    alt="about-image3"
                    className="w-full h-[200px] md:h-[300px] object-contain  border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceAbout.image3", selectedName)}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Subtitle:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceAbout.subTitle}
                onChange={(e) => handleChange("serviceAbout.subTitle", e.target.value)}
                placeholder="About Subtitle"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceAbout.title}
                onChange={(e) => handleChange("serviceAbout.title", e.target.value)}
                placeholder="About Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceAbout.des}
                onChange={(e) => handleChange("serviceAbout.des", e.target.value)}
                placeholder="About Description"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-[5px]">
                {data.serviceAbout.features.map((feature, i) => (
                  <div key={i} className="mt-4 space-y-2">
                    <h3 className="font-semibold text-[18px]">Feature {i + 1}:</h3>
                    <img
                      src={`${baseURL}/images/services/${feature.icon}`}
                      alt={`feature-icon-${i}`}
                      className="w-[50px] h-[50px] object-contain"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleDynamicImageUpload(e, `serviceAbout.features.${i}.icon`, selectedName)
                      }
                    />
                    <input
                      className="w-full p-2 border rounded"
                      value={feature.title}
                      onChange={(e) => {
                        const features = [...data.serviceAbout.features];
                        features[i].title = e.target.value;
                        handleChange("serviceAbout.features", features);
                      }}
                      placeholder="Feature Title"
                    />
                  </div>
                ))}
              </div>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceProcess Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Process Section</h2>
              <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceProcess.title}
                onChange={(e) => handleChange("serviceProcess.title", e.target.value)}
                placeholder="Process Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Letters to Change Color in Title:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-[5px]">
                {data.serviceProcess.letters.map((letter, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <input
                      className="w-full p-2 border rounded"
                      value={letter}
                      onChange={(e) => {
                        const letters = [...data.serviceProcess.letters];
                        letters[i] = e.target.value;
                        handleChange("serviceProcess.letters", letters);
                      }}
                      placeholder={`Letter ${i + 1}`}
                    />
                    <button
                      className="bg-[#18185E] text-white px-2 py-1 rounded"
                      onClick={() => {
                        const newLetters = data.serviceProcess.letters.filter((_, index) => index !== i);
                        handleChange("serviceProcess.letters", newLetters);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px]"
                onClick={() => {
                  const newLetters = [...data.serviceProcess.letters, ""];
                  handleChange("serviceProcess.letters", newLetters);
                }}
              >
                Add Letter
              </button>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceProcess.des}
                onChange={(e) => handleChange("serviceProcess.des", e.target.value)}
                placeholder="Process Description"
              />
              {data.serviceProcess.process.map((proc, i) => (
                <div key={i} className="mt-4 space-y-2 border p-2">
                  <h3 className="font-semibold text-[18px]">Process Step {i + 1}:</h3>
                  <img
                    src={`${baseURL}/images/services/${proc.image}`}
                    alt={`process-image-${i}`}
                    className="w-[100px] h-[100px] object-contain"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      handleDynamicImageUpload(e, `serviceProcess.process.${i}.image`, selectedName)
                    }
                  />
                  <input
                    className="w-full p-2 border rounded"
                    value={proc.heading}
                    onChange={(e) => {
                      const process = [...data.serviceProcess.process];
                      process[i].heading = e.target.value;
                      handleChange("serviceProcess.process", process);
                    }}
                    placeholder="Process Heading"
                  />
                  <textarea
                    className="w-full p-2 border rounded"
                    value={proc.des}
                    onChange={(e) => {
                      const process = [...data.serviceProcess.process];
                      process[i].des = e.target.value;
                      handleChange("serviceProcess.process", process);
                    }}
                    placeholder="Process Description"
                  />
                  {proc.dir && (
                    <>
                      <img
                        src={`${baseURL}/images/services/${proc.dir}`}
                        alt={`process-dir-${i}`}
                        className="w-[50px] h-[50px] object-contain"
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          handleDynamicImageUpload(e, `serviceProcess.process.${i}.dir`, selectedName)
                        }
                      />
                    </>
                  )}
                </div>
              ))}
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceTechnologies Section */}
            {data.serviceTechnologies &&
              <div className="border p-2 rounded-[10px] shadow-xl">
                <h2 className="text-[25px] font-semibold my-[10px]">Technologies Section</h2>
                <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
                <input
                  className="w-full p-2 border rounded"
                  value={data.serviceTechnologies.title}
                  onChange={(e) => handleChange("serviceTechnologies.title", e.target.value)}
                  placeholder="Technologies Title"
                />
                <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description:</h3>
                <textarea
                  className="w-full p-2 border rounded"
                  value={data.serviceTechnologies.des}
                  onChange={(e) => handleChange("serviceTechnologies.des", e.target.value)}
                  placeholder="Technologies Description"
                />
                <div className="border p-2 mb-[10px]">
                  <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Frontend Technologies:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px]">
                    {data.serviceTechnologies.frontend.map((tech, i) => (
                      <div key={i} className="mt-4 space-y-2 border p-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[18px]">Frontend Tech {i + 1}:</h3>
                          <button
                            className="bg-[#18185E] text-white px-2 py-1 rounded"
                            onClick={() => {
                              const newFrontend = data.serviceTechnologies?.frontend.filter((_, index) => index !== i);
                              handleChange("serviceTechnologies.frontend", newFrontend);
                            }}
                          >
                            Remove Tech
                          </button>
                        </div>
                        <img
                          src={`${baseURL}/images/services/${tech.Icon}`}
                          alt={`frontend-icon-${i}`}
                          className="w-[50px] h-[50px] object-contain bg-[#18185E]"
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            handleDynamicImageUpload(e, `serviceTechnologies.frontend.${i}.Icon`, selectedName)
                          }
                        />
                        <input
                          className="w-full p-2 border rounded"
                          value={tech.name}
                          onChange={(e) => {
                            const frontend = [...data.serviceTechnologies.frontend];
                            frontend[i].name = e.target.value;
                            handleChange("serviceTechnologies.frontend", frontend);
                          }}
                          placeholder="Tech Name"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                    onClick={() => {
                      const newFrontend = [...data.serviceTechnologies.frontend, { name: "", Icon: "" }];
                      handleChange("serviceTechnologies.frontend", newFrontend);
                    }}
                  >
                    Add Frontend Tech
                  </button>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                    onClick={handleSave}
                  >
                    Save All Changes
                  </button>
                </div>
                <div className="border p-2 mb-[10px]">
                  <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Backend Technologies:</h3>
                  <div className="grid grid-cols- md:grid-cols-3 gap-[5px]">
                    {data.serviceTechnologies.backend.map((tech, i) => (
                      <div key={i} className="mt-4 space-y-2 border p-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[18px]">Backend Tech {i + 1}:</h3>
                          <button
                            className="bg-[#18185E] text-white px-2 py-1 rounded"
                            onClick={() => {
                              const newBackend = data.serviceTechnologies.backend.filter((_, index) => index !== i);
                              handleChange("serviceTechnologies.backend", newBackend);
                            }}
                          >
                            Remove Tech
                          </button>
                        </div>
                        <img
                          src={`${baseURL}/images/services/${tech.Icon}`}
                          alt={`backend-icon-${i}`}
                          className="w-[50px] h-[50px] object-contain bg-[#18185E]"
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            handleDynamicImageUpload(e, `serviceTechnologies.backend.${i}.Icon`, selectedName)
                          }
                        />
                        <input
                          className="w-full p-2 border rounded"
                          value={tech.name}
                          onChange={(e) => {
                            const backend = [...data.serviceTechnologies.backend];
                            backend[i].name = e.target.value;
                            handleChange("serviceTechnologies.backend", backend);
                          }}
                          placeholder="Tech Name"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                    onClick={() => {
                      const newBackend = [...data.serviceTechnologies.backend, { name: "", Icon: "" }];
                      handleChange("serviceTechnologies.backend", newBackend);
                    }}
                  >
                    Add Backend Tech
                  </button>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                    onClick={handleSave}
                  >
                    Save All Changes
                  </button>
                </div>
                <div className="border p-2 mb-[10px]">
                  <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Database Technologies:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px]">
                    {data.serviceTechnologies.database.map((tech, i) => (
                      <div key={i} className="mt-4 space-y-2 border p-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[18px]">Database Tech {i + 1}:</h3>
                          <button
                            className="bg-[#18185E] text-white px-2 py-1 rounded"
                            onClick={() => {
                              const newDatabase = data.serviceTechnologies.database.filter((_, index) => index !== i);
                              handleChange("serviceTechnologies.database", newDatabase);
                            }}
                          >
                            Remove Tech
                          </button>
                        </div>
                        <img
                          src={`${baseURL}/images/services/${tech.Icon}`}
                          alt={`database-icon-${i}`}
                          className="w-[50px] h-[50px] object-contain bg-[#18185E]"
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            handleDynamicImageUpload(e, `serviceTechnologies.database.${i}.Icon`, selectedName)
                          }
                        />
                        <input
                          className="w-full p-2 border rounded"
                          value={tech.name}
                          onChange={(e) => {
                            const database = [...data.serviceTechnologies.database];
                            database[i].name = e.target.value;
                            handleChange("serviceTechnologies.database", database);
                          }}
                          placeholder="Tech Name"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                    onClick={() => {
                      const newDatabase = [...data.serviceTechnologies.database, { name: "", Icon: "" }];
                      handleChange("serviceTechnologies.database", newDatabase);
                    }}
                  >
                    Add Database Tech
                  </button>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                    onClick={handleSave}
                  >
                    Save All Changes
                  </button>
                </div>
                <div className="border p-2 mb-[10px]">
                  <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Other Technologies:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px]">
                    {data.serviceTechnologies.others.map((tech, i) => (
                      <div key={i} className="mt-4 space-y-2 border p-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[18px]">Other Tech {i + 1}:</h3>
                          <button
                            className="bg-[#18185E] text-white px-2 py-1 rounded"
                            onClick={() => {
                              const newOthers = data.serviceTechnologies.others.filter((_, index) => index !== i);
                              handleChange("serviceTechnologies.others", newOthers);
                            }}
                          >
                            Remove Tech
                          </button>
                        </div>
                        <img
                          src={`${baseURL}/images/services/${tech.Icon}`}
                          alt={`other-icon-${i}`}
                          className="w-[50px] h-[50px] object-contain bg-[#18185E]"
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            handleDynamicImageUpload(e, `serviceTechnologies.others.${i}.Icon`, selectedName)
                          }
                        />
                        <input
                          className="w-full p-2 border rounded"
                          value={tech.name}
                          onChange={(e) => {
                            const others = [...data.serviceTechnologies.others];
                            others[i].name = e.target.value;
                            handleChange("serviceTechnologies.others", others);
                          }}
                          placeholder="Tech Name"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                    onClick={() => {
                      const newOthers = [...data.serviceTechnologies.others, { name: "", Icon: "" }];
                      handleChange("serviceTechnologies.others", newOthers);
                    }}
                  >
                    Add Other Tech
                  </button>
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                    onClick={handleSave}
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            }
            {/* serviceOffering Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Offering Section</h2>
              <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceOffering.title}
                onChange={(e) => handleChange("serviceOffering.title", e.target.value)}
                placeholder="Offering Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Letters to Change Color in Title:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-[5px]">
                {data.serviceOffering.letters.map((letter, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <input
                      className="w-full p-2 border rounded"
                      value={letter}
                      onChange={(e) => {
                        const letters = [...data.serviceOffering.letters];
                        letters[i] = e.target.value;
                        handleChange("serviceOffering.letters", letters);
                      }}
                      placeholder={`Letter ${i + 1}`}
                    />
                    <button
                      className="bg-[#18185E] text-white px-2 py-1 rounded"
                      onClick={() => {
                        const newLetters = data.serviceOffering.letters.filter((_, index) => index !== i);
                        handleChange("serviceOffering.letters", newLetters);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                onClick={() => {
                  const newLetters = [...data.serviceOffering.letters, ""];
                  handleChange("serviceOffering.letters", newLetters);
                }}
              >
                Add Letter
              </button>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceOffering.des}
                onChange={(e) => handleChange("serviceOffering.des", e.target.value)}
                placeholder="Offering Description"
              />
              {data.serviceOffering.cards.map((card, i) => (
                <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                  <h3 className="font-semibold text-[18px]">Offering Card {i + 1}:</h3>
                  <img
                    src={`${baseURL}/images/services/${card.icon}`}
                    alt={`offering-icon-${i}`}
                    className="w-[50px] h-[50px] object-contain"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      handleDynamicImageUpload(e, `serviceOffering.cards.${i}.icon`, selectedName)
                    }
                  />
                  <input
                    className="w-full p-2 border rounded"
                    value={card.heading}
                    onChange={(e) => {
                      const cards = [...data.serviceOffering.cards];
                      cards[i].heading = e.target.value;
                      handleChange("serviceOffering.cards", cards);
                    }}
                    placeholder="Card Heading"
                  />
                  <textarea
                    className="w-full p-2 border rounded"
                    value={card.des}
                    onChange={(e) => {
                      const cards = [...data.serviceOffering.cards];
                      cards[i].des = e.target.value;
                      handleChange("serviceOffering.cards", cards);
                    }}
                    placeholder="Card Description"
                  />
                  <input
                    className="w-full p-2 border rounded"
                    value={card.btnText}
                    onChange={(e) => {
                      const cards = [...data.serviceOffering.cards];
                      cards[i].btnText = e.target.value;
                      handleChange("serviceOffering.cards", cards);
                    }}
                    placeholder="Button Text"
                  />
                  <button
                    className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                    onClick={handleSave}
                  >
                    Save All Changes
                  </button>
                </div>

              ))}

            </div>
            {/* serviceBanner Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Banner Section</h2>
              <h3 className="font-semibold text-[18px] mb-[5px]">Image:</h3>
              <div className="w-full md:w-[50%] xl:w-[30%]">
                <img
                  src={`${baseURL}/images/services/${data.serviceBanner.image}`}
                  alt="banner-image"
                  className="w-full h-[300px] object-contain border"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "serviceBanner.image", selectedName)}
                />
                <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Subtitle:</h3>
                <input
                  className="w-full p-2 border rounded"
                  value={data.serviceBanner.Subtitle}
                  onChange={(e) => handleChange("serviceBanner.Subtitle", e.target.value)}
                  placeholder="Banner Subtitle"
                />
              </div>

              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceBanner.title}
                onChange={(e) => handleChange("serviceBanner.title", e.target.value)}
                placeholder="Banner Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceBanner.des}
                onChange={(e) => handleChange("serviceBanner.des", e.target.value)}
                placeholder="Banner Description"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Button Text:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceBanner.btnText}
                onChange={(e) => handleChange("serviceBanner.btnText", e.target.value)}
                placeholder="Button Text"
              />
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceIndus Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Industries Overview Section</h2>
              <div className="flex flex-wrap gap-[5px]">
                <div className="w-[49%] md:w-[32%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 1:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceIndus.image1}`}
                    alt="indus-image1"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceIndus.image1", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[32%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 2:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceIndus.image2}`}
                    alt="indus-image2"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceIndus.image2", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[32%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 3:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceIndus.image3}`}
                    alt="indus-image3"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceIndus.image3", selectedName)}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceIndus.title}
                onChange={(e) => handleChange("serviceIndus.title", e.target.value)}
                placeholder="Industries Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Letters to Change Color in Title:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-[5px]">
                {data.serviceIndus.letters.map((letter, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <input
                      className="w-full p-2 border rounded"
                      value={letter}
                      onChange={(e) => {
                        const letters = [...data.serviceIndus.letters];
                        letters[i] = e.target.value;
                        handleChange("serviceIndus.letters", letters);
                      }}
                      placeholder={`Letter ${i + 1}`}
                    />
                    <button
                      className="bg-[#18185E] text-white px-2 py-1 rounded"
                      onClick={() => {
                        const newLetters = data.serviceIndus.letters.filter((_, index) => index !== i);
                        handleChange("serviceIndus.letters", newLetters);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px]"
                onClick={() => {
                  const newLetters = [...data.serviceIndus.letters, ""];
                  handleChange("serviceIndus.letters", newLetters);
                }}
              >
                Add Letter
              </button>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description 1:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceIndus.des1}
                onChange={(e) => handleChange("serviceIndus.des1", e.target.value)}
                placeholder="Description 1"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description 2:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceIndus.des2}
                onChange={(e) => handleChange("serviceIndus.des2", e.target.value)}
                placeholder="Description 2"
              />
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceIndustries Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Industries Section</h2>

              {/* Title */}
              <h3 className="font-semibold text-[18px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceIndustries.title}
                onChange={(e) => handleChange("serviceIndustries.title", e.target.value)}
                placeholder="Industries Title"
              />

              {/* Letters */}
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Letters :</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-[5px]">
                {data.serviceIndustries.letters.map((letter, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <input
                      className="w-full p-2 border rounded"
                      value={letter}
                      onChange={(e) => {
                        const letters = [...data.serviceIndustries.letters];
                        letters[i] = e.target.value;
                        handleChange("serviceIndustries.letters", letters);
                      }}
                      placeholder={`Letter ${i + 1}`}
                    />
                    <button
                      className="bg-[#18185E] text-white px-2 py-1 rounded"
                      onClick={() => {
                        const newLetters = data.serviceIndustries.letters.filter((_, index) => index !== i);
                        handleChange("serviceIndustries.letters", newLetters);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                onClick={() => {
                  const newLetters = [...data.serviceIndustries.letters, ""];
                  handleChange("serviceIndustries.letters", newLetters);
                }}
              >
                Add Letter
              </button>

              {/* Industries */}
              <h3 className="font-semibold text-[18px] mt-[20px] mb-[5px]">Industries :</h3>
              {data.serviceIndustries.industries.map((industry, i) => (
                <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                  <h3 className="font-semibold text-[18px]">Industry {i + 1}:</h3>

                  {industry.image && (
                    <img
                      src={`${baseURL}/images/services/${industry.image}`}
                      alt={`industry-image-${i}`}
                      className="w-[80%] md:w-[50%] lg:w-[20%] h-[200px] object-contain "
                    />
                  )}

                  <input
                    type="file"
                    onChange={(e) =>
                      handleDynamicImageUpload(e, `serviceIndustries.industries.${i}.image`, selectedName)
                    }
                  />

                  <input
                    className="w-full p-2 border rounded"
                    value={industry.title}
                    onChange={(e) => {
                      const industries = [...data.serviceIndustries.industries];
                      industries[i].title = e.target.value;
                      handleChange("serviceIndustries.industries", industries);
                    }}
                    placeholder="Industry Title"
                  />

                  <textarea
                    className="w-full p-2 border rounded"
                    value={industry.des}
                    onChange={(e) => {
                      const industries = [...data.serviceIndustries.industries];
                      industries[i].des = e.target.value;
                      handleChange("serviceIndustries.industries", industries);
                    }}
                    placeholder="Industry Description"
                  />

                  <input
                    className="w-full p-2 border rounded"
                    value={industry.btnText}
                    onChange={(e) => {
                      const industries = [...data.serviceIndustries.industries];
                      industries[i].btnText = e.target.value;
                      handleChange("serviceIndustries.industries", industries);
                    }}
                    placeholder="Button Text"
                  />

                  <div className="flex gap-2">
                    <button
                      className="bg-[#18185E] text-white px-4 py-2 rounded"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                    <button
                      className="bg-[#18185E] text-white px-4 py-2 rounded"
                      onClick={() => {
                        const newIndustries = data.serviceIndustries.industries.filter((_, index) => index !== i);
                        handleChange("serviceIndustries.industries", newIndustries);
                      }}
                    >
                      Remove Industry
                    </button>
                  </div>
                </div>
              ))}

              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px] mr-[5px]"
                onClick={() => {
                  const newIndustry = {
                    image: "",
                    title: "",
                    des: "",
                    btnText: "",
                  };
                  const newIndustries = [...data.serviceIndustries.industries, newIndustry];
                  handleChange("serviceIndustries.industries", newIndustries);
                }}
              >
                Add Industry
              </button>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceClient Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Client Section</h2>
              <div className="flex flex-wrap gap-[5px]">
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 1:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceClient.image1}`}
                    alt="client-image1"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceClient.image1", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px]  mb-[5px]">Image 2:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceClient.image2}`}
                    alt="client-image2"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceClient.image2", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px]  mb-[5px]">Image 3:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceClient.image3}`}
                    alt="client-image3"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceClient.image3", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 4:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceClient.image4}`}
                    alt="client-image4"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceClient.image4", selectedName)}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    value={data.serviceClient.imageText}
                    onChange={(e) => handleChange("serviceClient.imageText", e.target.value)}
                    placeholder="Image Text"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceClient.title}
                onChange={(e) => handleChange("serviceClient.title", e.target.value)}
                placeholder="Client Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Letters:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-[5px]">
                {data.serviceClient.letters.map((letter, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <input
                      className="w-full p-2 border rounded"
                      value={letter}
                      onChange={(e) => {
                        const letters = [...data.serviceClient.letters];
                        letters[i] = e.target.value;
                        handleChange("serviceClient.letters", letters);
                      }}
                      placeholder={`Letter ${i + 1}`}
                    />
                    <button
                      className="bg-[#18185E] text-white px-2 py-1 rounded"
                      onClick={() => {
                        const newLetters = data.serviceClient.letters.filter((_, index) => index !== i);
                        handleChange("serviceClient.letters", newLetters);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px]"
                onClick={() => {
                  const newLetters = [...data.serviceClient.letters, ""];
                  handleChange("serviceClient.letters", newLetters);
                }}
              >
                Add Letter
              </button>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description 1:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceClient.des1}
                onChange={(e) => handleChange("serviceClient.des1", e.target.value)}
                placeholder="Description 1"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Description 2:</h3>
              <textarea
                className="w-full p-2 border rounded"
                value={data.serviceClient.des2}
                onChange={(e) => handleChange("serviceClient.des2", e.target.value)}
                placeholder="Description 2"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">List Items:</h3>
              {data.serviceClient.lis.map((item, i) => (
                <div key={i} className="flex items-center gap-2 mt-2">
                  <input
                    className="w-full p-2 border rounded"
                    value={item}
                    onChange={(e) => {
                      const lis = [...data.serviceClient.lis];
                      lis[i] = e.target.value;
                      handleChange("serviceClient.lis", lis);
                    }}
                    placeholder={`List Item ${i + 1}`}
                  />
                  <button
                    className="bg-[#18185E] text-white px-2 py-1 rounded"
                    onClick={() => {
                      const newLis = data.serviceClient.lis.filter((_, index) => index !== i);
                      handleChange("serviceClient.lis", newLis);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                onClick={() => {
                  const newLis = [...data.serviceClient.lis, ""];
                  handleChange("serviceClient.lis", newLis);
                }}
              >
                Add List Item
              </button>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>

            {/* serviceFAQs Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">FAQs Section</h2>
              <div className="flex flex-wrap gap-[5px]">
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 1:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceFAQs.image1}`}
                    alt="faq-image1"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceFAQs.image1", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px]  mb-[5px]">Image 2:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceFAQs.image2}`}
                    alt="faq-image2"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceFAQs.image2", selectedName)}
                  />
                </div>
                <div className="w-[49%] md:w-[24%]">
                  <h3 className="font-semibold text-[18px] mb-[5px]">Image 3:</h3>
                  <img
                    src={`${baseURL}/images/services/${data.serviceFAQs.image3}`}
                    alt="faq-image3"
                    className="w-full h-[200px] md:h-[300px] object-contain border"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDynamicImageUpload(e, "serviceFAQs.image3", selectedName)}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Subtitle:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceFAQs.subTitle}
                onChange={(e) => handleChange("serviceFAQs.subTitle", e.target.value)}
                placeholder="FAQ Subtitle"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceFAQs.title}
                onChange={(e) => handleChange("serviceFAQs.title", e.target.value)}
                placeholder="FAQ Title"
              />
              {data.serviceFAQs.faqs.map((faq, i) => (
                <div key={i} className="mt-4 space-y-2 border p-2 rounded-[5px]">
                  <h3 className="font-semibold text-[18px]">FAQ {i + 1}:</h3>

                  <input
                    className="w-full p-2 border rounded"
                    value={faq.question}
                    onChange={(e) => {
                      const faqs = [...data.serviceFAQs.faqs];
                      faqs[i].question = e.target.value;
                      handleChange("serviceFAQs.faqs", faqs);
                    }}
                    placeholder="FAQ Question"
                  />

                  <textarea
                    className="w-full p-2 border rounded"
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...data.serviceFAQs.faqs];
                      faqs[i].answer = e.target.value;
                      handleChange("serviceFAQs.faqs", faqs);
                    }}
                    placeholder="FAQ Answer"
                  />

                  <button
                    className="bg-[#18185E] text-white px-3 py-1 rounded"
                    onClick={() => {
                      const newFaqs = data.serviceFAQs.faqs.filter((_, index) => index !== i);
                      handleChange("serviceFAQs.faqs", newFaqs);
                    }}
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}

              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[10px] mr-[5px]"
                onClick={() => {
                  const newFaq = { question: "", answer: "" };
                  const newFaqs = [...data.serviceFAQs.faqs, newFaq];
                  handleChange("serviceFAQs.faqs", newFaqs);
                }}
              >
                Add FAQ
              </button>
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>

            </div>

            {/* serviceContact Section */}
            <div className="border p-2 rounded-[10px] shadow-xl">
              <h2 className="text-[25px] font-semibold my-[10px]">Contact Section</h2>
              <h3 className="font-semibold text-[18px] mb-[5px]">Image:</h3>
              <img
                src={`${baseURL}/images/services/${data.serviceContact.image}`}
                alt="contact-image"
                className="w-[100px] h-[100px] object-contain"
              />
              <input
                type="file"
                onChange={(e) => handleDynamicImageUpload(e, "serviceContact.image", selectedName)}
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Subtitle:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceContact.subTitle}
                onChange={(e) => handleChange("serviceContact.subTitle", e.target.value)}
                placeholder="Contact Subtitle"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Title:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceContact.title}
                onChange={(e) => handleChange("serviceContact.title", e.target.value)}
                placeholder="Contact Title"
              />
              <h3 className="font-semibold text-[18px] mt-[10px] mb-[5px]">Button Text:</h3>
              <input
                className="w-full p-2 border rounded"
                value={data.serviceContact.btnText}
                onChange={(e) => handleChange("serviceContact.btnText", e.target.value)}
                placeholder="Button Text"
              />
              <button
                className="bg-[#18185E] text-white px-4 py-2 rounded mt-[20px]"
                onClick={handleSave}
              >
                Save All Changes
              </button>
            </div>


          </div>
        )}
      </div>
    </>
  );
};

export default EditServicePage;
