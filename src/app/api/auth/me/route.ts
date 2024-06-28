import { decodeJwt, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    try{
      const secret = new TextEncoder().encode(process.env.JWT_KEY as string)
      const token = request.cookies.get("access_token");
      if(token){
        if (!jwtVerify(token?.value, secret)) {
          cookies().delete("access_token")
            return NextResponse.redirect(new URL("/login", request.url));
          }
          const { userId, isAdmin } = decodeJwt(token.value);
          if (!isAdmin) {
            const user = await prisma.user.findUnique({
              where: { id: parseInt(userId as string) },
            });
            if (user) {
              return NextResponse.json(
                {
                  userInfo: {
                    id: user.id,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    email: user.email,
                  },
                },
                { status: 200 }
              );
            }
          } else {
            return NextResponse.json({});
          }
        } else {
          return NextResponse.json({});
        }
    }
    catch(error){
        return NextResponse.json(
          { message: "An unexpected error occurred." },
          { status: 500 }
        );
    }
}