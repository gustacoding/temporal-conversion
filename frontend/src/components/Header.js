import React from 'react';

function Header({ darkMode, toggleDarkMode, isMobile }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h1 style={{ 
        color: darkMode ? '#e0e0e0' : '#333', 
        fontSize: isMobile ? '20px' : '24px',
        margin: 0,
        transition: 'color 0.5s ease'
      }}>Dashboard de Conversão</h1>
      
      <button 
        onClick={toggleDarkMode} 
        style={{
          padding: '8px 12px',
          borderRadius: '5px',
          background: darkMode ? '#e0e0e0' : '#333',
          color: darkMode ? '#333' : '#e0e0e0',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'background-color 0.5s ease, color 0.5s ease'
        }}
      >
        {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
      </button>
    </div>
  );
}

export default Header;
