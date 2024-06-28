/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        instrumentationHook:true,
    },
    typescript:{
       ignoreBuildErrors:true,
    },
    eslint:{
         ignoreBuildErrors:true,
    },
    env:{
        NEXT_PUBLIC_DOMAIN:"http://localhost:3000",
        NEXT_PUBLIC_STRIPE_PUBLIC_KEY:"pk_test_51NyXGISAGc45qq2EULeY9QBIuz1F88dukV4trHyG7PDU0lkG136odaOw8vvbR9jxpLs31RuQHxBItWRDvI5MGdkF009pgM6GCT"
    },
    images:{
        remotePatterns:[
            {hostname:"imgcld.yatra.com"},
            {
                hostname: "content.r9cdn.net",
              },
              {
                hostname:"www.google.com"
              }
        ]
    }
};

export default nextConfig;
