import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SplashScreenProps {
    onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 2 // Speed of loading
            })
        }, 40) // ~2 seconds total

        const timeout = setTimeout(() => {
            onComplete()
        }, 2800)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [onComplete])

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#030303',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37'
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ marginBottom: '40px', textAlign: 'center' }}
            >
                <h1 style={{
                    fontSize: '3rem',
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '5px',
                    marginBottom: '10px'
                }}>
                    DESTINY
                </h1>
                <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.8rem',
                    letterSpacing: '4px',
                    opacity: 0.6,
                    textTransform: 'uppercase'
                }}>
                    Reveal Your Fate
                </p>
            </motion.div>

            {/* Elegant Progress Bar */}
            <div style={{ width: '120px', height: '2px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: '#D4AF37' }}
                />
            </div>

            <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ marginTop: '20px', fontSize: '10px', opacity: 0.5, letterSpacing: '2px' }}
            >
                {progress}%
            </motion.span>
        </motion.div>
    )
}
