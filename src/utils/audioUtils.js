// Función para generar sonido de trompetas usando Web Audio API
export const createTrumpetSound = () => {
  // Verificar si los sonidos están habilitados
  const notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
  if (!notificationsEnabled) {
    return {
      play: () => console.log('Sonidos de notificación deshabilitados'),
      stop: () => {}
    };
  }

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Crear osciladores para simular trompetas
    const frequencies = [440, 554, 659, 880]; // Notas musicales
    const oscillators = [];
    const gainNodes = [];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      
      // Configurar envolvente de volumen
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Iniciar con delay escalonado
      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + 1.5 + index * 0.1);
      
      oscillators.push(oscillator);
      gainNodes.push(gainNode);
    });
    
    return {
      play: () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      },
      stop: () => {
        oscillators.forEach(osc => osc.stop());
        audioContext.close();
      }
    };
  } catch (error) {
    console.log('Web Audio API no disponible:', error);
    return {
      play: () => console.log('Sonido de trompetas simulado'),
      stop: () => {}
    };
  }
};

// Función para reproducir sonido de notificación simple
export const playNotificationSound = () => {
  // Verificar si los sonidos están habilitados
  const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  if (!soundEnabled) {
    return;
  }

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  } catch (error) {
    console.log('No se pudo reproducir sonido:', error);
  }
}; 