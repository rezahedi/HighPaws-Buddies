
export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      border: '1px solid #666',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      {children}
    </div>
  )
}
