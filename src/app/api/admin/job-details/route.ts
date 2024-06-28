import { NextResponse } from "next/server";



export async function GET(request:Request){
    try{
        const jobs = await prisma.jobs.findMany({orderBy:{createdAt:"desc"}});
        const onGoingJobs = await prisma.jobs.findMany({where:{isComplete:false}});
        return NextResponse.json({
            jobs,onGoingJobs:onGoingJobs?.length ?? 0
        },
        {status:200})
    }
    catch(err){
        return NextResponse.json({
            message:"unexpected error occured"
        },
        {status:500}
        )
    }
}