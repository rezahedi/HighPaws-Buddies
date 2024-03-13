import { Close } from "@/components/icons"
import * as Dialog from "@radix-ui/react-dialog";

export default function Modal({
  title = '',
  onClose,
  className,
  children
}: {
  title?: string,
  onClose: () => void,
  className?: string,
  children: React.ReactNode
}) {

  const closeModal = () => {
    // fire onClose event if provided
    onClose && onClose();
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="fixed inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className='fixed inset-0 m-auto max-h-fit w-full sm:w-fit overflow-hidden border border-gray-200 bg-white shadow-lg sm:rounded-lg p-4'
        >
          <Dialog.Close className='absolute top-0 right-0 border-0 p-2' asChild>
            <button onClick={closeModal}><Close className="size-6" /></button>
          </Dialog.Close>
          <Dialog.Title className="text-lg font-semibold text-center mb-4">{title}</Dialog.Title>
          <Dialog.Description className={className}>
            {children}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    // <div className='overlay'>
    //   <div className='modal'>
    //     <button className='close' onClick={closeModal}><Close /></button>
    //     <div className={className}>
    //       {children}
    //     </div>
    //   </div>
    // </div>
  )
}
