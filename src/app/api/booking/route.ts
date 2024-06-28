
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import Stripe from "stripe"
// @ts-nocheck
import { Prisma } from "@prisma/client";
const stripe = new Stripe(process.env.STRIPE_KEY || "");
export async function POST(request:Request){
   try{
        const {bookingId, bookingType, userId, taxes , date} = await request.json(); 
        let bookingDetails;
        switch(bookingType){
            case "trips":
        bookingDetails = await prisma.trips.findUnique({
          where: { id: bookingId },
        });
        break;
      case "hotels":
        break;
      case "flights":
        bookingDetails = await prisma.flights.findUnique({
          where: { id: parseInt(bookingId) },
        });  
        break;
        }
        if(bookingDetails){
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: bookingDetails?.from ? (bookingDetails.price+taxes)*82:bookingDetails.price+taxes,
                    currency:"inr",
                    automatic_payment_methods: {
                        enabled: true,
                      },
                })
                console.log(paymentIntent)
        await prisma.bookings.create({
            data: {
              bookingType,
              bookingTypeId: bookingId.toString(),
              user: { connect: { id: userId } },
              paymentIntent: paymentIntent.id,
              totalAmount: paymentIntent.amount,
              date,
            },
          });
          return NextResponse.json(
            {
              client_secret: paymentIntent.client_secret,
            },
            { status: 201 }
          );
        }

   }
   catch(error){
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


export async function PATCH(request: Request) {
    try {
      const { paymentIntent } = await request.json();
  
      if (paymentIntent) {
        await prisma.bookings.update({
          where: { paymentIntent },
          data: {
            isCompleted: true,
          },
        });
        return NextResponse.json(
          {
            status: "Payment Successfull.",
          },
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

  export async function GET() {
    try {
      const bookings = await prisma.bookings.findMany({});
      // Iterate over each booking to fetch additional details based on bookingType
      for (const booking of bookings) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete booking.paymentIntent;
        switch (booking.bookingType) {
          case "hotels":
            const hotel = await prisma.hotels.findUnique({
              where: { id: parseInt(booking.bookingTypeId) },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            booking.name = hotel ? hotel.name : null;
            break;
          case "trips":
            const trip = await prisma.trips.findUnique({
              where: { id: booking.bookingTypeId },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            booking.name = trip ? trip.name : null;
            break;
          case "flights":
            const flight = await prisma.flights.findUnique({
              where: { id: parseInt(booking.bookingTypeId) },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            booking.name = flight ? flight.name : null;
            break;
          default:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            booking.name = null;
        }
      }
  
      return NextResponse.json(
        {
          bookings,
        },
        { status: 201 }
      );
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