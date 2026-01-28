import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon,
    Type,
    Quote,
    Undo,
    Redo,
    Underline as UnderlineIcon
} from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder }) => {
    const [showMediaModal, setShowMediaModal] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            BubbleMenuExtension,
            FloatingMenuExtension,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-2xl my-8 mx-auto block shadow-xl',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Commencez à rédiger...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] text-slate-300',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const url = window.prompt('URL du lien :');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = (url: string) => {
        editor.chain().focus().setImage({ src: url }).run();
        setShowMediaModal(false);
    };

    return (
        <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900 focus-within:border-blue-500/50 transition-all">
            {/* Toolbar */}
            <div className="bg-slate-800/50 border-b border-slate-700 p-2 flex flex-wrap gap-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Gras"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Italique"
                >
                    <Italic size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Souligné"
                >
                    <UnderlineIcon size={18} />
                </button>

                <div className="w-px h-6 bg-slate-700 mx-1 self-center" />

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Titre 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Titre 2"
                >
                    <Heading2 size={18} />
                </button>

                <div className="w-px h-6 bg-slate-700 mx-1 self-center" />

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Liste à puces"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Liste numérotée"
                >
                    <ListOrdered size={18} />
                </button>

                <div className="w-px h-6 bg-slate-700 mx-1 self-center" />

                <button
                    onClick={setLink}
                    className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                    title="Ajouter un lien"
                >
                    <LinkIcon size={18} />
                </button>
                <button
                    onClick={() => setShowMediaModal(true)}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors"
                    title="Ajouter une image"
                >
                    <ImageIcon size={18} />
                </button>

                <div className="w-px h-6 bg-slate-700 mx-1 self-center" />

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 disabled:opacity-30 transition-colors"
                    title="Annuler"
                >
                    <Undo size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 disabled:opacity-30 transition-colors"
                    title="Rétablir"
                >
                    <Redo size={18} />
                </button>
            </div>

            {/* Bubble Menu (Selection-based) */}
            {editor && (
                <BubbleMenu editor={editor} updateDelay={100} className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 px-3 hover:bg-slate-700 ${editor.isActive('bold') ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 px-3 hover:bg-slate-700 ${editor.isActive('italic') ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        onClick={setLink}
                        className={`p-2 px-3 hover:bg-slate-700 ${editor.isActive('link') ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                        <LinkIcon size={16} />
                    </button>
                </BubbleMenu>
            )}

            {/* Floating Menu (Line-based) */}
            {editor && (
                <FloatingMenu editor={editor} updateDelay={100} className="flex gap-1 p-1 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="p-2 hover:bg-blue-600/20 hover:text-blue-400 rounded-xl text-slate-400 transition-all"
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="p-2 hover:bg-blue-600/20 hover:text-blue-400 rounded-xl text-slate-400 transition-all"
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => setShowMediaModal(true)}
                        className="p-2 hover:bg-blue-600/20 hover:text-blue-400 rounded-xl text-slate-400 transition-all"
                    >
                        <ImageIcon size={18} />
                    </button>
                </FloatingMenu>
            )}

            {/* Editor Content Area */}
            <div className="relative">
                <EditorContent editor={editor} className="tiptap-editor" />
            </div>

            {/* Media Selection Modal */}
            {showMediaModal && (
                <div className="fixed inset-0 z-[300]">
                    <MediaLibrary
                        isModal
                        onClose={() => setShowMediaModal(false)}
                        onSelect={addImage}
                    />
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;
