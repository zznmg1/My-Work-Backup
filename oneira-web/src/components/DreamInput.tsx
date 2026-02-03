import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

interface DreamInputProps {
    onSubmit: (text: string) => void
    isAnalyzing: boolean
}

export function DreamInput({ onSubmit, isAnalyzing }: DreamInputProps) {
    const [text, setText] = useState('')

    const handleSubmit = () => {
        if (!text.trim()) return
        onSubmit(text)
        setText('')
    }

    return (
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your dream..."
                disabled={isAnalyzing}
                style={{
                    width: '100%',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    resize: 'none',
                    outline: 'none',
                    marginBottom: '10px'
                }}
            />

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isAnalyzing || !text.trim()}
                style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary))',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isAnalyzing ? 0.7 : 1
                }}
            >
                {isAnalyzing ? (
                    'Consulting the Oracle...'
                ) : (
                    <>
                        Interpret Dream <Send size={18} />
                    </>
                )}
            </motion.button>
        </div>
    )
}
