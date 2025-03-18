import React from 'react';
import { Line } from 'react-chartjs-2';

function ConversionChart({ data, isMobile, darkMode }) {
  const allDates = data.length > 0
    ? [...new Set(data.map(d => d.periodo))]
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR'))
    : [];

  const chartData = {
    labels: allDates,
    datasets: [...new Set(data.map(d => d.canal))].map(canal => {
      const colors = { email: '#007bff', MOBILE: '#28a745', wpp: '#dc3545' };
      const canalData = data.filter(d => d.canal === canal);
      const dataByDate = allDates.map(date => {
        const entry = canalData.find(d => new Date(`${d.periodo}T00:00:00`).toLocaleDateString('pt-BR') === date);
        return entry ? parseFloat(entry.taxa_conversao) : 0;
      });
      return {
        label: canal,
        data: dataByDate,
        borderColor: colors[canal],
        backgroundColor: colors[canal] + '33',
        fill: false,
        pointRadius: isMobile ? 2 : 4,
        pointHoverRadius: isMobile ? 3 : 6,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: { 
        position: isMobile ? 'bottom' : 'top',
        labels: {
          boxWidth: isMobile ? 10 : 40,
          font: {
            size: isMobile ? 10 : 12
          },
          color: darkMode ? '#e0e0e0' : '#333',
          padding: 15
        }
      },
      title: { 
        display: true, 
        text: 'Taxa de Conversão por Canal', 
        font: { size: isMobile ? 14 : 18 },
        color: darkMode ? '#e0e0e0' : '#333',
        padding: { bottom: 15 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
          }
        },
        backgroundColor: darkMode ? 'rgba(51, 51, 51, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: darkMode ? '#fff' : '#333',
        bodyColor: darkMode ? '#fff' : '#333',
        borderColor: darkMode ? '#555' : '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(51, 51, 51, 0.8)' : 'rgba(221, 221, 221, 0.8)',
        },
        ticks: {
          color: darkMode ? '#e0e0e0' : '#333',
          padding: 8
        },
        border: {
          color: darkMode ? 'rgba(80, 80, 80, 0.8)' : 'rgba(200, 200, 200, 0.8)'
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(51, 51, 51, 0.8)' : 'rgba(221, 221, 221, 0.8)',
        },
        ticks: {
          color: darkMode ? '#e0e0e0' : '#333',
          padding: 8
        },
        border: {
          color: darkMode ? 'rgba(80, 80, 80, 0.8)' : 'rgba(200, 200, 200, 0.8)'
        },
        beginAtZero: true,
        adapting: true,
        grace: '10%',
        suggestedMax: undefined
      }
    },
    transitions: {
      color: {
        animation: {
          duration: 500
        }
      }
    }
  };

  return (
    <div style={{ 
      background: darkMode ? '#1e1e1e' : '#fff', 
      padding: isMobile ? '15px' : '25px', 
      borderRadius: '10px', 
      boxShadow: darkMode ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.1)', 
      height: isMobile ? '300px' : '400px',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
      className: 'chart-container'
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ConversionChart;
