import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'

export type DreamRarity = 'NORMAL' | 'RARE' | 'LEGEND'
export type DreamAttribute = 'BLESSING' | 'NIGHTMARE' | 'GENESIS'

interface DreamCardProps {
    id: string
    content: string
    rarity: DreamRarity
    attribute: DreamAttribute
    date: string
    isPurified?: boolean
    onPurify?: () => void
}

export function DreamCard({ content, rarity, attribute, date, isPurified, onPurify }: DreamCardProps) {

    // Placeholder images for visual fidelity matching the reference
    const getPlaceholderImage = () => {
        if (attribute === 'NIGHTMARE' && !isPurified) return 'linear-gradient(to bottom, #2a0000, #1a0000)'
        return 'linear-gradient(to bottom, #1a1a2e, #16213e)'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'var(--color-card-bg)',
                borderRadius: 'var(--radius-card)',
                padding: '20px',
                marginBottom: '20px',
                position: 'relative'
            }}
        >
            {/* Header: Title/Date & Menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    {/* Visual "Tag" dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-dim)' }}>{date}</span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>
                        {rarity === 'NORMAL' ? 'Dream Entry' : `${rarity} Dream`}
                    </h3>
                </div>
                <MoreHorizontal size={20} color="#666" />
            </div>

            {/* Content Text truncated */}
            <p style={{
                fontSize: '14px',
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {content}
            </p>

            {/* Image Placeholder area (like the reference) */}
            <div style={{
                width: '100%',
                height: '160px',
                background: getPlaceholderImage(),
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Show simple text or icon if no image yet */}
                {attribute === 'NIGHTMARE' && !isPurified ? (
                    <div onClick={onPurify} style={{ textAlign: 'center', cursor: 'pointer' }}>
                        <p style={{ color: '#ff6b6b', fontWeight: 600 }}>Nightmare Detected</p>
                        <button style={{
                            marginTop: '8px',
                            background: 'rgba(255,107,107,0.2)',
                            color: '#ff6b6b',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px'
                        }}>Tap to Purify</button>
                    </div>
                ) : (
                    <span style={{ fontSize: '40px', opacity: 0.2 }}>🌌</span>
                )}
            </div>
        </motion.div>
    )
}
