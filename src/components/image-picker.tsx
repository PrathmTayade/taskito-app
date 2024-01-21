"use client";

import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface ImagePickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

interface UnsplashImage {
  user: any;
  id: string;
  urls: {
    thumb: any;
    full: any;
    regular: string;
  };
  links: {
    html: string;
  };
  alt_description: string;
}

const ImagePicker = ({ id, errors }: ImagePickerProps) => {
  //   const [images, setImages] = useState<Array<Record<string, any | undefined>>>(
  //     []
  //   );
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(
    ""
  );
  const {
    isLoading,
    isError,
    data: images,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await unsplash.photos.getRandom({
        collectionIds: ["310799"],
        count: 9,
      });
      return res.response as UnsplashImage[];
    },
  });

  if (isError) {
    console.log("Failed to get images from unsplash", error);
    return <div>Error {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }
  if (!images) {
    return <div>No Images found</div>;
  }

  console.log(images);
  console.log(selectedImageId);
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image: UnsplashImage) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted"
              //   pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              //   if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              //   disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
              fill
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      {/* <FormErrors id="image" errors={errors} /> */}
      <div>Image picker</div>
    </div>
  );
};

export default ImagePicker;
