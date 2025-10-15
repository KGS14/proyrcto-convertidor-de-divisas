/* =========================================================
   Conversor con base de datos interna de tasas (USD = 1)
   ========================================================= */

/*
  NOTAS:
  - Las tasas internas están en el objeto `rates` con base USD = 1.
  - Para convertir: result = amount * (toRate / fromRate)
  - Si quieres actualizar manualmente las tasas, edita el objeto `rates`.
*/

const rates = {
  USD: 1,
  EUR: 0.95,
  GBP: 0.82,
  JPY: 149.3,
  CNY: 7.29,
  CAD: 1.37,
  AUD: 1.56,
  CHF: 0.91,
  MXN: 18.09,
  BRL: 5.15,
  KRW: 1345,
  INR: 83.2,
  RUB: 95.0,
  ARS: 365.5,
  CLP: 897.5,
  COP: 4120,
  SEK: 11.0,
  NOK: 10.8,
  ZAR: 18.8,
  TRY: 27.0,
  SGD: 1.35,
  HKD: 7.84,
  NZD: 1.68,
  DKK: 6.95,
  PLN: 4.22,
  HUF: 360.0,
  ILS: 3.60,
  SAR: 3.75,
  AED: 3.67,
  THB: 35.4,
  IDR: 15750,
  MYR: 4.70,
  VND: 24800,
  PHP: 58.5,
  KES: 153.0,
  NGN: 770.0,
  EGP: 30.9,
  BDT: 108.0,
  RON: 4.40,
  CZK: 23.4,
  ISK: 143.0,
  BTC: 0.000037, // aproximado (BTC como "moneda" ejemplo)
  ETH: 0.00055
};

// --- DOM refs
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const resultDiv = document.getElementById('result');
const timeDiv = document.getElementById('conversionTime');
const topRatesDiv = document.getElementById('topRates');
const indicatorsDiv = document.getElementById('economicIndicators');
const downloadRatesBtn = document.getElementById('downloadRatesBtn');
const footerUpdated = document.getElementById('footerUpdated');

// --- Populate selects
function populateCurrencySelects() {
  const keys = Object.keys(rates).sort((a,b)=> a.localeCompare(b));
  keys.forEach(code => {
    const o1 = document.createElement('option');
    o1.value = code;
    o1.textContent = `${code}`;
    fromSelect.appendChild(o1);

    const o2 = document.createElement('option');
    o2.value = code;
    o2.textContent = `${code}`;
    toSelect.appendChild(o2);
  });
  // Defaults
  fromSelect.value = 'USD';
  toSelect.value = 'EUR';
}

// --- Conversion
function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!rates[from] || !rates[to]) {
    resultDiv.textContent = 'Moneda desconocida.';
    timeDiv.textContent = '';
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = '⚠️ Ingresa un monto válido mayor a cero.';
    timeDiv.textContent = '';
    return;
  }

  // Fórmula correcta
  const fromRate = rates[from];
  const toRate = rates[to];
  const result = amount * (toRate / fromRate);

  // Mostrar con formato: detecta si moneda es grande (ej: IDR) y ajusta decimales
  const decimals = (result < 0.01) ? 8 : (result < 1 ? 6 : 2);
  const decimalsRate = (toRate < 1) ? 6 : 4;

  resultDiv.innerHTML = `
    ${Number(amount).toLocaleString(undefined, {maximumFractionDigits:2})} <strong>${from}</strong>
    ≈ <strong>${result.toLocaleString(undefined, {maximumFractionDigits:decimals})} ${to}</strong>
    <div class="meta small">Tasa: 1 ${from} = ${(toRate / fromRate).toLocaleString(undefined,{maximumFractionDigits:decimalsRate})} ${to}</div>
  `;

  const now = new Date();
  timeDiv.textContent = `Conversión (local): ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  // actualizar footer
  footerUpdated.textContent = now.toLocaleString();
}

// --- Mostrar tasas principales (ej base USD)
function showTopRates() {
  // listado destacadas
  const principales = ['USD','EUR','GBP','JPY','CNY','COP','MXN','BRL','ARS','CLP','INR','KRW','CAD','AUD','CHF'];
  topRatesDiv.innerHTML = '';
  principales.forEach(code => {
    if (rates[code] !== undefined) {
      const div = document.createElement('div');
      const rate = rates[code];
      div.textContent = `1 USD = ${Number(rate).toLocaleString(undefined,{maximumFractionDigits:6})} ${code}`;
      topRatesDiv.appendChild(div);
    }
  });
  // update indicators "mock" last update
  const now = new Date();
  const indLast = indicatorsDiv.querySelector('div:last-child');
  if (indLast) indLast.textContent = `Última actualización (local): ${now.toLocaleString()}`;
}

// --- Swap currencies
function swapCurrencies() {
  const a = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = a;
  if (amountInput.value) convertCurrency();
}

// --- Export rates as JSON (download)
function downloadRates() {
  const blob = new Blob([JSON.stringify({base:'USD', updated: new Date().toISOString(), rates}, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasas-internas.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- Keyboard: Enter to convert
function attachEnterKey() {
  amountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') convertCurrency();
  });
}

// --- Inicializar
window.addEventListener('DOMContentLoaded', () => {
  populateCurrencySelects();
  showTopRates();
  attachEnterKey();
  convertBtn.addEventListener('click', convertCurrency);
  swapBtn.addEventListener('click', swapCurrencies);
  downloadRatesBtn.addEventListener('click', downloadRates);

  // show initial footer updated
  footerUpdated.textContent = new Date().toLocaleString();

  // Si quieres: actualizar la UI periódicamente (solo visual)
  setInterval(showTopRates, 1000 * 60 * 5); // refresca panel cada 5 min (solo UI)
});
