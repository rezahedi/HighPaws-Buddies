export default function ChatBubble({className}: {className?: string}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill='none' stroke="currentColor">
        <path d="m4.635 13.5-.007-.006-.006-.007A5.515 5.515 0 0 1 3 9.571 5.565 5.565 0 0 1 8.571 4h6.857c1.518 0 2.883.607 3.895 1.59A5.548 5.548 0 0 1 21 9.667v.002c-.048 3.032-2.598 5.473-5.674 5.473H10.714v4.573L4.634 13.5Z" strokeWidth="2"></path>
      </svg>
    </div>
  )
}
