import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useRef, useState, useEffect } from 'react'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

export const ResizableImageExtension = Node.create({
  name: 'resizableImage',
  inline: false, // block level
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
          }
        }
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => {
          return {
            'data-align': attributes.align,
          }
        }
      }
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    let alignmentClass = 'flex justify-center'
    if (HTMLAttributes['data-align'] === 'left') alignmentClass = 'flex justify-start'
    if (HTMLAttributes['data-align'] === 'right') alignmentClass = 'flex justify-end'
    
    return [
      'div', 
      { class: `w-full my-4 ${alignmentClass}` }, 
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'rounded-lg max-w-full h-auto', style: `width: ${HTMLAttributes.width};` })]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  }
})

function ResizableImageComponent(props: any) {
  const { node, updateAttributes, selected } = props
  const [isResizing, setIsResizing] = useState(false)
  const [currentWidth, setCurrentWidth] = useState(node.attrs.width)
  const imageRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    if (!isResizing) {
      setCurrentWidth(node.attrs.width)
    }
  }, [node.attrs.width, isResizing])

  const handleMouseDown = (e: React.MouseEvent, direction: 'right' | 'left' | 'bottom-right') => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.clientX
    const startWidth = imageRef.current?.clientWidth || 0
    let finalWidth = `${startWidth}px`
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX
      let diffX = currentX - startX
      if (direction === 'left') {
        diffX = -diffX
      }
      const newWidth = Math.max(100, startWidth + diffX)
      finalWidth = `${newWidth}px`
      setCurrentWidth(finalWidth)
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      updateAttributes({ width: finalWidth })
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  
  const align = node.attrs.align || 'center'
  let alignmentClass = 'justify-center'
  if (align === 'left') alignmentClass = 'justify-start'
  if (align === 'right') alignmentClass = 'justify-end'
  
  return (
    <NodeViewWrapper className={`w-full flex ${alignmentClass} my-4`} data-drag-handle="true">
      <div className="relative inline-block max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
          className={`max-w-full h-auto rounded-lg transition-shadow ${selected ? 'ring-4 ring-primary/50' : 'hover:ring-2 hover:ring-primary/30'}`}
          style={{ width: currentWidth }}
        />
        
        {/* Alignment Toolbar */}
        {selected && !isResizing && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700 shadow-xl rounded-lg p-1 z-20">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); updateAttributes({ align: 'left' }); }}
              className={`p-1.5 rounded-md ${align === 'left' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); updateAttributes({ align: 'center' }); }}
              className={`p-1.5 rounded-md ${align === 'center' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); updateAttributes({ align: 'right' }); }}
              className={`p-1.5 rounded-md ${align === 'right' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Drag Handles */}
        {(selected || isResizing) && (
          <>
            <div
              className="absolute -right-2 -bottom-2 w-5 h-5 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow-md flex items-center justify-center z-10"
              onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
            />
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-primary border-2 border-white rounded-full cursor-col-resize shadow-md flex items-center justify-center z-10"
              onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
            <div
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-primary border-2 border-white rounded-full cursor-col-resize shadow-md flex items-center justify-center z-10"
              onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}
