import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { jobsQueue } from "@/lib";
import prisma from "../../../../lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const destination = searchParams.get("destination");
    const date = searchParams.get("date");
    const flights = await prisma.flights.findMany({
      where : {from : source, to:destination }
    }) 
    console.log(flights)

    const url = `https://www.kayak.com/flights/${source}-${destination}/${date}`+"?sort=bestflight_a";
    const response = await prisma.jobs.create({
      data: { url, jobType: { type: "flight", source, destination, date } },
    });
    await jobsQueue.add("new location", {
      url,
      jobType: { type: "flight", source, destination, date },
      id: response.id,
    });
     if(flights.length>0){
      return NextResponse.json(
        { flights:flights,
           id: response.id },
        { status: 200 }
      );
     }else{
      return NextResponse.json(
        { msg: "Job Running", id: response.id },
        { status: 200 }
      );
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