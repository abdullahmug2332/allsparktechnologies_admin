"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at?: string;
}

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // get id from URL
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const toggle = useSelector((state: RootState) => state.toggle.value);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(`${baseURL}/contact-messages/${id}`);
        setMessage(res.data); // depends on your API response
      } catch (error) {
        console.error("Error fetching message:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMessage();
  }, [id]);
  console.log(message)

  return (
    <div
      className={`${
        toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
      } duration-500 ml-auto py-[20px] px-[30px] mt-[40px]`}
    >
      {isLoading ? (
        <Loader />
      ) : message ? (
        <div className="space-y-3 mt-[30px] p-5 shadow-xl">
          <h2 className="text-[30px] font-[700]">Message Detail</h2>
          <p className="text-[#2e2e2e] font-[500]"><strong>ID:</strong> {message.id}</p>
          <p className="text-[#2e2e2e] font-[500]"><strong>Name:</strong> {message.name}</p>
          <p className="text-[#2e2e2e] font-[500]"><strong>Email:</strong> {message.email}</p>
          <p className="text-[#2e2e2e] font-[500]"><strong>Phone:</strong> {message.phone || "-"}</p>
          <p className="text-[#2e2e2e] font-[500]"><strong>Service:</strong> {message.service || "-"}</p>
          <p className="text-[#2e2e2e] font-[500]"><strong>Message:</strong> {message.message}</p>
          <p className="text-[#2e2e2e] font-[500]"><strong>Date:</strong> {message.created_at ? new Date(message.created_at).toLocaleString() : "-"}</p>
        </div>
      ) : (
        <p>No message found.</p>
      )}
    </div>
  );
};

export default MessageDetail;
