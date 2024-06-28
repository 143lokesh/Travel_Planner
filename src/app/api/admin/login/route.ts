import { NextResponse } from "next/server";
import {prisma} from '@/lib/index'
import { SignJWT } from "jose";
import {cookies} from "next/headers"
import {SHA256 as sha256} from "crypto-js"

const alg="HS256";
const secret= new TextEncoder().encode(process.env.JWT_KEY as string)
const createToken = async(email:String , userId:number)=>{
    return await new SignJWT({email,userId,isAdmin:true}).setProtectedHeader({
        alg
    }).setExpirationTime("48h").sign(secret);
}

export async function POST(request:Request) {
      try{
           const {email,password}= await request.json();
           if(!email || !password){
            return NextResponse.json({message:"email and password is requires"},{status:400});
           }

           const user = await prisma.admin.findUnique({where:{email,password:sha256(password).toString()}});
           if(!user){
            return NextResponse.json({message:"invalid email or password"},{status:404});
           }
           else{
              const token = await createToken(user.email,user.id);
                cookies().set("access_token",token);
                return NextResponse.json({
                    userInfo:{
                        id:user.id,
                        email:user.email
                    }
                })
           }
      }
      catch(err){
           return NextResponse.json({
            message:"An Unexpected error occured"
           },
           {status:500},
           
           )
      }
}
