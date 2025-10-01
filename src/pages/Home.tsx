import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface HeroData {
  texts: string[];
  features: string[];
}
interface logo {
  id: number;
  src: string;
  alt: string;
}
interface HomeService {
  id: string;
  title: string;
  imageUrl: string;
}

interface HomeServices {
  subTitle: string;
  title: string;
  allServices: HomeService[];
}

interface AboutFeature {
  title: string;
  subtitle: string;
}

interface AboutData {
  img1: string;
  img2: string;
  img3: string;
  alt1: string;
  alt2: string;
  alt3: string;
  alt4: string;
  subheading: string;
  mainHeading: string;
  paragraphs: string[];
  features: AboutFeature[];
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  img1: string;
  img2: string;
  img3: string;
  alt1: string;
  alt2: string;
  alt3: string;
  subtitle: string;
  title: string;
  faqs: FAQItem[];
}
interface ContactBanner {
  img: string;
  alt: string;
  subTitle: string;
  title: string;
}
interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
  rating: number;
}

interface TestimonialsData {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

interface HomeData {
  hero: HeroData;
  logos: logo[];
  homeServices: HomeServices;
  about: AboutData;
  process: ProcessStep[];
  faq: FAQData;
  contactBanner: ContactBanner;
  testimonials: TestimonialsData;
  metadata?: any; // optional JSON metadata
  script?: any;
}

const EditHomeData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<HomeData | null>(null);
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const [metadataText, setMetadataText] = useState("");
  const [scriptText, setScriptText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${baseURL}/homedata`);
      setData(res.data);
      setMetadataText(JSON.stringify(res.data.metadata || {}, null, 2));
      setScriptText(JSON.stringify(res.data.script || {}, null, 2));
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const parsedMetadata = JSON.parse(metadataText);
      const parsedScript = JSON.parse(scriptText);
      const updatedData = {
        ...data,
        metadata: parsedMetadata,
        script: parsedScript,
      };
      await axios.put(`${baseURL}/homedata`, updatedData);
      alert("Home Page updated successfully!");

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error updating data");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDynamicImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: string
  ) => {
    const file = e.target.files?.[0]; 
    if (!file) return;



    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageKey", imageKey); // e.g., 'logos[0].src'

    try {
      setIsLoading(true);
      const res = await axios.post(`${baseURL}/upload-home-image`, formData);
      const imagePath = res.data.path;

      // ✅ Update local state (data)
      setData((prevData: any) => {
        const newData = { ...prevData };

        // ✅ Parse and apply the key (e.g., 'logos[2].src')
        const keys = imageKey
          .replace(/\[(\w+)\]/g, ".$1") // convert [2] to .2
          .split(".");

        let ref: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = imagePath;

        return newData;
      });

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert(`Failed to upload image for ${imageKey}`);
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
        className={`${toggle == false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
          } duration-500  font-semibold ml-auto py-[20px] px-[30px] mt-[40px] p-6  space-y-9`}
      >
        {isLoading && <Loader />}

        <h1 className="color text-[32px] font-semibold my-[10px]">
          Hero Section
        </h1>

        <div className="space-y-8">
          <div>
            {/* Hero Section */}
            <section>
              <h2 className="color text-[18px] font-semibold">
                Hero Headings:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-y-0">
                {data.hero.texts.map((text, index) => (
                  <input
                    key={index}
                    className="block w-full my-1 p-2 border"
                    placeholder="Hero Title"
                    value={text}
                    onChange={(e) => {
                      const newTexts = [...data.hero.texts];
                      newTexts[index] = e.target.value;
                      setData({
                        ...data,
                        hero: { ...data.hero, texts: newTexts },
                      });
                    }}
                  />
                ))}
              </div>
              <h2 className="color text-[18px] font-semibold">
                Hero Subheadings:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-y-0">
                {data.hero.features.map((feature, index) => (
                  <input
                    key={index}
                    className="block w-full my-1 p-2 border"
                    placeholder="Hero Feature"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...data.hero.features];
                      newFeatures[index] = e.target.value;
                      setData({
                        ...data,
                        hero: { ...data.hero, features: newFeatures },
                      });
                    }}
                  />
                ))}
              </div>
              <button
                className="bg text-white px-4 py-2 rounded mt-1"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </section>
          </div>

          {/* Companies Logos */}
          <div>
            <section>
              <h2 className="color text-[32px] font-semibold">
                Companies Logos:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[10px] my-[10px]">
                {data?.logos?.map((logo, index) => (
                  <div
                    key={index}
                    className="my-[30px] flex flex-col gap-[10px]"
                  >
                    <h2 className="color text-[18px] font-semibold">
                      Logo {index + 1}:
                    </h2>
                    <img
                      src={`${baseURL}/images/home/${logo.src}`}
                      className="max-h-[50px] object-cover"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleDynamicImageUpload(e, `logos[${index}].src`)
                      }
                    />
                    <input
                      type="text"
                      value={logo.alt}
                      placeholder="Alt Text"
                      onChange={(e) => {
                        const updatedLogos = [...data.logos];
                        updatedLogos[index] = {
                          ...updatedLogos[index],
                          alt: e.target.value,
                        };
                        setData({ ...data, logos: updatedLogos });
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="bg text-white px-4 py-2 rounded mt-4"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </section>
          </div>

          {/* Services */}
          <div>
            <section>
              <h2 className="color text-[32px] font-semibold my-[10px]">
                Services Section
              </h2>
              <div>
                <h2 className="text-[18px] font-semibold">Services Title:</h2>
                <input
                  className="block w-full my-2 p-2 border"
                  type="text"
                  placeholder="Service Title"
                  value={data.homeServices.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      homeServices: {
                        ...data.homeServices,
                        title: e.target.value,
                      },
                    })
                  }
                />
                <h2 className="text-[18px] font-semibold">
                  Services Subtitle:
                </h2>
                <input
                  className="block w-full my-2 p-2 border"
                  type="text"
                  placeholder="Service Subtitle"
                  value={data.homeServices.subTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      homeServices: {
                        ...data.homeServices,
                        subTitle: e.target.value,
                      },
                    })
                  }
                />
                <button
                  className="bg text-white px-4 py-2 rounded "
                  onClick={handleSave}
                >
                  Save Changes
                </button>
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px] gap-y-[30px] mt-[30px]">
                    {data?.homeServices?.allServices?.map((service, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-[5px] border p-2 rounded"
                      >
                        <h2 className="color text-[18px] font-semibold">
                          Service {index + 1}:
                        </h2>

                        {/* Title */}
                        <input
                          className="block w-full p-2 border"
                          type="text"
                          placeholder="Service Title"
                          value={service.title}
                          onChange={(e) => {
                            const updatedServices = [...data.homeServices.allServices];
                            updatedServices[index].title = e.target.value;
                            setData({
                              ...data,
                              homeServices: {
                                ...data.homeServices,
                                allServices: updatedServices,
                              },
                            });
                          }}
                        />

                        {/* ID/Slug */}
                        <input
                          className="block w-full  p-2 border"
                          type="text"
                          placeholder="Service url"
                          value={service.id}
                          onChange={(e) => {
                            const updatedServices = [...data.homeServices.allServices];
                            updatedServices[index].id = e.target.value;
                            setData({
                              ...data,
                              homeServices: {
                                ...data.homeServices,
                                allServices: updatedServices,
                              },
                            });
                          }}
                        />

                        {/* Image */}
                        <img
                          src={`${baseURL}/images/home/${service.imageUrl}`}
                          className="rounded-[5px] w-full h-[100%]"
                        />

                        <input
                          type="file"
                          onChange={(e) =>
                            handleDynamicImageUpload(
                              e,
                              `homeServices.allServices.${index}.imageUrl` // ✅ dot notation
                            )
                          }
                        />

                        {/* Remove Button */}
                        <button
                          onClick={() => {
                            const updatedServices = data.homeServices.allServices.filter(
                              (_, i) => i !== index
                            );
                            setData({
                              ...data,
                              homeServices: {
                                ...data.homeServices,
                                allServices: updatedServices,
                              },
                            });
                          }}
                          className="mt-2 bg text-white p-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* Add Service Button */}
                    <div className="col-span-full">
                      <button
                        onClick={() => {
                          const newService = {
                            id: "",
                            title: "",
                            imageUrl: "",
                          };
                          setData({
                            ...data,
                            homeServices: {
                              ...data.homeServices,
                              allServices: [
                                ...data.homeServices.allServices,
                                newService,
                              ],
                            },
                          });
                        }}
                        className="bg text-white p-2 rounded mr-1"
                      >
                        + Add Service
                      </button>
                      <button
                        className="bg text-white px-4 py-2 rounded "
                        onClick={handleSave}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>


                </div>
              </div>
            </section>
          </div>

          {/* About Section */}
          <div>
            <h1 className="color text-[32px] font-semibold my-[10px]">
              About Section
            </h1>
            <section className="space-y-6">
              <div>
                <h2 className="text-[18px] font-semibold">About Subheading:</h2>
                <input
                  className="block w-full my-2 p-2 border"
                  type="text"
                  placeholder="Subheading"
                  value={data.about.subheading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      about: { ...data.about, subheading: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <h2 className="text-[18px] font-semibold">About Heading:</h2>
                <input
                  className="block w-full my-2 p-2 border"
                  type="text"
                  placeholder="Main Heading"
                  value={data.about.mainHeading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      about: { ...data.about, mainHeading: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <h2 className="text-[18px] font-semibold">About Paragraphs:</h2>
                {data.about.paragraphs.map((p, i) => (
                  <textarea
                    key={i}
                    className="block w-full my-2 p-2 border"
                    placeholder={`Paragraph ${i + 1}`}
                    value={p}
                    onChange={(e) => {
                      const newParas = [...data.about.paragraphs];
                      newParas[i] = e.target.value;
                      setData({
                        ...data,
                        about: { ...data.about, paragraphs: newParas },
                      });
                    }}
                  />
                ))}
              </div>

              <div>
                <h2 className="text-[18px] font-semibold">About Features:</h2>
                {data.about.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="w-1/2 p-2 border"
                      type="text"
                      placeholder="Feature Title"
                      value={f.title}
                      onChange={(e) => {
                        const features = [...data.about.features];
                        features[i].title = e.target.value;
                        setData({
                          ...data,
                          about: { ...data.about, features },
                        });
                      }}
                    />
                    <input
                      className="w-1/2 p-2 border"
                      type="text"
                      placeholder="Feature Subtitle"
                      value={f.subtitle}
                      onChange={(e) => {
                        const features = [...data.about.features];
                        features[i].subtitle = e.target.value;
                        setData({
                          ...data,
                          about: { ...data.about, features },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
            <button
              className="bg text-white px-4 py-2 rounded mt-1"
              onClick={handleSave}
            >
              Save Changes
            </button>
            {/* Images  */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[10px] mt-[30px]">
              {/* Image1 */}
              <div className="flex flex-col gap-[5px] ">
                <img
                  src={`${baseURL}/images/home/${data?.about?.img1}`}
                  className="h-[300px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "about.img1")}
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data?.about?.alt1}
                  onChange={(e) => {
                    const updatedAbout = {
                      ...data.about,
                      alt1: e.target.value,
                    };
                    setData({ ...data, about: updatedAbout });
                  }}
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-1"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>

              {/* Image2 */}
              <div className="flex flex-col gap-[5px] ">
                <img
                  src={`${baseURL}/images/home/${data?.about?.img2} `}
                  className="h-[300px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "about.img2")}
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data?.about?.alt2}
                  onChange={(e) => {
                    const updatedAbout = {
                      ...data.about,
                      alt2: e.target.value,
                    };
                    setData({ ...data, about: updatedAbout });
                  }}
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-1"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>

              {/* Image3 */}
              <div className="flex flex-col gap-[5px] ">
                <img
                  src={`${baseURL}/images/home/${data?.about?.img3}`}
                  className="h-[300px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "about.img3")}
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data?.about?.alt3}
                  onChange={(e) => {
                    const updatedAbout = {
                      ...data.about,
                      alt3: e.target.value,
                    };
                    setData({ ...data, about: updatedAbout });
                  }}
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-1"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div>
            <h1 className="color text-[32px] font-semibold my-[10px]">
              Process Section
            </h1>
            <section className="space-y-6">
              {data.process.map((step, i) => (
                <div key={i} className="space-y-1 my-[10px]">
                  <h2 className="text-[18px] font-semibold">
                    Process {i + 1}:
                  </h2>
                  <input
                    className="block w-full p-2  border"
                    type="text"
                    placeholder="Step Number"
                    value={step.title}
                    onChange={(e) => {
                      const steps = [...data.process];
                      steps[i].title = e.target.value;
                      setData({ ...data, process: steps });
                    }}
                  />
                  <textarea
                    className="block w-full p-2 border "
                    placeholder="Description "
                    value={step.description}
                    onChange={(e) => {
                      const steps = [...data.process];
                      steps[i].description = e.target.value;
                      setData({ ...data, process: steps });
                    }}
                  />
                </div>
              ))}
            </section>
            <button
              className="bg text-white px-4 py-2 rounded mt-1"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>

          {/* FAQ Section */}
          <section className="space-y-6">
            <h1 className="color text-[32px] font-semibold my-[10px]">FAQ Section</h1>

            {/* Title */}
            <div>
              <h2 className="text-[18px] font-semibold">FAQ Title:</h2>
              <input
                className="block w-full my-2 p-2 border"
                placeholder="Faq Title"
                value={data.faq.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    faq: { ...data.faq, title: e.target.value },
                  })
                }
              />
            </div>

            {/* Subtitle */}
            <div>
              <h2 className="text-[18px] font-semibold">FAQ Subtitle:</h2>
              <input
                className="block w-full my-2 p-2 border"
                placeholder="Faq Subtitle"
                value={data.faq.subtitle}
                onChange={(e) =>
                  setData({
                    ...data,
                    faq: { ...data.faq, subtitle: e.target.value },
                  })
                }
              />
            </div>

            {/* FAQs */}
            {data.faq.faqs.map((item, i) => (
              <div key={i} className="space-y-2 border p-3 rounded-md relative">
                <h3 className="text-[18px] font-semibold">FAQ {i + 1}:</h3>

                {/* Question */}
                <input
                  className="block w-full p-2 border"
                  placeholder="Faq Question"
                  value={item.question}
                  onChange={(e) => {
                    const faqs = [...data.faq.faqs];
                    faqs[i].question = e.target.value;
                    setData({ ...data, faq: { ...data.faq, faqs } });
                  }}
                />

                {/* Answer */}
                <textarea
                  className="block w-full p-2 border"
                  placeholder="Faq Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const faqs = [...data.faq.faqs];
                    faqs[i].answer = e.target.value;
                    setData({ ...data, faq: { ...data.faq, faqs } });
                  }}
                />

                {/* Remove Button */}
                <button
                  className="absolute top-0 right-2 bg text-white px-3 py-1 rounded"
                  onClick={() => {
                    const faqs = data.faq.faqs.filter((_, idx) => idx !== i);
                    setData({ ...data, faq: { ...data.faq, faqs } });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add FAQ Button */}
            <button
              className="bg text-white px-4 py-2 rounded"
              onClick={() => {
                setData({
                  ...data,
                  faq: {
                    ...data.faq,
                    faqs: [...data.faq.faqs, { question: "", answer: "" }],
                  },
                });
              }}
            >
              Add FAQ
            </button>

            {/* Save Button */}
            <button
              className="bg text-white px-4 py-2 rounded mt-1 ml-2"
              onClick={handleSave}
            >
              Save Changes
            </button>

            {/* Images */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[10px] mt-[30px]">
              {/* Img1 */}
              <div className="flex flex-col gap-[5px]">
                <img
                  src={`${baseURL}/images/home/${data?.faq?.img1}`}
                  className="h-[300px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "faq.img1")}
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data?.faq?.alt1}
                  onChange={(e) => {
                    setData({
                      ...data,
                      faq: { ...data.faq, alt1: e.target.value },
                    });
                  }}
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-1"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>

              {/* Img2 */}
              <div className="flex flex-col gap-[5px]">
                <img
                  src={`${baseURL}/images/home/${data?.faq?.img2}`}
                  className="h-[300px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "faq.img2")}
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data?.faq?.alt2}
                  onChange={(e) => {
                    setData({
                      ...data,
                      faq: { ...data.faq, alt2: e.target.value },
                    });
                  }}
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-1"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>

              {/* Img3 */}
              <div className="flex flex-col gap-[5px]">
                <img
                  src={`${baseURL}/images/home/${data?.faq?.img3}`}
                  className="h-[300px] object-cover"
                />
                <input
                  type="file"
                  onChange={(e) => handleDynamicImageUpload(e, "faq.img3")}
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data?.faq?.alt3}
                  onChange={(e) => {
                    setData({
                      ...data,
                      faq: { ...data.faq, alt3: e.target.value },
                    });
                  }}
                />
                <button
                  className="bg text-white px-4 py-2 rounded mt-1"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>


          {/* Contact banner */}
          <div>
            <div>
              <h1 className="color text-[32px] font-semibold my-[10px]">
                Contact Banner Section
              </h1>
              {/* SubTitle Input */}
              <div className="mb-4">
                <h2 className="text-[18px] font-semibold">SubTitle:</h2>
                <input
                  type="text"
                  className="block w-full my-2 p-2 border"
                  placeholder="SubTitle"
                  value={data.contactBanner.subTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactBanner: {
                        ...data.contactBanner,
                        subTitle: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <h2 className="text-[18px] font-semibold">Title:</h2>
                <input
                  type="text"
                  className="block w-full my-2 p-2 border"
                  placeholder="Title"
                  value={data.contactBanner.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactBanner: {
                        ...data.contactBanner,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Save Button */}
              <button
                className="bg text-white px-4 py-2 rounded mb-[30px]"
                onClick={handleSave}
              >
                Save Changes
              </button>

              {/* Image Preview */}
              <div className="mb-4">
                <h2 className="text-[18px] font-semibold">Banner Image:</h2>
                <img
                  src={`${baseURL}/images/home/${data.contactBanner.img}`}
                  alt="Banner"
                  className="w-[200px] h-auto mb-2"
                />
                <input
                  type="file"
                  className="block my-2"
                  onChange={(e) =>
                    handleDynamicImageUpload(e, "contactBanner.img")
                  }
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={data.contactBanner.alt}
                  onChange={(e) => {
                    setData({
                      ...data,
                      contactBanner: {
                        ...data.contactBanner,
                        alt: e.target.value,
                      },
                    })
                  }}
                />
              </div>
              <button
                className="bg text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Testimonials Section */}
          <section className="space-y-6">
            <h1 className="color text-[32px] font-semibold my-[10px]">
              Testimonials Section
            </h1>
            {data.testimonials.testimonials.map((t, i) => (
              <div key={i} className="space-y-2">
                <h2 className="text-[18px] font-semibold">
                  Testimonial {i + 1}:
                </h2>
                <div className="flex gap-[5px]">
                  <input
                    className="block  p-2 border w-[50%]"
                    value={t.name}
                    placeholder="Testimonial Name"
                    onChange={(e) => {
                      const updated = [...data.testimonials.testimonials];
                      updated[i].name = e.target.value;
                      setData({
                        ...data,
                        testimonials: {
                          ...data.testimonials,
                          testimonials: updated,
                        },
                      });
                    }}
                  />
                  <input
                    className="block w-[50%] p-2 border "
                    value={t.role}
                    placeholder="Testimonial Role"
                    onChange={(e) => {
                      const updated = [...data.testimonials.testimonials];
                      updated[i].role = e.target.value;
                      setData({
                        ...data,
                        testimonials: {
                          ...data.testimonials,
                          testimonials: updated,
                        },
                      });
                    }}
                  />
                  <input
                    type="number"
                    className="block w-[50%] p-2 border "
                    value={t.rating}
                    placeholder="Rating"
                    onChange={(e) => {
                      const updated = [...data.testimonials.testimonials];
                      updated[i].rating = Number(e.target.value);
                      setData({
                        ...data,
                        testimonials: {
                          ...data.testimonials,
                          testimonials: updated,
                        },
                      });
                    }}
                  />
                </div>

                <textarea
                  className="block w-full p-2 border"
                  value={t.text}
                  placeholder="Testimonial Text"
                  onChange={(e) => {
                    const updated = [...data.testimonials.testimonials];
                    updated[i].text = e.target.value;
                    setData({
                      ...data,
                      testimonials: {
                        ...data.testimonials,
                        testimonials: updated,
                      },
                    });
                  }}
                />
              </div>
            ))}
            <button
              className="bg text-white px-4 py-2 rounded mt-1"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </section>
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
        </div>
      </div>
    </>
  );
};

export default EditHomeData;
