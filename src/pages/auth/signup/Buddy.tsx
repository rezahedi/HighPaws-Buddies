type Props = {
  name: string,
  gender: string,
  age: string,
  breed: string,
  weight: string,
  location: string,
  characteristcs: string[],  
  updateFields: (fields: Partial<Props>) => void,
}

export default function Buddy(
  data: Props
) {
  return (
    <>
      <label>
        Buddy Name (required):
        <input name="name" type='text' value={data.name} onChange={e=>data.updateFields({name: e.target.value})} required />
      </label>
      <label>
        Breed (required):
        <input name="breed" type='text' value={data.breed} onChange={e=>data.updateFields({breed: e.target.value})} required />
      </label>
      <label>
        Gender:
        <select id="gender" name="gender" onChange={e=>data.updateFields({gender: e.target.value})}>
          <option value=''>Select</option>
          <option value='Male'>Male</option>
          <option value='Female'>Female</option>
        </select>
      </label>
      <label>
        Age:
        <input id="age" name="age" type='text' value={data.age} onChange={e=>data.updateFields({age: e.target.value})} />
      </label>
      <label>
        Weight:
        <input id="weight" name="weight" type='text' value={data.weight} onChange={e=>data.updateFields({weight: e.target.value})} />
      </label>
      <label>
        Location:
        <input id="location" name="location" type='text' value={data.location} onChange={e=>data.updateFields({location: e.target.value})} />
      </label>
    </>
  )
}
