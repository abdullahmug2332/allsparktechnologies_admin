import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface Breadcrumb {
  label: string;
  href: string;
}

interface ServiceCard {
  title: string;
  content: string;
}

interface ApproachCard {
  iconColor: string;
  title: string;
  content: string;
}

interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceData {
  hero: {
    title: string;
    backgroundImage: string;
    mobileBackgroundImage: string;
    breadcrumbs: Breadcrumb[];
    subtitle: string;
  };
  introduction: string;
  services: {
    title: string;
    cards: ServiceCard[];
  };
  approach: {
    title: string;
    cards: ApproachCard[];
  };
  whyChoose: {
    title: string;
    stats: Stat[];
  };
  faqs: {
    title: string;
    items: FaqItem[];
  };
  script: any;
  metadata: any;
}

const EditServicePage = () => {
  const serviceOptions = [
    "custom-software-development",
    "web-and-app-development",
    "ai-and-machine-learning",
    "cloud-and-devops-solutions",
    "ui-ux-design",
    "ecommerce-development",
    "customer-support",
    "email-marketing",
    "live-chat-support",
    "digital-marketing-and-seo",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [data, setData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedName, setSelectedName] = useState(
    "custom-software-development"
  );

  useEffect(() => {
    fetchServiceData(selectedName);
  }, [selectedName]);

  const fetchServiceData = async (name: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/service`, { name });
      setData(res.data);
      console.log(res.data.hero.mobileBackgroundImage);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${baseURL}/service`, {
        name: selectedName,
        json: data,
      });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (path: string, value: any) => {
    setIsLoading(true);
    const keys = path.split(".");
    const newData = { ...data } as any;
    let temp = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    setData(newData);
    setIsLoading(false);
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
      setIsLoading(true);
      const res = await fetch(`${baseURL}/upload-service-image`, {
        method: "POST",
        body: formData,
      });

      const result: { message?: string; path?: string; error?: string } =
        await res.json();

      if (res.ok && result.path) {
        setIsLoading(false);
        // ✅ Reflect the image update instantly in UI
        handleChange(imageKey, result.path);
      } else {
        alert(result.error || "Unknown error occurred during image upload.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
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
        className={`${
          toggle === false
            ? "w-full"
            : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
        } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] p-6 space-y-6 `}
      >
        {isLoading && <Loader />}

        <div className="relative">
          <h1 className="color text-[32px] font-semibold mt-[20px]">
            Hero Section
          </h1>
          {/* Select Input */}
          <div className="mb-6">
            <select
              className="bg !text-white text-center py-[10px] border p-2 rounded absolute top-[0px] right-0 color focus:outline-0 cursor-pointer"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            >
              {serviceOptions.map((name) => (
                <option key={name} value={name} className="cursor-pointer ">
                  {name
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
        {data && (
          <div className="space-y-[40px] ">
            {/* Hero IMGS */}
            <div>
              <div>
                <h3 className="font-semibold text-[18px]  mb-[5px]">
                  Desktop Background Image:
                </h3>
                <img
                  src={`${baseURL}/images/service/${data?.hero?.backgroundImage}`}
                  alt="heroimg"
                  className=" w-full h-[250px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    handleDynamicImageUpload(
                      e,
                      "hero.backgroundImage",
                      selectedName
                    )
                  }
                />
              </div>
              <div className="w-full md:w-[60%]">
                <h3 className="font-semibold text-[18px] mt-[20px] mb-[5px]">
                  Mobile Background Image:
                </h3>
                <img
                  src={`${baseURL}/images/service/${data?.hero?.mobileBackgroundImage}`}
                  alt="heroimg"
                  className=" w-full h-[250px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    handleDynamicImageUpload(
                      e,
                      "hero.mobileBackgroundImage",
                      selectedName
                    )
                  }
                />
              </div>
            </div>

            {/* Hero Data */}
            <div>
              <h3 className="font-semibold text-[18px]">Title:</h3>
              <input
                className="w-full    "
                value={data.hero.title}
                onChange={(e) => handleChange("hero.title", e.target.value)}
                placeholder="Hero Title"
              />
            </div>

            {/* Services Section     */}
            <div>
              <h2 className="text-[25px] font-semibold my-[10px]">Services</h2>
              <h3 className="font-semibold text-[18px]">Title:</h3>
              <input
                className="w-full    "
                placeholder="Services Title"
                value={data.services.title}
                onChange={(e) => handleChange("services.title", e.target.value)}
              />
              {data.services.cards.map((card, i) => (
                <div key={i} className="    mt-2">
                  <h3 className="font-semibold text-[18px]">
                    Service {i + 1}:
                  </h3>
                  <input
                    className="w-full   p-1"
                    placeholder="Card Title"
                    value={card.title}
                    onChange={(e) => {
                      const cards = [...data.services.cards];
                      cards[i].title = e.target.value;
                      handleChange("services.cards", cards);
                    }}
                  />
                  <textarea
                    className="w-full   p-1"
                    placeholder="Card Content"
                    value={card.content}
                    onChange={(e) => {
                      const cards = [...data.services.cards];
                      cards[i].content = e.target.value;
                      handleChange("services.cards", cards);
                    }}
                  />
                </div>
              ))}
              <button
                className="bg text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>

            {/* Approach Section */}
            <div>
              <h2 className="text-[25px] font-semibold my-[10px]">Approach</h2>
              <h3 className="font-semibold text-[18px]">Title:</h3>
              <input
                className="w-full    "
                value={data.approach.title}
                placeholder="Approch Title"
                onChange={(e) => handleChange("approach.title", e.target.value)}
              />
              {data.approach.cards.map((card, i) => (
                <div key={i} className="    mt-2">
                  <h3 className="font-semibold text-[18px]">
                    Approch {i + 1}:
                  </h3>

                  <input
                    className="w-full   p-1"
                    value={card.title}
                    placeholder="Card Title"
                    onChange={(e) => {
                      const cards = [...data.approach.cards];
                      cards[i].title = e.target.value;
                      handleChange("approach.cards", cards);
                    }}
                  />
                  <textarea
                    className="w-full   p-1"
                    placeholder="Card Content"
                    value={card.content}
                    onChange={(e) => {
                      const cards = [...data.approach.cards];
                      cards[i].content = e.target.value;
                      handleChange("approach.cards", cards);
                    }}
                  />
                </div>
              ))}
              <button
                className="bg text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>

            {/* Why Choose Section */}
            <div>
              <h2 className="text-[25px] font-semibold my-[10px]">
                Why Choose
              </h2>
              <h3 className="font-semibold text-[18px]">Title:</h3>
              <input
                className="w-full "
                value={data.whyChoose.title}
                placeholder="Whychoose Title"
                onChange={(e) =>
                  handleChange("whyChoose.title", e.target.value)
                }
              />
              {data.whyChoose.stats.map((stat, i) => (
                <div key={stat.id} className=" mt-4 rounded space-y-2">
                  <h3 className="font-semibold text-[18px]">Stat {i + 1}:</h3>
                  <div className="flex gap-1">
                    <input
                      className="w-[50%]    "
                      value={stat.label}
                      placeholder="State label"
                      onChange={(e) => {
                        const stats = [...data.whyChoose.stats];
                        stats[i].label = e.target.value;
                        handleChange("whyChoose.stats", stats);
                      }}
                    />
                    <input
                      type="number"
                      className="w-[30%]    "
                      placeholder="State Value"
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...data.whyChoose.stats];
                        stats[i].value = Number(e.target.value);
                        handleChange("whyChoose.stats", stats);
                      }}
                    />
                    <input
                      className="w-[20%]    "
                      placeholder="State Suffix"
                      value={stat.suffix}
                      onChange={(e) => {
                        const stats = [...data.whyChoose.stats];
                        stats[i].suffix = e.target.value;
                        handleChange("whyChoose.stats", stats);
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                className="bg text-white px-4 py-2 rounded mt-[10px]"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>

            {/* FAQs Section */}
            <div>
              <h2 className="text-[25px] font-semibold my-[10px]">FAQs</h2>
              <h3 className="font-semibold text-[18px]">Title:</h3>
              <input
                className="w-full "
                placeholder="Faq Title"
                value={data.faqs.title}
                onChange={(e) => handleChange("faqs.title", e.target.value)}
              />
              {data.faqs.items.map((item, i) => (
                <div key={i} className="  mt-2">
                  <h3 className="font-semibold text-[18px]">FAQ {i + 1}:</h3>
                  <input
                    className="w-full "
                    placeholder="FAQ Question"
                    value={item.question}
                    onChange={(e) => {
                      const items = [...data.faqs.items];
                      items[i].question = e.target.value;
                      handleChange("faqs.items", items);
                    }}
                  />
                  <textarea
                    className="w-full "
                    placeholder="FAQ Answer"
                    value={item.answer}
                    onChange={(e) => {
                      const items = [...data.faqs.items];
                      items[i].answer = e.target.value;
                      handleChange("faqs.items", items);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* MetaData Section  */}
            <div>
              <h2 className="font-bold">Meta Tags (JSON)</h2>
              <textarea
                className="w-full border p-2 h-48"
                value={JSON.stringify(data.metadata, null, 2)}
                onChange={(e) =>
                  handleChange("metadata", JSON.parse(e.target.value))
                }
              />
            </div>
            <button
              className="bg text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Save Changes
            </button>

            {/* Script Section  */}

            <div>
              <h2 className="font-bold">Script (JSON)</h2>
              <textarea
                className="w-full border p-2 h-48"
                value={JSON.stringify(data.script, null, 2)}
                onChange={(e) =>
                  handleChange("script", JSON.parse(e.target.value))
                }
              />
            </div>
            <button
              className="bg text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EditServicePage;
