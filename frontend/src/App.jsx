import React, { useState, useRef, useEffect } from 'react';
import './index.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

  const setupFile = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/v1/audit/run', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (startMs) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startMs / 1000;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Render a responsive canvas waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const drawWave = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(50, 255, 126, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const sliceWidth = width / 60;
      let x = 0;
      
      for (let i = 0; i < 60; i++) {
        // Generate pseudo-random or sinus bar height based on playback state
        let magnitude = 5;
        if (isPlaying) {
          magnitude = Math.sin(i * 0.15 + Date.now() * 0.01) * 20 + 25;
          magnitude += Math.random() * 8;
        } else {
          magnitude = Math.sin(i * 0.08) * 4 + 6;
        }
        
        ctx.fillStyle = isPlaying ? 'rgba(50, 255, 126, 0.7)' : 'rgba(255, 255, 255, 0.2)';
        const barWidth = 4;
        const y = (height - magnitude) / 2;
        ctx.fillRect(x, y, barWidth, magnitude);
        x += barWidth + 3;
      }
      
      animationRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="box">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="title">Audio Speech Transcriber</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Convert voice audio into text streams with millisecond-aligned word timestamps.
        </p>
      </div>

      <div className="panel">
        <div 
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginBottom: '20px',
            background: dragActive ? 'rgba(50, 255, 126, 0.05)' : 'transparent',
            borderColor: dragActive ? 'var(--accent-cyan)' : 'var(--border-color)'
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <svg style={{ width: '48px', height: '48px', marginBottom: '15px', fill: 'var(--accent-cyan)' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          {file ? (
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Selected: {file.name}</p>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Drag and drop your audio file here, or click to browse</p>
          )}
        </div>

        {audioUrl && (
          <div style={{ marginBottom: '25px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime * 1000)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls 
                style={{ flex: 1 }}
              />
            </div>
            
            <canvas 
              ref={canvasRef} 
              style={{ width: '100%', height: '60px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}
            />
          </div>
        )}

        <button 
          className="btn" 
          onClick={handleUpload} 
          disabled={loading || !file}
          style={{ opacity: loading || !file ? 0.6 : 1 }}
        >
          {loading ? 'Analyzing and transcribing...' : 'Run Whisper Alignment →'}
        </button>

        {loading && <div className="spinner"></div>}

        {result && (
          <div className="report-pre" style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <span>📝</span> Alignment Output
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Lang: <strong style={{ color: 'var(--accent-cyan)' }}>{result.detected_language}</strong> | Confidence: <strong style={{ color: 'var(--accent-cyan)' }}>{result.confidence_score}</strong>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', lineHeight: '1.8', fontSize: '1.2rem' }}>
              {result.milestones_timestamps.map((item, idx) => {
                const isActive = currentTime >= item.start_ms && currentTime <= item.end_ms;
                return (
                  <span 
                    key={idx}
                    onClick={() => handleWordClick(item.start_ms)}
                    style={{
                      cursor: 'pointer',
                      padding: '2px 4px',
                      marginRight: '6px',
                      borderRadius: '4px',
                      transition: 'all 0.15s ease',
                      backgroundColor: isActive ? 'rgba(50, 255, 126, 0.35)' : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                      fontWeight: isActive ? '600' : 'normal',
                      textDecoration: isActive ? 'underline' : 'none'
                    }}
                    title={`Click to skip to ${item.start_ms}ms`}
                  >
                    {item.token}
                  </span>
                );
              })}
            </div>
            
            <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              💡 Hint: Click on any word in the transcript above to seek the audio player to that timestamp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}