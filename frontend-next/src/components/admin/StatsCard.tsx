"use client";
// src/components/admin/StatsCard.tsx

interface Props {
    title:   string
    value:   string | number
    icon:    React.ReactNode
    color:   string
    sub?:    string
    trend?:  string
}

const StatsCard = ({ title, value, icon, color, sub, trend }: Props) => {
    return (
        <div
            className="bg-white rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 cursor-default"
            style={{ border: '1px solid #eef0f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
            {trend && (
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
                    {trend}
                </span>
            )}
        </div>
    )
}

export default StatsCard