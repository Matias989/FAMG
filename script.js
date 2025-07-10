// Variables globales
let members = [];
let totalLoot = 0;
let repairCosts = 0;
let distributionMode = 'equal'; // 'equal' o 'custom'

// Elementos del DOM
const totalLootInput = document.getElementById('totalLoot');
const repairCostsInput = document.getElementById('repairCosts');
const memberCountInput = document.getElementById('memberCount');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const equalDistributionBtn = document.getElementById('equalDistributionBtn');
const customDistributionBtn = document.getElementById('customDistributionBtn');
const membersSection = document.getElementById('membersSection');
const membersGrid = document.getElementById('membersGrid');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');

// Elementos de resumen financiero
const totalLootDisplay = document.getElementById('totalLootDisplay');
const repairCostsDisplay = document.getElementById('repairCostsDisplay');
const netLootDisplay = document.getElementById('netLootDisplay');
const totalParticipation = document.getElementById('totalParticipation');
const participationStatus = document.getElementById('participationStatus');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    calculateBtn.addEventListener('click', calculateDistribution);
    resetBtn.addEventListener('click', resetCalculator);
    equalDistributionBtn.addEventListener('click', setEqualDistribution);
    customDistributionBtn.addEventListener('click', setCustomDistribution);
    totalLootInput.addEventListener('input', validateAll);
    repairCostsInput.addEventListener('input', validateAll);
    memberCountInput.addEventListener('input', onMemberCountChange);
    setEqualDistribution();
});

function setEqualDistribution() {
    distributionMode = 'equal';
    equalDistributionBtn.style.opacity = '1';
    customDistributionBtn.style.opacity = '0.6';
    equalDistributionBtn.style.transform = 'scale(1.05)';
    customDistributionBtn.style.transform = 'scale(1)';
    membersSection.style.display = 'none';
    members = [];
    validateAll();
    showNotification('Modo: Distribución Equitativa - Todos participan igual', 'info');
}

function setCustomDistribution() {
    distributionMode = 'custom';
    customDistributionBtn.style.opacity = '1';
    equalDistributionBtn.style.opacity = '0.6';
    customDistributionBtn.style.transform = 'scale(1.05)';
    equalDistributionBtn.style.transform = 'scale(1)';
    generateMemberFields();
    showNotification('Modo: Participación Personalizada - Define porcentajes individuales', 'info');
}

function onMemberCountChange() {
    if (distributionMode === 'custom') {
        generateMemberFields();
    }
    validateAll();
}

function generateMemberFields() {
    const memberCount = parseInt(memberCountInput.value);
    if (isNaN(memberCount) || memberCount < 1 || memberCount > 20) {
        membersGrid.innerHTML = '';
        membersSection.style.display = 'none';
        members = [];
        return;
    }
    membersGrid.innerHTML = '';
    members = [];
    for (let i = 0; i < memberCount; i++) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'member-input';
        memberDiv.innerHTML = `
            <label for="member${i}">Integrante ${i + 1}</label>
            <input type="text" id="member${i}" placeholder="Nombre del integrante" class="member-name">
            <label for="participation${i}" style="margin-top: 15px;">Participación (%)</label>
            <input type="number" id="participation${i}" placeholder="0" min="0" max="100" step="0.1" class="participation-input">
        `;
        membersGrid.appendChild(memberDiv);
        const nameInput = memberDiv.querySelector('.member-name');
        const participationInput = memberDiv.querySelector('.participation-input');
        nameInput.addEventListener('input', validateAll);
        participationInput.addEventListener('input', validateAll);
        members.push({
            name: nameInput,
            participation: participationInput
        });
    }
    membersSection.style.display = 'block';
    validateAll();
}

function validateAll() {
    updateFinancialSummary();
    if (distributionMode === 'equal') {
        validateEquitable();
    } else {
        validateParticipation();
    }
}

function validateEquitable() {
    const total = parseFloat(totalLootInput.value) || 0;
    const memberCount = parseInt(memberCountInput.value) || 0;
    if (total > 0 && memberCount > 0 && memberCount <= 20) {
        participationStatus.textContent = 'Listo para calcular (Equitativo)';
        participationStatus.className = 'summary-status valid';
        calculateBtn.disabled = false;
    } else {
        participationStatus.textContent = 'Completa los campos requeridos';
        participationStatus.className = 'summary-status';
        calculateBtn.disabled = true;
    }
    totalParticipation.textContent = '100%';
}

function validateParticipation() {
    let total = 0;
    let allFilled = true;
    let hasMembers = members.length > 0;
    let hasPositive = false;
    members.forEach(member => {
        const participation = parseFloat(member.participation.value) || 0;
        total += participation;
        if (participation > 0) hasPositive = true;
        if (!member.name.value.trim() || member.participation.value === '') {
            allFilled = false;
        }
    });
    totalParticipation.textContent = `${total.toFixed(1)}%`;
    const hasLoot = parseFloat(totalLootInput.value) > 0;
    if (allFilled && hasLoot && hasMembers && hasPositive) {
        participationStatus.textContent = 'Listo para calcular (Proporcional)';
        participationStatus.className = 'summary-status valid';
        calculateBtn.disabled = false;
    } else if (!hasLoot) {
        participationStatus.textContent = 'Sin ganancias';
        participationStatus.className = 'summary-status';
        calculateBtn.disabled = true;
    } else if (!hasMembers) {
        participationStatus.textContent = 'Sin integrantes';
        participationStatus.className = 'summary-status';
        calculateBtn.disabled = true;
    } else if (!hasPositive) {
        participationStatus.textContent = 'Debe haber al menos un aporte mayor a 0';
        participationStatus.className = 'summary-status';
        calculateBtn.disabled = true;
    } else {
        participationStatus.textContent = 'Incompleto';
        participationStatus.className = 'summary-status';
        calculateBtn.disabled = true;
    }
}

