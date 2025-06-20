import React from 'react';

function PhotoModal({ photos, isOpen, onClose, serviceName }) {
  // Se não está aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  // Função para fechar ao clicar no fundo
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Função para visualizar foto em tela cheia (compatível com mobile/WebView)
  const handleImageClick = (photo) => {
    // Criar elemento de imagem em tela cheia
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: zoom-out;
    `;
    
    const img = document.createElement('img');
    img.src = photo.dataUrl;
    img.style.cssText = `
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      border-radius: 8px;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      color: #333;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;
    
    const removeFullscreen = () => {
      document.body.removeChild(fullscreenDiv);
    };
    
    fullscreenDiv.onclick = removeFullscreen;
    closeButton.onclick = removeFullscreen;
    
    fullscreenDiv.appendChild(img);
    fullscreenDiv.appendChild(closeButton);
    document.body.appendChild(fullscreenDiv);
  };

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '95vw',
          maxHeight: '95vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>

        {/* Título */}
        <h2 style={{ margin: '0 0 20px 0', paddingRight: '40px' }}>
          {serviceName || 'Fotos do Serviço'}
        </h2>

        {/* Conteúdo */}
        {!photos || photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#666', margin: '0 0 20px 0' }}>
              Nenhuma foto encontrada para este serviço.
            </p>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>
              {photos.length} foto{photos.length !== 1 ? 's' : ''} encontrada{photos.length !== 1 ? 's' : ''}
            </p>
            
            {photos.map((photo, index) => (
              <div key={photo.id || index} style={{ marginBottom: '30px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <img
                    src={photo.dataUrl}
                    alt={photo.name || `Foto ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      cursor: 'zoom-in'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    onClick={() => handleImageClick(photo)}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {photo.name || `Foto ${index + 1}`}
                  </p>
                  {photo.compressedSize && (
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      Tamanho: {(photo.compressedSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoModal; 