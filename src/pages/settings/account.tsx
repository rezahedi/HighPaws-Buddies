import { useState } from 'react'
import { useAuth } from "@/providers/auth"
import { profileProp } from "@/types/firestore"
import { db } from '@/firebase';
import { updateDoc, doc } from "firebase/firestore"
import { Loading } from '@/components/icons';

export default function Account() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)

  if(!profile) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!profile) return console.error('No profile found')

    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const updatedProfile: profileProp = profile;

    // TODO: Add validation
    // TODO: Add data sanitization

    updatedProfile.name = data.get('buddy')?.toString() || '';
    updatedProfile.owner = data.get('owner')?.toString() || '';
    updatedProfile.breed = data.get('breed')?.toString() || '';
    updatedProfile.gender = data.get('gender')?.toString() || '';
    updatedProfile.age = data.get('age')?.toString() || '';
    updatedProfile.weight = data.get('weight')?.toString() || '';
    updatedProfile.location = data.get('location')?.toString() || '';

    // update /profiles/{profile.id}

    const docRef = doc(db, `/profiles/${profile.id}`)
    await updateDoc(docRef, updatedProfile)

    setLoading(false)
  }

  return (
    <div className="post">
      <h3 className="text-center text-2xl font-semibold text-gray-800 mb-4">Edit Account</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Buddy Name (required):
          <input name="buddy" type='text' defaultValue={profile.name} required className="bg-gray-50" />
        </label>
        <label>
          Owner Name (required):
          <input name="owner" type='text' defaultValue={profile.owner} required className="bg-gray-50" />
        </label>
        <label>
          Breed (required):
          <input name="breed" type='text' defaultValue={profile.breed} required className="bg-gray-50" />
        </label>
        <label>
          Gender:
          <select name="gender" defaultValue={profile.gender} className="bg-gray-50">
            <option value=''>Select</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
        </label>
        <label>
          Age:
          <input name="age" type='text' defaultValue={profile.age} className="bg-gray-50" />
        </label>
        <label>
          Weight:
          <input name="weight" type='text' defaultValue={profile.weight} className="bg-gray-50" />
        </label>
        <label>
          Location:
          <input name="location" type='text' defaultValue={profile.location} className="bg-gray-50" />
        </label>
        <div className="flex justify-end items-center mt-4 space-x-2 text-right">
          {loading && <Loading className="inline-block size-6 text-[#f06a1d]" />}
          <button className="primary" disabled={loading}>Update Profile</button>
        </div>
      </form>
    </div>
  )
}
