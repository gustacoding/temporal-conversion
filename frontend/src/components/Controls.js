import React from 'react';

function Controls({ canal, setCanal, startDate, setStartDate, endDate, setEndDate, defaultStartDate, currentDate, isMobile, darkMode, canaisDisponiveis }) {
  const controlStyle = {
    display: 'flex',  
    gap: '10px',
    margin: '5px 0',
    flexDirection: isMobile ? 'column' : 'row',
    width: isMobile ? '100%' : 'auto',
    alignItems: isMobile ? 'flex-start' : 'center',
  };

  const inputStyle = {
    padding: '8px', 
    borderRadius: '5px', 
    border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
    width: isMobile ? '100%' : 'auto',
    boxSizing: 'border-box',
    backgroundColor: darkMode ? '#333' : '#fff',
    color: darkMode ? '#e0e0e0' : '#333',
    transition: 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease'
  };

  const buttonStyle = {
    padding: '8px 15px', 
    borderRadius: '5px', 
    background: darkMode ? '#444' : '#e0e0e0', 
    border: 'none', 
    cursor: 'pointer', 
    color: darkMode ? '#e0e0e0' : '#333',
    width: isMobile ? '100%' : 'auto',
    transition: 'background-color 0.5s ease, color 0.5s ease'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      flexWrap: 'wrap', 
      gap: isMobile ? '10px' : '20px', 
      marginBottom: '20px', 
      background: darkMode ? '#2d2d2d' : '#f5f5f5', 
      padding: isMobile ? '10px' : '20px', 
      borderRadius: '10px', 
      boxShadow: darkMode ? '0 2px 5px rgba(0,0,0,0.2)' : '0 2px 5px rgba(0,0,0,0.1)',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'background-color 0.5s ease, box-shadow 0.5s ease'
    }}>
      <label style={controlStyle}>
        Canal:
        <select value={canal} onChange={e => setCanal(e.target.value)} style={inputStyle}>
          <option value="">Todos</option>
          {canaisDisponiveis.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setCanal('')} style={buttonStyle}>
          Limpar
        </button>
      </label>

      <label style={controlStyle}>
        Data Inicial:
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={controlStyle}>
        Data Final:
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          max={new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]}
          style={inputStyle}
        />
      </label>

      <button onClick={() => { 
        setStartDate(defaultStartDate.toISOString().split('T')[0]); 
        setEndDate(currentDate.toISOString().split('T')[0]); 
      }} style={{...buttonStyle, marginTop: isMobile ? '5px' : '0'}}>
        Resetar Datas
      </button>
    </div>
  );
}

export default Controls;
