"use client";

import { unsplash, unsplashimages } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { RadioGroupItem } from "./ui/radio-group";
import { ControllerRenderProps } from "react-hook-form";

interface ImagePickerProps {
  errors?: Record<string, string[] | undefined>;
  field: ControllerRenderProps<
    {
      title: string;
      image: string;
    },
    "image"
  >;
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

const ImagePicker = ({ errors, field }: ImagePickerProps) => {
  const {
    isLoading,
    isError,
    data: images,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      // const res = await unsplash.photos.getRandom({
      //   collectionIds: ["310799"],
      //   count: 9,
      // });
      const res = unsplashimages;
      // return res.response as UnsplashImage[];
      return res as UnsplashImage[];
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
  return (
    <div className="relative">
      <RadioGroup
        onValueChange={field.onChange}
        // defaultValue={field.value}
        className="grid grid-cols-3 gap-2 mb-2"
      >
        {images.map((image: UnsplashImage) => (
          <FormItem
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted"
              //   pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
          >
            <FormControl>
              <RadioGroupItem
                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                className="hidden"
              />
            </FormControl>
            <FormLabel>
              <Image
                src={image.urls.thumb}
                alt="Unsplash image"
                className="object-cover rounded-sm"
                fill
              />
              {field.value ===
                `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}` && (
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
            </FormLabel>
          </FormItem>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ImagePicker;
