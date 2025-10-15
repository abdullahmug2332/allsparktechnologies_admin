import React, { useEffect, useState } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { useParams } from "react-router-dom";
import BlogFaqs from "../components/BlogFaqs";
import authorimg from "../../public/blogauthor.jpg"; // ✅ Move image to /src/assets or /public
import { baseURL } from "../../API/baseURL";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

// ✅ Helper functions
const slugify = (text: string) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-") || "section";

const makeUnique = (base: string, taken: Set<string>) => {
  let id = base;
  let n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  taken.add(id);
  return id;
};

interface Faq {
  id: string;
  question: string;
  answer: string;
}
interface BlogData {
  id: number;
  title: string;
  description: string;
  urlName: string;
  image: string;
  created_at: string;
  items: any[];
  faqs: Faq[];
}

const DetailBlog: React.FC = () => {
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const { urlName } = useParams();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${baseURL}/blogs/${urlName}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [urlName]);

  if (loading) return <h1 className="text-center py-10">Loading...</h1>;
  if (!blog) return <h1 className="text-center py-10">No detail found</h1>;

  // ✅ Assign unique IDs for headings
  const takenIds = new Set<string>();
  const itemsWithIds = Array.isArray(blog.items)
    ? blog.items.map((it: any) => {
      if (it?.type === "h2" && typeof it.value === "string") {
        const id = makeUnique(slugify(it.value), takenIds);
        return { ...it, id };
      }
      return it;
    })
    : [];

  const toc = itemsWithIds
    .filter((it: any) => it.type === "h2" && it.id)
    .map((it: any) => ({ id: it.id, text: it.value }));

  return (
    <div
      className={`${toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
        } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] space-y-6`}
    >
      <div className={`${toggle === true? "w-[95%] xl:w-[100%]":"w-[95%] xl:w-[80%]"} duration-500 mx-auto flex flex-col md:flex-row`}>
        {/* Content */}
        <div className="w-full md:w-[75%] md:border-r md:border-[#dbdbdb] flex flex-col gap-[10px] px-[20px] py-[30px] lg:pr-[60px]">
          <p className="heading font-bold leading-[32px] text-[#111827] font">
            {blog.title}
          </p>
          <div className="-mt-4">
            <div className="w-10 border-b-4 border-blue-500 inline-block"></div>
          </div>

          <div className="flex items-center gap-[5px]">
            <MdOutlineDateRange className="text-[20px] text-blue-500" />
            <p className="para text-[#4b5563] font-[500]">
              {new Date(blog.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <img
            src={`${baseURL}/images/blogs/${blog.image}`}
            alt="MainImg"
            className="rounded-[10px] w-full"
          />

          <p className="para text-[#1f2937] font-[500]">{blog.description}</p>

          <div className="blogsdata">
            {itemsWithIds.map((item: any, index: number) => (
              <div key={index}>
                {item.type === "h1" && <h1 className="h1 heading text-black ">{item.value}</h1>}
                {item.type === "h2" && (
                  <div>
                    <h2 id={item.id} className="h2 scroll-mt-24 text-black">
                      {item.value}
                    </h2>
                    <div className="-mt-4">
                      <div className="w-10 border-b-4 border-blue-500 inline-block"></div>
                    </div>
                  </div>
                )}
                {item.type === "h3" && <h3 className="h3 text-black">{item.value}</h3>}
                {item.type === "p" && (
                  <p
                    className="text-[16px] text-[#4B5563] font-[400] para "
                    dangerouslySetInnerHTML={{ __html: item.value }}
                  />
                )}
                {item.type === "strong" && (
                  <strong className="text-[#4B5563] font-[400] text-[16px]">
                    {item.value}
                  </strong>
                )}
                {item.type === "ul" && (
                  <ul className="ul">
                    {item.value?.map((li: any, liIndex: number) => (
                      <li key={liIndex} className="text-[#4B5563] font-[500] para">
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
                {item.type === "ol" && (
                  <ol className="ol">
                    {item.value?.map((li: any, liIndex: number) => (
                      <li key={liIndex} className="text-[#4B5563] font-[500] para">
                        {li}
                      </li>
                    ))}
                  </ol>
                )}
                {item.type === "singleimage" && (
                  <img
                    src={`${baseURL}/images/blogs/${item.value}`}
                    alt="img"
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>

          {/* FAQs */}
          <BlogFaqs faqs={blog.faqs} />

          {/* Author */}
          <div className="flex gap-[10px] justify-start items-center">
            <img
              src={authorimg}
              alt="author"
              className="w-[50px] h-[50px] object-cover border border-[#384BFF] rounded-full"
            />
            <div>
              <p className="subheading leading-[29px] font-medium border-b-2 border-[#384BFF] relative bottom-[3px]">
                by Admin
              </p>
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className="w-full md:w-[25%] hidden md:block p-[20px] max-h-[95vh] overflow-y-auto hide-scrollbar md:sticky top-[40px]">
          <p className="font-semibold mt-[10px] mb-[6px] ml-1 subheading text-black">
            Table of Contents
          </p>
          <hr />
          <div className="flex flex-col gap-[10px] my-[5px]">
            {toc.map((h, i) => (
              <div key={i}>
                <a
                  href={`#${h.id}`}
                  className="para text-[#4b5563] hover:text-blue-500 cursor-pointer"
                >
                  {h.text}
                </a>
                <hr className="mt-[7px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBlog;
