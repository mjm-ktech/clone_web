"use client";
import React, { useState } from "react";
import {
  WebArchiveData,
  GroupedWebArchiveData,
} from "@/utils/fetchWebArchieveData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchArchivedPageData } from "@/app/actions/fetchWebArchieveAction";
import toast from "react-hot-toast";

interface WebArchiveTableProps {
  rawData: WebArchiveData;
  groupedData: GroupedWebArchiveData;
  wpUrl: string;
}

export function WebArchiveTable({
  rawData,
  groupedData,
  wpUrl,
}: WebArchiveTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal visibility
  const [headers] = rawData;
  const years = Object.keys(groupedData).sort().reverse();

  async function handleCloneData(
    original: string,
    endtimestamp: string,
    isCreatePost: boolean
  ) {
    setIsModalOpen(true); // Open the modal

    if (!wpUrl) {
      toast.error("Vui lòng nhập URL trên trang web");
      setIsModalOpen(false);
      return;
    }

    // Kiểm tra cấu trúc URL
    const wpUrlPattern = /^https?:\/\/[^/]+\/wp-json$/;
    if (!wpUrlPattern.test(wpUrl)) {
      toast.error(
        "URL không hợp lệ. Vui lòng nhập URL có dạng https://your-url.com/wp-json"
      );
      setIsModalOpen(false);
      return;
    }

    // Simulate an API call
    await fetchArchivedPageData(original, endtimestamp, isCreatePost, wpUrl)
      .then(() => toast.success("Data cloned successfully!"))
      .catch((e) => toast.error(e))
      .finally(() => setIsModalOpen(false));
  }

  return (
    <div className="container mx-auto p-4">
      <Accordion type="single" collapsible className="w-full">
        {years.map((year) => (
          <AccordionItem key={year} value={year}>
            <AccordionTrigger className="text-xl font-semibold">
              {year} ({groupedData[year].length} entries)
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                      <TableHead>Action</TableHead> {/* Add Action Header */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedData[year].map((entry, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {entry.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                        <TableCell>
                          <button
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() =>
                              handleCloneData(entry[0], entry[3], true)
                            }
                          >
                            Crawl and create Post
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() =>
                              handleCloneData(entry[0], entry[3], false)
                            }
                          >
                            Crawl and create Page
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-gray-700 text-lg font-semibold">
              Processing...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Simulated API Call