function calculateDistribution() {
    totalLoot = parseFloat(totalLootInput.value) || 0;
    repairCosts = parseFloat(repairCostsInput.value) || 0;
    if (totalLoot <= 0) {
        showNotification('Ingresa un monto válido de ganancias', 'error');
        return;
    }
    if (repairCosts > totalLoot) {
        showNotification('Los gastos de reparación no pueden ser mayores a las ganancias totales', 'error');
        return;
    }
    const netLoot = totalLoot - repairCosts;
    updateFinancialSummary();
    let results = [];
    if (distributionMode === 'equal') {
        const memberCount = parseInt(memberCountInput.value) || 0;
        const amount = netLoot / memberCount;
        for (let i = 0; i < memberCount; i++) {
            results.push({
                name: `Integrante ${i + 1}`,
                participation: (100 / memberCount).toFixed(1),
                amount: amount
            });
        }
    } else {
        // Nuevo: reparto proporcional
        let totalAportes = 0;
        members.forEach(member => {
            totalAportes += parseFloat(member.participation.value) || 0;
        });
        members.forEach(member => {
            const name = member.name.value.trim();
            const participation = parseFloat(member.participation.value) || 0;
            const amount = totalAportes > 0 ? (netLoot * participation) / totalAportes : 0;
            results.push({
                name: name,
                participation: participation,
                amount: amount
            });
        });
    }
    displayResults(results);
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    const modeText = distributionMode === 'equal' ? 'equitativa' : 'proporcional';
    showNotification(`Distribución ${modeText} calculada exitosamente`, 'success');
}

// Función para mostrar resultados
function displayResults(results) {
    resultsGrid.innerHTML = '';
    
    results.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.innerHTML = `
            <div class="result-name">${result.name}</div>
            <div class="result-participation">${result.participation}% de participación</div>
            <div class="result-amount">${formatCurrency(result.amount)}</div>
        `;
        
        resultsGrid.appendChild(resultDiv);
    });
}

// Función para actualizar el resumen financiero
function updateFinancialSummary() {
    const total = parseFloat(totalLootInput.value) || 0;
    const repair = parseFloat(repairCostsInput.value) || 0;
    const net = total - repair;
    
    totalLootDisplay.textContent = formatCurrency(total);
    repairCostsDisplay.textContent = formatCurrency(repair);
    netLootDisplay.textContent = formatCurrency(net);
    
    // Validar que los gastos no excedan las ganancias
    if (repair > total) {
        repairCostsInput.style.borderColor = '#dc3545';
        repairCostsInput.style.boxShadow = '0 0 15px rgba(220, 53, 69, 0.3)';
    } else {
        repairCostsInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        repairCostsInput.style.boxShadow = 'none';
    }
}

// Función para reiniciar la calculadora
function resetCalculator() {
    // Limpiar inputs principales
    totalLootInput.value = '';
    repairCostsInput.value = '0';
    memberCountInput.value = '4';
    
    // Limpiar secciones
    membersSection.style.display = 'none';
    resultsSection.style.display = 'none';
    membersGrid.innerHTML = '';
    resultsGrid.innerHTML = '';
    
    // Resetear variables
    members = [];
    totalLoot = 0;
    repairCosts = 0;
    distributionMode = 'equal';
    
    // Resetear resumen
    totalParticipation.textContent = '0%';
    participationStatus.textContent = 'Incompleto';
    participationStatus.className = 'summary-status';
    calculateBtn.disabled = true;
    
    // Resetear resumen financiero
    totalLootDisplay.textContent = '0';
    repairCostsDisplay.textContent = '0';
    netLootDisplay.textContent = '0';
    
    // Resetear estilos
    totalLootInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    repairCostsInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    memberCountInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    totalLootInput.style.boxShadow = 'none';
    repairCostsInput.style.boxShadow = 'none';
    memberCountInput.style.boxShadow = 'none';
    
    // Resetear botones de distribución
    setEqualDistribution();
    
    showNotification('Calculadora reiniciada', 'info');
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para obtener icono de notificación
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Función para obtener color de notificación
function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(45deg, #28a745, #20c997)';
        case 'error': return 'linear-gradient(45deg, #dc3545, #c82333)';
        case 'warning': return 'linear-gradient(45deg, #ffc107, #e0a800)';
        default: return 'linear-gradient(45deg, #17a2b8, #138496)';
    }
}

// Agregar estilos CSS para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar valores iniciales
    repairCostsInput.value = '0';
    memberCountInput.value = '4';
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a la Calculadora de Loot de Albion Online!', 'info');
    }, 1000);
}); 