import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Header';
import Controls from './Controls';
import ConversionChart from './ConversionChart';
import StatusCharts from './StatusCharts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function Dashboard() {
  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate);
  defaultStartDate.setDate(currentDate.getDate() - 15);

  const [data, setData] = useState([]);
  const [statusDataApi, setStatusDataApi] = useState([]);
  const [canal, setCanal] = useState('');
  const [startDate, setStartDate] = useState(defaultStartDate.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);

  const canaisDisponiveis = ['email', 'MOBILE', 'wpp'];
  const statusLabels = {
    1: 'Válido',
    2: 'Inválido',
    3: 'Incompleto',
    4: 'Pendente',
    5: 'Aberto',
    6: 'Visualizou',
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark-mode', savedDarkMode);
    
    document.body.style.transition = 'background-color 0.5s ease';
    document.body.style.backgroundColor = savedDarkMode ? '#121212' : '#f8f9fa';
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      rootElement.style.backgroundColor = savedDarkMode ? '#121212' : '#f8f9fa';
      rootElement.style.color = savedDarkMode ? '#e0e0e0' : '#333';
    }
    
    if (!document.getElementById('theme-transitions')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'theme-transitions';
      styleElement.textContent = `
        * {
          transition: background-color 0.5s ease, 
                      color 0.5s ease, 
                      border-color 0.5s ease, 
                      box-shadow 0.5s ease,
                      opacity 0.5s ease;
        }
        
        input, select, button {
          transition: background-color 0.5s ease, 
                      color 0.5s ease, 
                      border-color 0.5s ease,
                      box-shadow 0.5s ease;
        }
        
        canvas {
          transition: filter 0.5s ease;
        }
        
        .chart-container {
          transition: background-color 0.5s ease,
                      box-shadow 0.5s ease;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark-mode', newMode);
    document.body.style.backgroundColor = newMode ? '#121212' : '#f8f9fa';
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.backgroundColor = newMode ? '#121212' : '#f8f9fa';
      rootElement.style.color = newMode ? '#e0e0e0' : '#333';
    }
  };

  const fetchTaxaConversao = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/taxa-conversao', {
        params: {
          periodo: 'dia',
          canal: canal || undefined,
          startDate: startDate,
          endDate: endDate,
        },
      });
      let rawData = response.data;
      console.log('Dados brutos da API (taxa-conversao):', rawData);

      const convertedData = rawData.map(d => ({
        ...d,
        periodo: new Date(d.periodo).toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0],
      }));

      setData(convertedData);
    } catch (error) {
      console.error('Erro ao buscar dados de taxa-conversao:', error.message);
    }
  }, [canal, startDate, endDate]);

  const fetchStatusDistribuicao = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/status-distribuicao', {
        params: {
          canal: canal || undefined,
          startDate: startDate,
          endDate: endDate,
        },
      });
      let rawData = response.data;
      console.log('Dados brutos da API (status-distribuicao):', rawData);

      setStatusDataApi(rawData);
    } catch (error) {
      console.error('Erro ao buscar dados de status-distribuicao:', error.message);
    }
  }, [canal, startDate, endDate]);

  useEffect(() => {
    fetchTaxaConversao();
    fetchStatusDistribuicao();
  }, [fetchTaxaConversao, fetchStatusDistribuicao]);

  return (
    <div style={{ 
      padding: isMobile ? '10px' : '20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'color 0.5s ease'
    }}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} isMobile={isMobile} />
      <Controls 
        canal={canal} 
        setCanal={setCanal} 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate} 
        setEndDate={setEndDate} 
        defaultStartDate={defaultStartDate} 
        currentDate={currentDate} 
        isMobile={isMobile} 
        darkMode={darkMode} 
        canaisDisponiveis={canaisDisponiveis} 
      />
      {data.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '40px' }}>
          <ConversionChart data={data} isMobile={isMobile} darkMode={darkMode} />
          <StatusCharts statusDataApi={statusDataApi} isMobile={isMobile} darkMode={darkMode} statusLabels={statusLabels} />
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666', fontSize: isMobile ? '16px' : '18px' }}>Carregando dados...</p>
      )}
    </div>
  );
}

export default Dashboard;
