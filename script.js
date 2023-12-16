const result = document.querySelector('#result');
const currency1 = document.querySelector('#currency1');
const currency2 = document.querySelector('#currency2');
const amount = document.querySelector('#amount-field');
const form = document.querySelector('#form');

let currencyRates = [];

form.addEventListener('submit', function(event) {
    event.preventDefault();
});

// load in the curency rates
window.addEventListener('load', async function(event) {
    try {
        const res = await axios.get('https://api.exchangerate-api.com/v4/latest/euro');
        currencyRates = res.data.rates;
        let currencyArr = Object.keys(currencyRates);
        addCurrencies(currencyArr);
    } catch (e) {
        console.log('Error', e)
    }
})

// adding currencies to select
const addCurrencies = currencies => {
    for (currency of currencies) {
        const option1 = document.createElement('option');
        option1.innerHTML = `<option value='${currency}'>${currency.toUpperCase()}</option`;
        currency1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.innerHTML = `<option value='${currency}'>${currency.toUpperCase()}</option`;
        currency2.appendChild(option2);

        // Default values
        if (currency === 'EUR') {
            option1.selected = true;
        }
        if (currency === 'USD') {
            option2.selected = true;
        }
    }
}

// give the result
amount.addEventListener('input', async function(event) {
    try {
        updateResult();
    } catch (e) {
        console.log('Error', e);
    }
})

const updateResult = () => {
    const inputValue = amount.value;
    converter(inputValue);
};

// calculations
const converter = value => {
    let rgx = /^[\d.]{1,23}$/.test(value);
    if (rgx) {
        result.classList.remove('text-danger');
        let parsedValue = parseFloat(value);
        
        let currency1ASD = currency1.value;
        let currency2ASD = currency2.value;

        let parsedCurrency1 = parseFloat(currencyRates[currency1ASD]);
        let parsedCurrency2 = parseFloat(currencyRates[currency2ASD]);

        console.log(parsedCurrency2)

        let resultValue = (parsedValue / parsedCurrency1) * parsedCurrency2;
        let finalResult = parseFloat(resultValue.toFixed(2));
        result.innerText = `${value} ${currency1.value} = ${finalResult} ${currency2.value}`;

    } else if (value == '') {
        result.innerText = '';
    } else {
        result.innerText = 'Enter a valid number';
        result.classList.add('text-danger')
    }
}


// logic for when currency changes
currency1.addEventListener('change', function(event) {
    updateResult();
});

currency2.addEventListener('change', function(event) {
    updateResult();
});

