import { useAuth } from '@/providers/auth';
import { Link } from 'react-router-dom';

export default function Header() {

  const { authUser, profile, error, loading, logout } = useAuth()

  return (
    <div style={{border:'1px solid #666', padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h1><Link to='/'>HighPaws</Link></h1>
      {authUser && <Link to="/new">New Post</Link>}
      <div>
        {loading && <p>Loading...</p>}
        {!loading &&
          <>
            {error && <p>{error}</p>}
            {profile && <>
              <Link to={`/${profile.id}`}>{profile.name}</Link><br />
              {authUser?.email}<br />
              <button onClick={logout}>Logout</button>
            </>}
            {!authUser && 
            <>
              <Link to="/login">Login</Link>{' '}
              <Link to="/signup">Signup</Link>
            </>}
          </>
        }
      </div>
    </div>
  )
}
