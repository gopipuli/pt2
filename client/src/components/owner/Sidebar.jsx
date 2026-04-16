 import React, { useState } from 'react'
import { assets , ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const {user, axios, fetchUser} =useAppContext()
  const location = useLocation()
  const [image, setImage] = useState(null)

  const updateImage = async () => {  // fixed
     try {
      const formData = new FormData()
      formData.append('image', image)

      const {data} = await axios.post('/api/owner/update-image', formData)
      if(data.success){
         fetchUser()
         toast.success(data.message)
         setImage('')
      }else{
        toast.error(data.message)
      }
     } catch (error) {
      toast.error(error.message)
     }
  }

  return (
    <div className='min-h-screen w-64 border-r flex flex-col items-center pt-8 text-sm'>

      {/* Profile Image */}
<div className="relative group">
  <label htmlFor="image">
    {image || user?.image ? (
      <img
        src={
          image
            ? URL.createObjectURL(image)
            : user?.image
        }
        alt="profile"
        className="w-20 h-20 rounded-full object-cover cursor-pointer"
      />
    ) : (
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
        <span className="text-gray-400 text-xs">
          <img src={assets.users_icon} alt="" />
        </span>
      </div>
    )}

    <input
      type="file"
      id="image"
      hidden
      accept="image/*"
      onChange={(e) => setImage(e.target.files[0])}
    />

    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20 rounded-full">
      <img src={assets.edit_icon} alt="edit" className="w-5" />
    </div>
  </label>
</div>

      {/* Save Button */}
      {image && (
        <button
          onClick={updateImage}
          className='mt-2 px-3 py-1 bg-blue-500 text-white rounded'
        >
          Save
        </button>
      )}

      <p className='mt-3 font-medium'>{user.name}</p>

      {/* Menu Links */}
      <div className='w-full mt-6'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 ${
              location.pathname === link.path
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <img
              src={
                location.pathname === link.path
                  ? link.coloredIcon
                  : link.icon
              }
              alt=""
              className='w-5'
            />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar