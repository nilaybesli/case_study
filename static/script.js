async function fetchOptions(tableName) {
    const response = await fetch(`http://localhost:5000/${tableName}`);
    const data = await response.json();
    const uniqueOptions = [...new Map(data.map(item => [item.name, item])).values()];
    return uniqueOptions.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
}

async function generateForm() {
    const rowDimension1 = document.getElementById('rowDimension1').value;
    const rowDimension2 = document.getElementById('rowDimension2').value;
    const columnDimension = document.getElementById('columnDimension').value;
    const errorMessageDiv = document.getElementById('errorMessage');

    if (rowDimension1 === rowDimension2) {
        errorMessageDiv.textContent = "The two row dimensions must be different.";
        document.getElementById('generatedForm').innerHTML = '';
        document.getElementById('salesTable').innerHTML = '';
        return;
    }

    const rowOptions1 = await fetchOptions(rowDimension1);
    const rowOptions2 = await fetchOptions(rowDimension2);
    const columnOptions = await fetchOptions(columnDimension);

    const formHtml = `
        <h2>Generated Form</h2>
        <form id="dataEntryForm">
            <label for="${rowDimension1}">${capitalizeFirstLetter(rowDimension1)}:</label>
            <select id="${rowDimension1}" name="${rowDimension1}_id" required>
                ${rowOptions1}
            </select><br><br>
            <label for="${rowDimension2}">${capitalizeFirstLetter(rowDimension2)}:</label>
            <select id="${rowDimension2}" name="${rowDimension2}_id" required>
                ${rowOptions2}
            </select><br><br>
            <label for="${columnDimension}">${capitalizeFirstLetter(columnDimension)}:</label>
            <select id="${columnDimension}" name="${columnDimension}_id" required>
                ${columnOptions}
            </select><br><br>
            <label for="amount">Amount:</label>
            <input type="number" id="amount" name="amount" required><br><br>
            <button type="button" onclick="submitData()">Submit Data</button>
            <button type="button" onclick="refreshData()">Refresh</button>
        </form>
    `;

    document.getElementById('generatedForm').innerHTML = formHtml;
    errorMessageDiv.textContent = '';
    refreshData();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function submitData() {
    const formData = new FormData(document.getElementById('dataEntryForm'));
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    const response = await fetch('http://localhost:5000/sales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    const data = await response.json();
    alert(data.message);
    refreshData(); 
}

async function refreshData() {
    const rowDimension1 = document.getElementById('rowDimension1').value;
    const rowDimension2 = document.getElementById('rowDimension2').value;
    const columnDimension = document.getElementById('columnDimension').value;

    try {
        const response = await fetch(`http://localhost:5000/sales-data?row_dimension1=${rowDimension1}&row_dimension2=${rowDimension2}&column_dimension=${columnDimension}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displaySalesData(data);
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}

function displaySalesData(salesData) {
    if (!salesData.length) {
        document.getElementById('salesTable').innerHTML = '<p>No data available</p>';
        return;
    }

    const columns = Object.keys(salesData[0]).filter(column => column !== 'amount');
    const tableHtml = `
        <h2>Sales Data</h2>
        <table>
            <thead>
                <tr>
                    ${columns.map(column => `<th>${capitalizeFirstLetter(column.replace('_id', ''))}</th>`).join('')}
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${salesData.map(sale => `
                    <tr>
                        ${columns.map(column => `<td>${sale[column]}</td>`).join('')}
                        <td>${sale.amount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('salesTable').innerHTML = tableHtml;
}
