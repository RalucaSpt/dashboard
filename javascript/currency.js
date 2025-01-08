const apiKey = 'ef5ffc451f06478b9d795bdfa7587f5c';
const apiUrlLatest = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
const apiUrlCurrencies = `https://openexchangerates.org/api/currencies.json`;

const currencyForm = document.getElementById('currency-form');
const exchangeRatesContainer = document.getElementById('exchange-rates');
const currenciesSelect = document.getElementById('currencies');
const baseCurrencySelect = document.getElementById('base-currency');

// Funcție pentru a prelua lista de valute și a popula selecturile
async function fetchCurrencies() {
    try {
        const response = await fetch(apiUrlCurrencies);
        if (!response.ok) {
            throw new Error('Eșec la preluarea listei de valute');
        }
        const currencies = await response.json();
        populateCurrencySelects(currencies);
    } catch (error) {
        alert(`Eroare la preluarea listei de valute: ${error.message}`);
    }
}

function populateCurrencySelects(currencies) {
    for (const [code, name] of Object.entries(currencies)) {
        // Populează selectul pentru valutele dorite
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${name}`;
        currenciesSelect.appendChild(option);

        // Populează selectul pentru moneda de bază
        const baseOption = document.createElement('option');
        baseOption.value = code;
        baseOption.textContent = `${code} - ${name}`;
        baseCurrencySelect.appendChild(baseOption);
    }
    // Setează USD ca moneda de bază implicită
    baseCurrencySelect.value = 'USD';
}

// Eveniment la submit-ul formularului
currencyForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedCurrencies = Array.from(currenciesSelect.selectedOptions).map(option => option.value);
    const baseCurrency = baseCurrencySelect.value;

    if (selectedCurrencies.length > 0) {
        fetchExchangeRates(baseCurrency, selectedCurrencies);
    } else {
        exchangeRatesContainer.innerHTML = '<p>Te rugăm să selectezi cel puțin o valută.</p>';
    }
});

// Funcție pentru a prelua cursurile valutare
async function fetchExchangeRates(baseCurrency, selectedCurrencies) {
    try {
        exchangeRatesContainer.innerHTML = '<p>Se încarcă cursurile valutare...</p>';
        const response = await fetch(apiUrlLatest);
        if (!response.ok) {
            throw new Error('Eșec la preluarea cursurilor valutare');
        }
        const data = await response.json();

        if (!data.rates[baseCurrency]) {
            throw new Error(`Moneda de bază selectată (${baseCurrency}) nu este disponibilă.`);
        }

        // Calculează cursurile în funcție de moneda de bază selectată
        const adjustedRates = {};
        const baseRate = data.rates[baseCurrency];

        selectedCurrencies.forEach(currency => {
            if (data.rates[currency]) {
                const rate = data.rates[currency] / baseRate;
                adjustedRates[currency] = rate;
            }
        });

        displayExchangeRates(adjustedRates, baseCurrency);
    } catch (error) {
        exchangeRatesContainer.innerHTML = `<p>Eroare la preluarea cursurilor valutare: ${error.message}</p>`;
    }
}


// Funcție pentru a afișa cursurile valutare selectate
function displayExchangeRates(rates, baseCurrency) {
    exchangeRatesContainer.innerHTML = `<h2>Cursuri Valutare Selectate (Bază: ${baseCurrency})</h2>`;
    const list = document.createElement('ul');
    for (const [currency, rate] of Object.entries(rates)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${currency}: ${rate.toFixed(6)}`;
        list.appendChild(listItem);
    }
    exchangeRatesContainer.appendChild(list);
}


// Preia lista de valute la încărcarea paginii
fetchCurrencies();
