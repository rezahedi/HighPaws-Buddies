import { useAuth } from '@/providers/auth';
import { Link } from 'react-router-dom';

export default function Header() {

  const { authUser, error, loading, logout } = useAuth()

  return (
    <div style={{border:'1px solid #666', padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h1><Link to='/'>HighPaws</Link></h1>
      {authUser && <Link to="/new">New Post</Link>}
      <div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {authUser && <>{authUser.email} <button onClick={logout}>Logout</button></>}
        {!authUser && <Link to="/login">Login</Link>}
      </div>
    </div>
  )
}
