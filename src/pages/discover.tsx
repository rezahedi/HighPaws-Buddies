import { useEffect } from 'react';
import { useAuth } from '@/providers/auth'
import { useNavigate } from 'react-router-dom'

export default function Discover() {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  return (
    <h3 className='font-semibold text-center text-lg p-4'>List of local places or businesses</h3>
  )
}
