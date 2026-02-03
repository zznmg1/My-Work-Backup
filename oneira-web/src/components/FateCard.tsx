import { motion } from 'framer-motion'
import { MoreHorizontal, Image as ImageIcon, Sparkles, Moon, Sun } from 'lucide-react'
import { FateEntry } from '../types'

interface FateCardProps extends FateEntry {
    onUnlockImage: () => void
}

export function FateCard({ type, content, subContent, rarity, date, hasImage, onUnlockImage }: FateCardProps) {

    const getIcon = () => {
        switch (type) {
            case 'DREAM': return <Moon size={14} color="#C5A3FF" />
            case 'FORTUNE': return <Sparkles size={14} color="#FFD700" />
            case 'SAJU': return <Sun size={14} color="#FF4500" />
        }
    }

    const getTypeLabel = () => {
        switch (type) {
            case 'DREAM': return 'Dream Fragment'
            case 'FORTUNE': return 'Daily Fortune'
            case 'SAJU': return 'Destiny Reading'
        }
    }

    const getGradient = () => {
        if (hasImage) return 'linear-gradient(to bottom, #2a2a40, #1a1a2e)' // Revealed
        // Placeholders
        if (type === 'DREAM') return 'linear-gradient(to bottom, #1a1a2e, #111)'
        if (type === 'FORTUNE') return 'linear-gradient(to bottom, #2e2a1a, #1a1500)'
        if (type === 'SAJU') return 'linear-gradient(to bottom, #2e1a1a, #1a0000)'
        return '#222'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            style={{
                background: 'var(--color-card-bg)',
                borderRadius: 'var(--radius-card)',
                padding: '20px',
                marginBottom: '20px',
                position: 'relative',
                border: rarity === 'LEGEND' ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255,255,255,0.05)'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        {getIcon()}
                        <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {getTypeLabel()} • {date}
                        </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'white', lineHeight: '1.4' }}>
                        {subContent || (content.length > 20 ? content.substring(0, 20) + "..." : content)}
                    </h3>
                </div>
                <MoreHorizontal size={20} color="#444" />
            </div>

            {/* Content Text */}
            <p style={{
                fontSize: '14px',
                marginBottom: '16px',
                color: '#ccc',
                lineHeight: '1.6'
            }}>
                {content}
            </p>

            {/* Image Area */}
            <div style={{
                width: '100%',
                height: '180px',
                background: getGradient(),
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {hasImage ? (
                    <>
                        <span style={{ fontSize: '50px' }}>🌌</span>
                        {rarity === 'LEGEND' && (
                            <div style={{
                                position: 'absolute', bottom: '10px', right: '10px',
                                background: 'gold', color: 'black',
                                fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'
                            }}>LEGENDARY</div>
                        )}
                    </>
                ) : (
                    <div onClick={onUnlockImage} style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.8 }}>
                        <ImageIcon size={32} color="rgba(255,255,255,0.5)" style={{ marginBottom: '10px' }} />
                        <p style={{ fontSize: '13px', marginBottom: '8px', color: '#fff' }}>Visualize Destiny</p>
                        <button style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>Watch Ad to Generate</button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
