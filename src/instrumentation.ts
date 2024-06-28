import { Browser } from "puppeteer";
import { startLocationScraping, startPackageScraping } from "./scraping";
import prisma from "./lib/prisma";
import { startFlightScraping } from "./scraping/flightScraping";
import { startHotelScraping } from "./scraping/hotelScraping";

export const register = async()=>{
    if(process.env.NEXT_RUNTIME==="nodejs"){
        const {Worker} = await import("bullmq");
        const {connection} = await import ("@/lib");
        const puppeteer = await import ("puppeteer");
        const { jobsQueue } = await import("./lib/queue");
        const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_85076da5-zone-arkalyte_browser:ctk802n9xhze@brd.superproxy.io:9222';
        new Worker("jobsQueue", async(job)=>{
            let browser : undefined | Browser =undefined;
            browser =await puppeteer.connect({
              browserWSEndpoint: SBR_WS_ENDPOINT,
           })
            try{

              const admin = await prisma.admin.count();
              console.log({ admin });
              if (!admin) {
                console.log("in if");
                const data = await prisma.admin.create({
                  data: {
                    email: "lokesh@gmail.com",
                    password:
                      "982945308d3682d16636fd628c314e293499e99c00120acd9b693f5ab16e1648",
                  },
                });
              }


              const page = await browser.newPage();
              if (job.data.jobType.type === "Location") {
                console.log("Connected! Navigating to " + job.data.url);
                await page.goto(job.data.url,{timeout:120000});
                console.log("Navigated! Scraping page content...");
                const packages = await startLocationScraping(page);
                await prisma.jobs.update({
                  where: { id: job.data.id },
                  data: { isComplete: true, status: "complete" },
                });
                for (const pkg of packages) {
                  const jobCreated = await prisma.jobs.findFirst({
                    where: {
                      url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                    },
                  });
                  if (!jobCreated) {
                    const job = await prisma.jobs.create({
                      data: {
                        url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                        jobType: { type: "package" },
                      },
                    });
                    jobsQueue.add("package", { ...job, packageDetails: pkg });
                  }
                }
              } else if (job.data.jobType.type === "package") {
                const alreadyScrapped = await prisma.trips.findUnique({
                  where: { id: job.data.packageDetails.id },
                });
                if (!alreadyScrapped) {
                  console.log("Connected! Navigating to " + job.data.url);
                  await page.goto(job.data.url, { timeout: 120000 });
                  console.log("Navigated! Scraping page content...");
                  const pkg = await startPackageScraping(
                    page,
                    job.data.packageDetails
                  );
                  console.log(pkg)
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  await prisma.trips.create({ data: pkg });
                  await prisma.jobs.update({
                    where: { id: job.data.id },
                    data: { isComplete: true, status: "complete" },
                  });
                }
              } 
              // flights
              else if (job.data.jobType.type === "flight") {
                console.log("in flight scraping");
                console.log("Connected! Navigating to " + job.data.url);
                await page.goto(job.data.url,{timeout:120000});
                console.log("Navigated! Scraping page content...");
               const flights = await startFlightScraping(page);
                await prisma.jobs.update({
                  where: { id: job.data.id },
                  data: { isComplete: true, status: "complete" },
                });
               console.log(flights)
                for (const flight of flights) {
                  await prisma.flights.create({
                    data: {
                      name: flight.airlineName,
                      logo: flight.airlineLogo,
                      from: job.data.jobType.source,
                      to: job.data.jobType.destination,
                      departureTime: flight.departureTime,
                      arrivalTime: flight.arrivalTime,
                      duration: flight.flightDuration,
                      price: flight.price,
                      jobId: job.data.id,
                    },
                  });
                }
              } 
              // hotels
              else if (job.data.jobType.type === "hotels") {
                console.log("Connected! Navigating to " + job.data.url);
                await page.goto(job.data.url, { timeout: 120000 });
                console.log("Navigated! Scraping page content...");
                const hotels = await startHotelScraping(
                  page,
                  browser,
                  job.data.jobType.location
                );
    
                console.log(`Scraping Complete, ${hotels.length} hotels found.`);
    
                await prisma.jobs.update({
                  where: { id: job.data.id },
                  data: { isComplete: true, status: "complete" },
                });
    
                console.log("Job Marked as complete.");
                console.log("Starting Loop for Hotels");
                for (const hotel of hotels) {
                  await prisma.hotels.create({
                    data: {
                      name: hotel.title,
                      image: hotel.photo,
                      price: hotel.price,
                      jobId: job.data.id,
                      location: job.data.jobType.location.toLowerCase(),
                    },
                  });
                  console.log(`${hotel.title} inserted in DB.`);
                }

                console.log("COMPLETE.");
              }
            }
            
        
            catch(err){
                  console.log(err);
                  await prisma.jobs.update({
                    where:{id:job.data.id}
                  ,data:{isComplete:true , status:"failed"}
            })
            }
            finally{
                await browser?.close();
                console.log("browser closed successfully");
            }
            

        },{
            connection,concurrency:10, removeOnComplete:{count:1000},
            removeOnFail:{count:5000},
        })
    }
}