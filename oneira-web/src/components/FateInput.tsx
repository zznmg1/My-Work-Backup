import { useState, useEffect } from 'react'
import { Moon, Sparkles, Heart } from 'lucide-react'
import { FateType } from '../types'

interface FateInputProps {
    type: FateType
    onSubmit: (content: string, subContent?: string) => void
    isAnalyzing: boolean
}

export function FateInput({ type, onSubmit, isAnalyzing }: FateInputProps) {
    const [text, setText] = useState('')

    // Reset text when type changes (since we don't unmount anymore)
    useEffect(() => {
        setText('')
    }, [type])

    const handleSubmit = () => {
        if (!text.trim() && (type === 'DREAM' || type === 'SOUL')) return

        if (type === 'DREAM') {
            onSubmit(text)
        } else if (type === 'SOUL') {
            onSubmit(text, "Soul Reflection")
        } else {
            onSubmit("Daily Fortune Forecast")
        }
        setText('')
    }

    return (
        <div style={{ width: '100%', padding: '10px' }}>
            {/* DREAM INPUT */}
            {type === 'DREAM' && (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell me about your dream..."
                    disabled={isAnalyzing}
                    style={{
                        width: '100%', height: '120px', background: '#111', border: '1px solid #333',
                        color: '#fff', padding: '15px', marginBottom: '20px', borderRadius: '8px', outline: 'none'
                    }}
                />
            )}

            {/* SOUL INPUT (20 chars limit) */}
            {type === 'SOUL' && (
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        maxLength={20}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Current mood? (Max 20)"
                        disabled={isAnalyzing}
                        style={{
                            width: '100%', background: 'transparent', color: '#fff', border: 'none',
                            borderBottom: '2px solid #C5A3FF', padding: '10px', fontSize: '18px', textAlign: 'center', outline: 'none'
                        }}
                    />
                    <div style={{ textAlign: 'center', fontSize: '10px', opacity: 0.5, marginTop: '5px' }}>
                        {text.length} / 20
                    </div>
                </div>
            )}

            {/* ACTION BUTTON (No Motion) */}
            <button
                onClick={handleSubmit}
                disabled={isAnalyzing || (!text.trim() && (type === 'DREAM' || type === 'SOUL'))}
                style={{
                    width: '100%', padding: '15px', background: '#fff', color: '#000',
                    border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer', opacity: isAnalyzing ? 0.5 : 1
                }}
            >
                {isAnalyzing ? (
                    'ANALYZING...'
                ) : (
                    <>
                        {type === 'DREAM' && 'INTERPRET DREAM'}
                        {type === 'FORTUNE' && 'OPEN ORACLE'}
                        {type === 'SOUL' && 'READ SOUL'}
                    </>
                )}
            </button>
        </div>
    )
}
