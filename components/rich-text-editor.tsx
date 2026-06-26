"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, Table as TableIcon,
  Columns, Rows, MinusSquare, Image as ImageIcon, Loader2
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }

  const toggleBtnClass = (isActive: boolean) =>
    `p-2 rounded-md transition-colors ${
      isActive 
        ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    } disabled:opacity-50 disabled:cursor-not-allowed`

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadRes.ok) throw new Error('Upload failed')
      
      const uploadData = await uploadRes.json()
      
      if (uploadData.url) {
        editor.chain().focus().setImage({ src: uploadData.url }).run()
      } else {
        throw new Error('No URL returned')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toggleBtnClass(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toggleBtnClass(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={toggleBtnClass(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={toggleBtnClass(editor.isActive('strike'))}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={toggleBtnClass(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toggleBtnClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toggleBtnClass(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleBtnClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleBtnClass(editor.isActive('orderedList'))}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toggleBtnClass(editor.isActive('blockquote'))}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={toggleBtnClass(false)}
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className={toggleBtnClass(false)}
          disabled={!editor.can().addColumnAfter()}
          title="Add Column After"
        >
          <Columns className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className={toggleBtnClass(false)}
          disabled={!editor.can().addRowAfter()}
          title="Add Row After"
        >
          <Rows className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className={toggleBtnClass(false)}
          disabled={!editor.can().deleteTable()}
          title="Delete Table"
        >
          <MinusSquare className="w-4 h-4 text-red-500 hover:text-red-600" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-1">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={toggleBtnClass(false)}
          title="Insert Image"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={toggleBtnClass(false)}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={toggleBtnClass(false)}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full shadow-md my-4',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
  })

  // Sync external changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-1 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all h-full shadow-inner">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
