// TODO: Create api endpoint to create a new post
// TODO: Handle file upload to CDN on the server
// TODO: Data validation

import { newPostProp } from "@/types/firestore"
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { db, storage } from '@/firebase'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"
import { useEffect, useState, useRef, useCallback } from "react"
import AvatarEditor from 'react-avatar-editor'
import { useDropzone } from 'react-dropzone'
import exifr from 'exifr'
import '@/styles/New.css'

export default function NewPost({onCancel}: {onCancel?: () => void}) {

  const navigate = useNavigate()
  const { profile } = useAuth()
  const [image, setImage] = useState<string | null>()
  const maxSize2MB = 2097152
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const croppedImageRef = useRef<AvatarEditor>(null)
  const [shareLocation, setShareLocation] = useState<boolean>(false)
  const [location, setLocation] = useState<string>('')

  useEffect(() => {
    if( profile === null ) return navigate('/login')
  }, [profile])

  // useEffect(() => {
  //   console.log("image:", image)
  // }, [image])

  useEffect(() => {
    if( shareLocation && location === '' ){
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`)
      }, (error) => {
        console.error("Error getting location:", error)
      })
    }
  }, [shareLocation])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if( profile === null ) return null

    const docRef = doc(collection(db, `profiles/${profile.id}/posts`))
    const formData: FormData = new FormData(e.currentTarget)
    let imageUploadedURL = ''

    // Handle image upload to Firebase Storage
    if ( image ){

      // Get cropped image blob from canvas
      const croppedImageElement = croppedImageRef.current?.getImage()
      if( !croppedImageElement )
        return console.error("Error getting cropped image")
      const croppedImageDataURL = croppedImageElement.toDataURL('image/jpeg', 0.8)

      // TODO: Upload image blob `image` to Firebase Storage with a randon hash as filename
      const storageRef = ref(storage, `images/${docRef.id}.jpg`)
      // const snapshot = await uploadBytes(storageRef, Buffer.from(image.blob))
      const snapshot = await uploadString(storageRef, croppedImageDataURL, 'data_url')
      
      await getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        imageUploadedURL = downloadURL
      });
    }

    if( !imageUploadedURL )
      return console.error("Error uploading image, try again.")

    // TODO: Sanitize data
    const newPost: newPostProp = {
      title: formData.get('title') as string,
      media_url: imageUploadedURL,
      location: location,
      profile_detail: {
        avatar_url: profile.avatars.buddy ?? '',
        name: profile.name ?? ''
      },
      profile_id: doc(db, `profile/${profile.id}`),
      published_at: Timestamp.fromDate( new Date() ),
      stats: {
        likes: 0,
        comments: 0
      },
      liked: false,
      private: false
    }

    await setDoc(docRef, newPost)
    console.log( "post created:", docRef.id )
    navigate('/')
  }


  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    if(acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if( !file ) return

      if ( file.size > maxSize2MB ) {
        console.error("File size too big (max 2MB)");
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {

          // Get EXIF data
          const imageLocation = await exifr.gps(event.target?.result as string)
          if (imageLocation)
            setLocation(`${imageLocation.latitude.toFixed(4)}, ${imageLocation.longitude.toFixed(4)}`)
          // let orientation = await exifr.orientation(file)

          setImage( event.target?.result as string );
        };
        reader.readAsDataURL(file);
      }
    }
  }, [])

  const handleImageRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setImage(null)
    setLocation('')
    setShareLocation(false)
  }

  const handleShareLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShareLocation(!shareLocation)
  }

  const onDragEnter = () => {
    document.getElementsByClassName('dragArea')[0].classList.add('dragEnter')
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if( e.currentTarget === e.target )
      document.getElementsByClassName('dragArea')[0].classList.remove('dragEnter')
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
    onError: (err) => console.error(err.message)
  })

  function adjustTextareaHeight(e: React.FormEvent<HTMLTextAreaElement>) {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = (e.currentTarget.scrollHeight)+'px';
  }

  if ( profile === null ) return null

  return (
    <div className="newPost">
      <form onSubmit={(e) => handleSubmit(e)}>
        <main>
          {image && 
          <div className="cropArea">
            <AvatarEditor
              ref={croppedImageRef}
              style={{width: '100%', height: 'auto'}}
              image={image}
              // image={this.state.image}
              width={1080}
              height={1080}
              border={0}
              scale={1}
              rotate={0}
              />
            <button onClick={handleImageRemove} className="remove">Remove</button>
            <div className="location">
              <button onClick={handleShareLocation}>{shareLocation ? `Location will share` : `Share Location?`}</button>
              {location}
            </div>
          </div>
          }
          {!image && <div ref={dragAreaRef} {...getRootProps()} className="dragArea">
            <div>Drop your image here</div>
            <input {...getInputProps()} />
          </div>}
          <div className="text">
            <img src={profile.avatars.buddy} alt="avatar" className="avatar" />
            <textarea name="title" placeholder="What's happening?!" rows={2} maxLength={256} onInput={adjustTextareaHeight}></textarea>
          </div>
        </main>
        <div className="space-x-2">
          {onCancel && <button onClick={onCancel}>Cancel</button>}
          <button type="submit" className="primary">Post</button>
        </div>
      </form>
    </div>
  )
}
