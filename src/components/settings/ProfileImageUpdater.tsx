'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone';
import { EditImage, Loading } from '@/components/icons';
import { readBlob, resizeImage, uploadAvatarToStorage } from "@/providers/utils";
import { toast } from 'sonner';

export default function ProfileImageUpdater( { id, img, name }: { id: string, img: string, name: string } )
{
  const [image, setImage] = React.useState<string | null>()
  const [loading, setLoading] = React.useState(false)
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const maxSize2MB = 2097152

  useEffect(() => {
    if(!image) return

    (async () => {
      setLoading(true)
      const url = await uploadAvatarToStorage(image, id, `${name}.jpg`)
      setLoading(false)
      if( !url )
        toast.error("Failed to update picture, Please try again.")
      else
        toast.success("Profile picture updated.")
    })()

  }, [image])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if(acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if( !file ) return

      if ( file.size > maxSize2MB ) {
        toast.error("File size too big (max 2MB)");
      } else {
        let content = await readBlob(file)
        // Crop image to fit 160x160
        content = await resizeImage(content, 160, 160)
        setImage(content)
      }
    }
  }, [])

  const onDragEnter = () => {
    dragAreaRef.current?.classList.add('border-dashed')
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if( e.currentTarget === e.target )
      dragAreaRef.current?.classList.remove('border-dashed')
  }

  // Init dropzone
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    onDragEnter,
    onDragLeave,
    maxFiles: 1,
    onDrop,
    onError: (err) => toast.error(err.message)
  })

  return (
    <div {...getRootProps()} ref={dragAreaRef} className='group rounded-full size-36 relative cursor-pointer drag self-center border-4 border-black/50'>
      <img src={image ? image : img} alt='Profile Avatar' width={160} height={160} className="rounded-full w-full h-full object-cover" />
      {!loading && <EditImage className='size-10 p-2 rounded-full text-white opacity-75 group-hover:opacity-100 bg-black/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />}
      {loading && <Loading className='size-10 text-[#f06a1d] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />}
      <input name='image' {...getInputProps()} />
    </div>
  )
}
