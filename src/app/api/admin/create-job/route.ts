import { prisma,jobsQueue } from "@/lib";
import { NextResponse } from "next/server";



export async function POST(request:Request){
    try{
        const {url, jobType} = await request.json();
        const response = await prisma.jobs.create({data:{url,jobType}});
        await jobsQueue.add("new Location",{url,jobType,id:response.id})
        return NextResponse.json(
            {
              jobCreated: true,
            },
            { status: 201 }
          );
    }
    catch(err){
        return NextResponse.json({
            message:"unexpected error occured"
        },
        {status:500}
        )
    }
}