import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const DraggableSignature = ({ id, x, y }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute',
    left: x,
    top: y,
    cursor: 'grab',
    zIndex: 10
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border-2 border-dashed border-blue-500 bg-blue-50 bg-opacity-70 px-4 py-2 rounded text-blue-600 text-sm font-medium select-none"
    >
      ✍️ Signature Here
    </div>
  )
}

export default DraggableSignature