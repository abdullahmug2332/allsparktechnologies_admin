import React, { useEffect, useState } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { useParams } from "react-router-dom";
import BlogFaqs from "../components/BlogFaqs";
import authorimg from "../../src/assets/blogauthor.jpg";
import { baseURL } from "../../API/baseURL";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

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
  content: string;
  faqs: Faq[];
}

const DetailBlog: React.FC = () => {
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const { urlName } = useParams();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

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

  // ✅ Parse H2 headings for TOC and add IDs into the actual content HTML
  useEffect(() => {
    if (!blog?.content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2"));

    const tocData = headings.map((h2, index) => {
      const id =
        h2.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") ||
        `section-${index}`;
      h2.setAttribute("id", id); 
      return { id, text: h2.textContent || `Heading ${index + 1}` };
    });

    // ✅ Save updated HTML (with IDs) back into blog
    setBlog((prev) => (prev ? { ...prev, content: doc.body.innerHTML } : prev));
    setToc(tocData);
  }, [blog?.content]);

  // ✅ Smooth scroll
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading) return <h1 className="text-center py-10">Loading...</h1>;
  if (!blog) return <h1 className="text-center py-10">No detail found</h1>;

  return (
    <div
      className={`${toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
        } duration-500 font-semibold ml-auto py-[20px] px-[30px] mt-[40px] space-y-6`}
    >
      <div
        className={`${toggle === true ? "w-[95%] xl:w-[100%]" : "w-[95%] xl:w-[80%]"
          } duration-500 mx-auto flex flex-col md:flex-row`}
      >
        {/* ===== LEFT CONTENT ===== */}
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

          {/* ✅ Render content with IDs added */}
          <div className="blogcontent">
            <div
            className=""
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          </div>
          

          {/* FAQs */}
          <BlogFaqs faqs={blog.faqs} />

          {/* Author */}
          <div className="flex gap-[10px] justify-start items-center mt-6">
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

        {/* ===== RIGHT TABLE OF CONTENTS ===== */}
        <div className="w-full md:w-[25%] hidden md:block p-[20px] max-h-[95vh] overflow-y-auto hide-scrollbar md:sticky top-[40px]">
          <p className="font-semibold mt-[10px] mb-[6px] ml-1 subheading text-black">
            Table of Contents
          </p>
          <hr />
          <div className="flex flex-col gap-[10px] my-[5px]">
            {toc.map((h, i) => (
              <a
                key={i}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(h.id);
                }}
                className="text-left para text-[#4b5563] hover:text-blue-500 cursor-pointer font-[400]"
              >
                {h.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBlog;
