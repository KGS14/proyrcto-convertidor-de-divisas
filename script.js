// Tasas de cambio (base USD)
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
  TRY: 27.0
};

// Referencias al DOM
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");
const timeDiv = document.getElementById("conversionTime");

// Llenar los selects con las monedas
for (let currency in rates) {
  let option1 = document.createElement("option");
  option1.value = currency;
  option1.textContent = currency;
  fromSelect.appendChild(option1);

  let option2 = document.createElement("option");
  option2.value = currency;
  option2.textContent = currency;
  toSelect.appendChild(option2);
}

// Valores por defecto
fromSelect.value = "USD";
toSelect.value = "EUR";

// Función de conversión
function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = "⚠️ Ingresa un monto válido mayor a cero.";
    timeDiv.textContent = "";
    return;
  }

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  const result = (amount / fromRate) * toRate;

  resultDiv.textContent = `${amount.toFixed(2)} ${fromCurrency} equivale a ${result.toFixed(2)} ${toCurrency}`;

  const now = new Date();
  timeDiv.textContent = `Conversión realizada el ${now.toLocaleDateString()} a las ${now.toLocaleTimeString()}`;
}

// Evento click
convertBtn.addEventListener("click", convertCurrency);
