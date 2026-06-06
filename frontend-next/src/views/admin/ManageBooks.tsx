"use client";
// src/views/admin/ManageBooks.tsx
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2, BookOpen } from "lucide-react"
import { useForm } from "react-hook-form"
import { createBook, updateBook, deleteBook } from "../../api/books.api"
import { getCategories } from "../../api/categories.api"
import { getAdminBooks, toggleBookActive } from "../../api/admin.api"
import { getApiErrorMessage } from "../../lib/api-error"
import { queryKeys } from "../../lib/query-keys"
import AdminLayout from "../../components/admin/AdminLayout"
import { toast } from "react-toastify";
import type { Book } from "../../types"

interface BookForm {
    title:         string
    description:   string
    author:        string
    publisher:     string
    category:      string
    price:         number
    originalPrice: number
    stock:         number
    pages:         number
    language:      string
    isbn:          string
    isFeatured:    boolean
    isBestseller:  boolean
    coverImage:    FileList | null
}

const ManageBooks = () => {
    const queryClient = useQueryClient()
    const [search,    setSearch]    = useState("")
    const [page,      setPage]      = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [editBook,  setEditBook]  = useState<Book | null>(null)
    const [loading,   setLoading]   = useState(false)
    const [deleteId,  setDeleteId]  = useState<string | null>(null)

    const { register, handleSubmit, reset, setValue } = useForm<BookForm>()

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.adminBooks(search, page),
        queryFn: () => getAdminBooks(page, 10, search),
    })

    const { data: categories } = useQuery({
        queryKey: queryKeys.categories,
        queryFn: getCategories,
    })

    const books:      Book[]  = data?.books      || []
    const totalPages: number  = data?.totalPages  || 1

    const openAdd = () => {
        setEditBook(null)
        reset()
        setShowModal(true)
    }

    const openEdit = (book: Book) => {
        setEditBook(book)
        setValue("title",         book.title)
        setValue("description",   book.description)
        setValue("author",        book.author)
        setValue("publisher",     book.publisher || "")
        setValue("category",      typeof book.category === "object" ? book.category._id : book.category)
        setValue("price",         book.discountPrice > 0 ? book.discountPrice : book.price)
        setValue("originalPrice", book.discountPrice > 0 ? book.price : 0)
        setValue("stock",         book.stock)
        setValue("pages",         book.pages || 0)
        setValue("language",      book.language)
        setValue("isbn",          book.isbn || "")
        setValue("isFeatured",    book.isFeatured)
        setValue("isBestseller",  book.isBestseller)
        setShowModal(true)
    }

    const onSubmit = async (data: BookForm) => {
        try {
            setLoading(true)
            
            // Extract the actual File object from the FileList
            const payload: any = { ...data }
            if (data.coverImage && data.coverImage.length > 0) {
                payload.coverImage = data.coverImage[0]
            } else {
                delete payload.coverImage // Dont send empty field if not updated
            }

            // Map UI fields to backend fields
            const uiPrice = Number(data.price)
            const uiOrigPrice = Number(data.originalPrice || 0)
            
            if (uiOrigPrice > uiPrice) {
                payload.price = uiOrigPrice
                payload.discountPrice = uiPrice
            } else {
                payload.price = uiPrice
                payload.discountPrice = 0
            }
            delete payload.originalPrice

            if (editBook) {
                await updateBook(editBook._id, payload)
                toast.success("Book updated!")
            } else {
                await createBook(payload)
                toast.success("Book added!")
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.adminBooksRoot })
            setShowModal(false)
            reset()
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "failed"))
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this book?")) return
        try {
            setDeleteId(id)
            await deleteBook(id)
            queryClient.invalidateQueries({ queryKey: queryKeys.adminBooksRoot })
            toast.success("Book deleted!")
        } catch {
            toast.error("Failed!")
        } finally {
            setDeleteId(null)
        }
    }

    const handleToggle = async (id: string) => {
        try {
            await toggleBookActive(id)
            queryClient.invalidateQueries({ queryKey: queryKeys.adminBooksRoot })
            toast.success("Status updated!")
        } catch {
            toast.error("Failed!")
        }
    }

    return (
        <AdminLayout title="Manage Books">
            <style>
                {`
                .books-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .books-header {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .books-search {
                    width: 100%;
                }
                .books-add-btn {
                    width: 100%;
                    justify-content: center;
                }
                .modal-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .modal-content-pad {
                    padding: 20px;
                }
                @media (min-width: 640px) {
                    .books-container {
                        gap: 24px;
                    }
                    .books-header {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .books-search {
                        width: 300px;
                    }
                    .books-add-btn {
                        width: auto;
                    }
                    .modal-grid-2 {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .modal-grid-3 {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .modal-content-pad {
                        padding: 32px;
                    }
                }
                `}
            </style>
            <div className="books-container">

                {/* Header */}
                <div className="books-header">
                    <form
                        onSubmit={(e) => { e.preventDefault(); setPage(1) }}
                        className="flex items-center bg-white rounded-xl books-search"
                        style={{ border: '1px solid #e8eaf0', padding: '10px 16px', gap: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    >
                        <Search size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search books..."
                            className="outline-none bg-transparent"
                            style={{ fontSize: '13px', flex: 1, color: '#374151' }}
                        />
                    </form>

                    <button
                        onClick={openAdd}
                        className="flex items-center books-add-btn"
                        style={{
                            gap: '8px', padding: '10px 20px', borderRadius: '12px',
                            fontSize: '13px', fontWeight: 700, color: '#fff',
                            background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                            boxShadow: '0 4px 12px rgba(225,113,28,0.3)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(225,113,28,0.4)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(225,113,28,0.3)' }}
                    >
                        <Plus size={15} />
                        Add Book
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #eef0f5' }}>
                                    {['Book', 'Author', 'Price', 'Stock', 'Status', 'Actions'].map(col => (
                                        <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '64px', textAlign: 'center' }}>
                                            <div className="w-9 h-9 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: '#e1711c', borderTopColor: 'transparent' }} />
                                        </td>
                                    </tr>
                                ) : books.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '64px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(225,113,28,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BookOpen size={24} color="#e1711c" />
                                                </div>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>No books found</p>
                                                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Try a different search or add a new book</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : books.map(book => (
                                    <tr
                                        key={book._id}
                                        style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                    >
                                        {/* Book */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div
                                                    style={{
                                                        width: '42px', height: '56px', borderRadius: '8px',
                                                        overflow: 'hidden', flexShrink: 0, display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        background: '#fff4ec', border: '1px solid #fde0c5'
                                                    }}
                                                >
                                                    <img
                                                        src={book.coverImage || book.thumbnail}
                                                        alt={book.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            const t = e.target as HTMLImageElement
                                                            t.style.display = 'none'
                                                            const p = t.parentElement
                                                            if (p) p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e1711c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', lineHeight: 1.3, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {book.title}
                                                    </p>
                                                    <p style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px' }}>
                                                        {typeof book.category === "object" ? book.category.name : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Author */}
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                                            {book.author}
                                        </td>

                                        {/* Price */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#e1711c' }}>
                                                Rs. {(book.discountPrice > 0 ? book.discountPrice : book.price).toLocaleString()}
                                            </p>
                                            {book.discountPrice > 0 && (
                                                <p style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', marginTop: '2px' }}>
                                                    Rs. {book.price.toLocaleString()}
                                                </p>
                                            )}
                                        </td>

                                        {/* Stock */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                                                background: book.stock === 0 ? '#fee2e2' : book.stock <= 5 ? '#fef9c3' : '#dcfce7',
                                                color: book.stock === 0 ? '#b91c1c' : book.stock <= 5 ? '#a16207' : '#15803d',
                                            }}>
                                                <span style={{
                                                    width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, display: 'inline-block',
                                                    background: book.stock === 0 ? '#ef4444' : book.stock <= 5 ? '#eab308' : '#22c55e'
                                                }} />
                                                {book.stock === 0 ? "Out of Stock" : `${book.stock} left`}
                                            </span>
                                        </td>

                                        {/* Active Toggle */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <button
                                                onClick={() => handleToggle(book._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                            >
                                                {book.isActive
                                                    ? <ToggleRight size={28} color="#22c55e" />
                                                    : <ToggleLeft size={28} color="#cbd5e1" />
                                                }
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={() => openEdit(book)}
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e8eaf0',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: '#fff', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff4ec'; (e.currentTarget as HTMLElement).style.borderColor = '#fde0c5'; (e.currentTarget as HTMLElement).style.color = '#e1711c' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    disabled={deleteId === book._id}
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e8eaf0',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: '#fff', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s',
                                                        opacity: deleteId === book._id ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; (e.currentTarget as HTMLElement).style.borderColor = '#fecaca'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                                                >
                                                    {deleteId === book._id
                                                        ? <Loader2 size={14} className="animate-spin" />
                                                        : <Trash2 size={14} />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{
                                    padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                    border: '1px solid #e8eaf0', background: '#fff', color: '#374151',
                                    cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1,
                                    transition: 'all 0.15s'
                                }}
                            >
                                ← Prev
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', padding: '0 4px' }}>
                                Page <strong style={{ color: '#111827' }}>{page}</strong> of <strong style={{ color: '#111827' }}>{totalPages}</strong>
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{
                                    padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                    border: '1px solid #e8eaf0', background: '#fff', color: '#374151',
                                    cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1,
                                    transition: 'all 0.15s'
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#131921] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(225,113,28,0.15)]" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="flex items-center justify-between border-b border-gray-800" style={{ padding: '24px' }}>
                            <div>
                                <h2 className="font-extrabold text-xl" style={{ background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {editBook ? "Edit Book" : "Add New Book"}
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">Fill in the details below</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); reset() }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col modal-content-pad" style={{ gap: '20px' }}>
                            <div className="flex flex-col animate-fadeIn" style={{ gap: '8px' }}>
                                <label className="text-sm font-medium text-gray-300">Title *</label>
                                <input
                                    {...register("title", { required: true })}
                                    className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                    style={{ padding: '12px 16px' }}
                                />
                            </div>

                            <div className="flex flex-col" style={{ gap: '8px' }}>
                                <label className="text-sm font-medium text-gray-300">Description *</label>
                                <textarea
                                    {...register("description", { required: true })}
                                    rows={3}
                                    className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 resize-none transition-all"
                                    style={{ padding: '12px 16px' }}
                                />
                            </div>

                            <div className="modal-grid modal-grid-2">
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Author *</label>
                                    <input
                                        {...register("author", { required: true })}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }}
                                    />
                                </div>
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Publisher</label>
                                    <input
                                        {...register("publisher")}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }}
                                    />
                                </div>
                            </div>

                            <div className="modal-grid modal-grid-2">
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Category *</label>
                                    <select
                                        {...register("category", { required: true })}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }}
                                    >
                                        <option value="" className="bg-[#131921]">Select category</option>
                                        {categories?.map(cat => (
                                            <option key={cat._id} value={cat._id} className="bg-[#131921]">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Language</label>
                                    <select
                                        {...register("language")}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }}
                                    >
                                        <option value="English" className="bg-[#131921]">English</option>
                                        <option value="Urdu" className="bg-[#131921]">Urdu</option>
                                        <option value="Other" className="bg-[#131921]">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-grid modal-grid-3">
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Price *</label>
                                    <input type="number" {...register("price", { required: true, min: 0 })}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }} />
                                </div>
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Orig. Price</label>
                                    <input type="number" {...register("originalPrice", { min: 0 })}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }} />
                                </div>
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Stock *</label>
                                    <input type="number" {...register("stock", { required: true, min: 0 })}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }} />
                                </div>
                            </div>

                            <div className="modal-grid modal-grid-2">
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">Pages</label>
                                    <input type="number" {...register("pages")}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }} />
                                </div>
                                <div className="flex flex-col" style={{ gap: '8px' }}>
                                    <label className="text-sm font-medium text-gray-300">ISBN</label>
                                    <input {...register("isbn")}
                                        className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] focus:ring-1 focus:ring-[#e1711c]/30 transition-all"
                                        style={{ padding: '12px 16px' }} />
                                </div>
                            </div>

                            <div className="flex flex-col" style={{ gap: '8px' }}>
                                <label className="text-sm font-medium text-gray-300">
                                    Cover Image <span className="text-gray-500 text-xs">{editBook ? "(Leave empty to keep current)" : "*"}</span>
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    {...register("coverImage", { required: !editBook })}
                                    className="w-full bg-[#0d1117] border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-[#e1711c] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#e1711c]/10 file:text-[#e1711c] hover:file:bg-[#e1711c]/20 file:transition-colors file:cursor-pointer" 
                                    style={{ padding: '10px 14px' }}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row border border-gray-800 rounded-xl" style={{ padding: '20px', gap: '20px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" {...register("isFeatured")} className="peer appearance-none w-5 h-5 border border-gray-600 rounded bg-[#0d1117] checked:bg-[#e1711c] checked:border-[#e1711c] transition-colors cursor-pointer" />
                                        <svg className="absolute w-3.5 h-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    Featured Book
                                </label>
                                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" {...register("isBestseller")} className="peer appearance-none w-5 h-5 border border-gray-600 rounded bg-[#0d1117] checked:bg-[#e1711c] checked:border-[#e1711c] transition-colors cursor-pointer" />
                                        <svg className="absolute w-3.5 h-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    Bestseller
                                </label>
                            </div>

                            <div className="border-t border-gray-800" style={{ padding: '24px 0 0 0', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); reset() }}
                                    className="rounded-xl text-sm font-semibold text-gray-400 bg-[#1f2937]/50 border border-gray-700/60 hover:text-white hover:bg-gray-800 hover:border-gray-600 active:scale-95 transition-all w-full sm:w-auto"
                                    style={{ padding: '12px 24px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center text-white rounded-xl text-sm font-bold disabled:opacity-60 hover:-translate-y-0.5 active:scale-95 transition-all w-full sm:w-auto"
                                    style={{
                                        padding: '12px 32px',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                        boxShadow: '0 4px 14px rgba(225, 113, 28, 0.3)'
                                    }}
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    {editBook ? "Update Book" : "Add Book"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default ManageBooks