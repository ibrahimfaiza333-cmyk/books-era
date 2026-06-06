"use client";
// src/views/admin/ManageCategories.tsx
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2, Loader2, Tag, Layers, X, Image as ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { createCategory, updateCategory, deleteCategory } from "../../api/categories.api"
import { getCategories } from "../../api/categories.api"
import { getApiErrorMessage } from "../../lib/api-error"
import { queryKeys } from "../../lib/query-keys"
import AdminLayout from "../../components/admin/AdminLayout"
import { toast } from "react-toastify";
import type { Category } from "../../types"

interface CategoryForm {
    name: string
    description: string
    image: FileList | null
    isActive: boolean
}

const ManageCategories = () => {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [editCat, setEditCat] = useState<Category | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const { register, handleSubmit, reset, setValue } = useForm<CategoryForm>()

    const { data: categories = [], isLoading } = useQuery({
        queryKey: queryKeys.categories,
        queryFn: getCategories,
    })

    const openAdd = () => {
        setEditCat(null)
        reset({
            name: "",
            description: "",
            image: null,
            isActive: true
        })
        setShowModal(true)
    }

    const openEdit = (cat: Category) => {
        setEditCat(cat)
        setValue("name", cat.name)
        setValue("description", cat.description || "")
        setValue("isActive", cat.isActive ?? true)
        setShowModal(true)
    }

    const onSubmit = async (data: CategoryForm) => {
        try {
            setLoading(true)
            
            const payload: any = {
                name: data.name,
                description: data.description,
                isActive: data.isActive
            }

            if (data.image && data.image.length > 0) {
                payload.image = data.image[0]
            }

            if (editCat) {
                await updateCategory(editCat._id, payload)
                toast.success("Category updated!")
            } else {
                await createCategory(payload)
                toast.success("Category added!")
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.categories })
            setShowModal(false)
            reset()
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "failed"))
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return
        try {
            setDeleteId(id)
            await deleteCategory(id)
            queryClient.invalidateQueries({ queryKey: queryKeys.categories })
            toast.success("Category deleted!")
        } catch {
            toast.error("Failed to delete category!")
        } finally {
            setDeleteId(null)
        }
    }

    return (
        <AdminLayout title="Manage Categories">
            <style>
                {`
                .cats-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .cats-header {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .cats-add-btn {
                    width: 100%;
                    justify-content: center;
                }
                .cat-modal-content {
                    width: 95%;
                    max-width: 500px;
                    max-height: 90vh;
                }
                @media (min-width: 640px) {
                    .cats-container {
                        gap: 24px;
                    }
                    .cats-header {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .cats-add-btn {
                        width: auto;
                    }
                }
                `}
            </style>
            <div className="cats-container">

                {/* Header */}
                <div className="cats-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(225,113,28,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e1711c' }}>
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Product Categories</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Organize your store catalog</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={openAdd}
                        className="cats-add-btn"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)', color: '#fff', fontSize: '13.5px', fontWeight: 700,
                            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,113,28,0.25)', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #eef0f5' }}>
                                    {['Category', 'Slug', 'Description', 'Status', 'Actions'].map(col => (
                                        <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '64px', textAlign: 'center' }}>
                                            <div className="w-9 h-9 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: '#e1711c', borderTopColor: 'transparent' }} />
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '64px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(225,113,28,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Tag size={24} color="#e1711c" />
                                                </div>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>No categories found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : categories.map(cat => (
                                    <tr
                                        key={cat._id}
                                        style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f8f9fb', border: '1px solid #e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                    {cat.image ? (
                                                        <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <ImageIcon size={18} color="#94a3b8" />
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{cat.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '12.5px', color: '#64748b', fontFamily: 'monospace' }}>
                                            {cat.slug}
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <p style={{ fontSize: '12.5px', color: '#64748b', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {cat.description || "—"}
                                            </p>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                                                background: cat.isActive !== false ? '#dcfce7' : '#fee2e2',
                                                color: cat.isActive !== false ? '#15803d' : '#b91c1c',
                                            }}>
                                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cat.isActive !== false ? '#22c55e' : '#ef4444' }} />
                                                {cat.isActive !== false ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={() => openEdit(cat)}
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '10px',
                                                        border: '1px solid #e8eaf0', background: '#fff',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff4ec'; (e.currentTarget as HTMLElement).style.borderColor = '#fde0c5'; (e.currentTarget as HTMLElement).style.color = '#e1711c' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    disabled={deleteId === cat._id}
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '10px',
                                                        border: '1px solid #e8eaf0', background: '#fff',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s',
                                                        opacity: deleteId === cat._id ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; (e.currentTarget as HTMLElement).style.borderColor = '#fecaca'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                                                >
                                                    {deleteId === cat._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div className="cat-modal-content" style={{ background: '#fff', borderRadius: '20px', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                            <div>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{editCat ? 'Update Category' : 'Create Category'}</p>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                                    {editCat ? "Edit Category Details" : "Add New Category"}
                                </h2>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); reset() }}
                                style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e8eaf0', background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8f9fb'; (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Category Name *</label>
                                <input
                                    {...register("name", { required: true })}
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e8eaf0', background: '#f8f9fb', fontSize: '14px', outline: 'none', color: '#111827' }}
                                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = '#e1711c'}
                                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'}
                                    placeholder="E.g., Fiction"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={3}
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e8eaf0', background: '#f8f9fb', fontSize: '14px', outline: 'none', resize: 'none', color: '#111827' }}
                                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = '#e1711c'}
                                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'}
                                    placeholder="Brief description about the category"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                                    Category Image <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 400 }}>{editCat ? "(Leave empty to keep current)" : ""}</span>
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    {...register("image")}
                                    style={{ padding: '10px 14px', borderRadius: '12px', border: '1px dashed #cbd5e1', background: '#f8f9fb', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}
                                />
                            </div>

                            {editCat && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: '#f8f9fb', border: '1px solid #e8eaf0' }}>
                                    <input 
                                        type="checkbox" 
                                        id="isActiveCat"
                                        {...register("isActive")} 
                                        style={{ width: '18px', height: '18px', accentColor: '#e1711c', cursor: 'pointer' }} 
                                    />
                                    <label htmlFor="isActiveCat" style={{ fontSize: '13.5px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                                        Active Status
                                    </label>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '20px', marginTop: '4px', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); reset() }}
                                    style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 600, color: '#64748b', background: '#fff', border: '1px solid #e8eaf0', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)', color: '#fff', fontSize: '13.5px', fontWeight: 700,
                                        border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(225,113,28,0.25)', flex: '1 1 auto'
                                    }}
                                >
                                    {loading && <Loader2 size={14} className="animate-spin" />}
                                    {editCat ? "Update Category" : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default ManageCategories
