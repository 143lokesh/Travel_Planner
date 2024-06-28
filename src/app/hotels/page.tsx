"use client";
import { useAppStore } from "@/store";
import { HotelType } from "@/types/hotel";
import { USER_API_ROUTES } from "@/utils/api-routes";
import { Button } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
const Hotels = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const city = searchParams.get("city");
  console.log("city:",city)
  const {setScraping,  userInfo } = useAppStore();
  const bookHotel = async (hotelId: number) => {
    const isoDate = date
      ? new Date(date).toISOString()
      : new Date().toISOString();

    const response = await axios.post(USER_API_ROUTES.CREATE_BOOKING, {
      bookingId: hotelId,
      bookingType: "hotels",
      userId: userInfo?.id,
      taxes: 30,
      date: isoDate,
    });

    if (response.data.client_secret) {
      router.push(`/checkout?client_secret=${response.data.client_secret}`);
    }
  };
  setTimeout(()=>{
   setScraping(false)
  },2000);
  

  return (
    <div className="m-10 px-[20vw] min-h-[80vh]">
      <Button
        className="my-5"
        variant="shadow"
        color="primary"
        size="lg"
        onClick={() => router.push("/search-hotels")}
      >
        <FaChevronLeft />
        Go Back
      </Button>
      <div className=" flex flex-col gap-5">
          <div>
            <div className="grid grid-cols-3 gap-10">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((hotel,id) => {
                return (
                  <div
                    key={id}
                    className="flex flex-col items-center justify-center cursor-pointer shadow-md rounded-2xl p-4 border border-neutral-200"
                  >
                    <div className="mb-3  relative w-full h-48">
                      <Image
                        src={`/hotels/cityHotel${hotel}.jpg`}
                        alt="hotel"
                        fill
                        className="rounded-2xl"
                      />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1">
                      <h3 className="font-semibold capitalize text-neutral-900  text-base">
                        { 'hotel-'+ (id+1) + " "+ city}
                      </h3>
                      <span className="text-sm text-neutral-500 font-normal">
                        <strong className="text-black">${(id+1)*2348}</strong>{" "}
                        /night
                      </span>
                      <Button
                        size="md"
                        variant="ghost"
                        color="danger"
                        className="mt-2"
                        onClick={() => userInfo && bookHotel((id+1)*2348)}
                      >
                        {!userInfo ? "Login to Book Now" : "Book Now"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default Hotels;