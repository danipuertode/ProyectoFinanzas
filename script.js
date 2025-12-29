document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("finance-chart").getContext("2d");

    let financeChart = new Chart(ctx, {
        type: "doughnut", // Gráfica de tipo dona
        data: {
            labels: ["Ingreso", "Gasto"], // Etiquetas fijas para los tipos
            datasets: [
                {
                    label: "Monto",
                    data: [0, 0], // Inicialmente, 0 para ingreso y gasto
                    backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
                    borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Resumen de Finanzas",
                },
            },
        },
    });

    const table = document.getElementById("transaction-table");
    const tableBody = table.querySelector("tbody");
    const totalsDiv = document.getElementById("totals");
    const totalIngresosSpan = document.getElementById("total-ingresos");
    const totalGastosSpan = document.getElementById("total-gastos");
    const balanceTotalSpan = document.getElementById("balance-total");

    let totalIngresos = 0;
    let totalGastos = 0;

    // Función para actualizar los totales
    function updateTotals() {
        totalIngresosSpan.textContent = totalIngresos.toFixed(2);
        totalGastosSpan.textContent = totalGastos.toFixed(2);
        const balanceTotal = totalIngresos - totalGastos;
        balanceTotalSpan.textContent = balanceTotal.toFixed(2);

        // Cambiar el color del balance total según su valor
        if (balanceTotal < 0) {
            balanceTotalSpan.style.color = "red"; // Rojo si es negativo
        } else {
            balanceTotalSpan.style.color = "black"; // Negro si es positivo o cero
        }

        // Mostrar u ocultar el contenedor de totales
        totalsDiv.style.display = totalIngresos > 0 || totalGastos > 0 ? "block" : "none";

        // Actualizar la gráfica con los totales
        updateChartFromTotals();
    }

    // Función para actualizar la gráfica desde los totales
    function updateChartFromTotals() {
        const dataset = financeChart.data.datasets[0];
        dataset.data[0] = parseFloat(totalIngresosSpan.textContent); // Total ingresos
        dataset.data[1] = parseFloat(totalGastosSpan.textContent); // Total gastos
        financeChart.update();
    }

    // Función para agregar una transacción a la tabla
    function addTransactionToTable(type, category, amount) {
        const rowIndex = tableBody.rows.length;

        const row = document.createElement("tr");
        row.dataset.index = rowIndex; // Guardar el índice original de la fila
        row.innerHTML = `
            <td>${type}</td>
            <td>${category}</td>
            <td>${amount.toFixed(2)} €</td>
            <td>${new Date().toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);

        // Actualizar los totales
        if (type === "ingreso") {
            totalIngresos += amount;
        } else if (type === "gasto") {
            totalGastos += amount;
        }
        updateTotals();
    }

    // Manejar el formulario para agregar transacciones
    const form = document.getElementById("transaction-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (!isNaN(amount) && category.trim() !== "") {
            addTransactionToTable(type, category, amount);
            form.reset();
        }
    });
});