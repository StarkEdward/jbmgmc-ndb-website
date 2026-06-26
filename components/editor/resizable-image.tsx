import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useRef, useState } from 'react'

export const ResizableImageExtension = Node.create({
  name: 'resizableImage',
  inline: false, // We make it block-level for easier centering and resizing
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width') || element.style.width || '100%',
        renderHTML: attributes => {
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; max-width: 100%; height: auto; border-radius: 0.5rem;`
          }
        }
      },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  }
})

function ResizableImageComponent(props: any) {
  const { node, updateAttributes, selected } = props
  const [isResizing, setIsResizing] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const handleMouseDown = (e: React.MouseEvent, direction: 'right' | 'left' | 'bottom-right') => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.clientX
    const startWidth = imageRef.current?.clientWidth || 0
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX
      // Only resize based on X diff for simplicity (maintains aspect ratio via CSS auto height)
      let diffX = currentX - startX
      if (direction === 'left') {
        diffX = -diffX
      }
      const newWidth = Math.max(100, startWidth + diffX) // minimum 100px
      updateAttributes({ width: `${newWidth}px` })
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  
  return (
    <NodeViewWrapper className="relative inline-block max-w-full my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        className={`max-w-full h-auto rounded-lg transition-shadow ${selected ? 'ring-4 ring-primary/50' : 'hover:ring-2 hover:ring-primary/30'}`}
        style={{ width: node.attrs.width }}
      />
      
      {/* Drag Handles */}
      {(selected || isResizing) && (
        <>
          {/* Bottom Right Handle */}
          <div
            className="absolute -right-2 -bottom-2 w-5 h-5 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow-md flex items-center justify-center z-10"
            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
          />
          {/* Right Handle */}
          <div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-primary border-2 border-white rounded-full cursor-col-resize shadow-md flex items-center justify-center z-10"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
          {/* Left Handle */}
          <div
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-primary border-2 border-white rounded-full cursor-col-resize shadow-md flex items-center justify-center z-10"
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
        </>
      )}
    </NodeViewWrapper>
  )
}
