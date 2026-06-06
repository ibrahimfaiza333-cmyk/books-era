"use client";
/** Full-page loading spinner (matches existing page-level loader markup). */
const PageSpinner = () => (
    <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
    >
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
)

export default PageSpinner
