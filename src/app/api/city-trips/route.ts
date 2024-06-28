import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'
// @ts-nocheck
import { Prisma } from "@prisma/client";
export async function GET(request:Request) {
  try {
    const {searchParams} = new URL(request.url);
    const city = searchParams.get("city");
    if(city){
        const alltrips = await prisma.trips.findMany();
        const filteredTrips= alltrips.filter(trip=>{
            const destinationItinerary = trip.destinationItinerary || [];
            return destinationItinerary.some((destination) => destination.place.toLowerCase()=== city.toLowerCase())
        })
    if (filteredTrips) {
        return NextResponse.json(
          {
            trips: filteredTrips,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "Trip not found." }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: "id is required." }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
  return NextResponse.json(
    { message: "An unexpected error occurred." },
    { status: 500 }
  );
}