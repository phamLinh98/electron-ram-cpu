const cpuPercentageEl = document.getElementById('cpu-percentage');
const cpuInfoEl = document.getElementById('cpu-info');
const cpuFillEl = document.querySelector('.cpu-fill');

const ramPercentageEl = document.getElementById('ram-percentage');
const ramUsedEl = document.getElementById('ram-used');
const ramFreeEl = document.getElementById('ram-free');
const ramTotalEl = document.getElementById('ram-total');
const ramFillEl = document.querySelector('.ram-fill');

const circumference = 2 * Math.PI * 80; // r = 80

function setProgress(element, percent) {
  const offset = circumference - (percent / 100) * circumference;
  element.style.strokeDashoffset = offset;
  element.style.strokeDasharray = circumference;
}

async function updateSystemInfo() {
  try {
    // Get CPU Usage
    const cpuData = await window.electronAPI.getCPUUsage();
    cpuPercentageEl.textContent = `${cpuData.usage}%`;
    cpuInfoEl.textContent = `${cpuData.cores} Cores`;
    setProgress(cpuFillEl, parseFloat(cpuData.usage));

    // Get RAM Usage
    const memData = await window.electronAPI.getMemoryUsage();
    ramPercentageEl.textContent = `${memData.percentage}%`;
    ramUsedEl.textContent = `${memData.used} GB`;
    ramFreeEl.textContent = `${memData.free} GB`;
    ramTotalEl.textContent = `${memData.total} GB`;
    setProgress(ramFillEl, parseFloat(memData.percentage));
    
  } catch (error) {
    console.error('Error updating system info:', error);
  }
}

// Update every 1 second
updateSystemInfo();
setInterval(updateSystemInfo, 1000);