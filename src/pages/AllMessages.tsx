"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Link } from "react-router-dom";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at?: string;
}

const AllMessages: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const toggle = useSelector((state: RootState) => state.toggle.value);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${baseURL}/contact-messages`);
        setMessages(res.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div
      className={`${toggle === false
          ? "w-full"
          : "md:w-[80%] lg:w-[82%] xl:w-[85%] 2xl:w-[87%]"
        } duration-500 ml-auto py-[20px] px-[30px] mt-[40px]`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h2 className="text-[33px] font-semibold mb-4">Contact Messages</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#18185E] font-semibold">ID</TableHead>
                <TableHead className="text-[#18185E] font-semibold">Name</TableHead>
                <TableHead className="text-[#18185E] font-semibold">Email</TableHead>
                <TableHead className="text-[#18185E] font-semibold">Phone</TableHead>
                <TableHead className="text-[#18185E] font-semibold">Service</TableHead>
                <TableHead className="text-[#18185E] font-semibold">Message</TableHead>
                <TableHead className="text-[#18185E] font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                
                  <TableRow key={msg.id} className="cursor-pointer">
                    <TableCell className="font-semibold"><Link to={`/message/${msg.id}`}> {msg.id}  </Link></TableCell>
                    <TableCell className="font-semibold"><Link to={`/message/${msg.id}`}> {msg.name}  </Link></TableCell>
                    <TableCell className="font-semibold"><Link to={`/message/${msg.id}`}> {msg.email}  </Link></TableCell>
                    <TableCell className="font-semibold"><Link to={`/message/${msg.id}`}> {msg.phone || "-"}  </Link></TableCell>
                    <TableCell className="font-semibold"><Link to={`/message/${msg.id}`}> {msg.service || "-"}  </Link></TableCell>
                    <TableCell className="max-w-[200px] truncate font-semibold">
                      <Link to={`/message/${msg.id}`}> {msg.message}  </Link>
                    </TableCell>
                    <TableCell className="font-semibold">
                      <Link to={`/message/${msg.id}`}> {msg.created_at
                        ? new Date(msg.created_at).toLocaleString()
                        : "-"}  </Link>
                    </TableCell>
                  </TableRow>
              
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllMessages; // ✅ correct
