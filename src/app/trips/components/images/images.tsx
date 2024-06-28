import React from 'react'
import Image from "next/image";
const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
const Images = ({ images }: { images: string[] }) => {
  const randomImages = [
    "/randomImages/random1.jpg",
    "/randomImages/random2.jpg",
    "/randomImages/random3.jpg",
    "/randomImages/random4.jpg",
    "/randomImages/random5.jpg",
  ];
  shuffleArray(randomImages);
  const getRandomImage = (index: number) => {
    if (images && images[index]) {
      return images[index];
    } else {
      const randomIndex = index % randomImages.length;
      return randomImages[randomIndex];
    }
  };
  return (
    <div className="  px-5 py-5">
    {images && (
      <>
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 xl:col-span-4">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12 sm:col-span-6 xl:col-span-12">
               
                  <Image
                    alt="image"
                    width={610}
                    height={288}
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-2xl"
                    style={{ color: "transparent" }}
                    src={getRandomImage(0)}
                  />
                
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-12 relative">
                
                  <Image
                    alt="image"
                    width={610}
                    height={288}
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-2xl"
                    style={{ color: "transparent" }}
                    src={getRandomImage(1)}
                  />
                
              </div>
            </div>
          </div>
          <div className="col-span-12  md:col-span-6 xl:col-span-4">
           
              <Image
                alt="image"
                width={610}
                height={600}
                decoding="async"
                className="w-full rounded-2xl h-full"
                src={getRandomImage(6)}
                objectFit={"cover"}
              />
            
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <div className="grid grid-cols-12 gap-4 lg:gap-6 h-full">
              <div className="col-span-12  h-full">
               
                  <Image
                    alt="image"
                    width={610}
                    height={288}
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-2xl h-full"
                    style={{ color: "transparent" }}
                    src={getRandomImage(3)}
                  />
                
              </div>
              <div className="col-span-12 sm:col-span-6">
                
                  <Image
                    alt="image"
                    width={610}
                    height={600}
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-2xl h-full"
                    style={{ color: "transparent" }}
                    src={getRandomImage(4)}
                  />
                
              </div>
              <div className="col-span-12 sm:col-span-6">
              
                  <Image
                    alt="image"
                    width={610}
                    height={288}
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-2xl h-full"
                    style={{ color: "transparent" }}
                    src={getRandomImage(5)}
                  />
                
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  )
}

export default Images