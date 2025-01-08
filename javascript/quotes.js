document.addEventListener("DOMContentLoaded", fetchQuote);

async function fetchQuote() {
    const apiKey = 'vcxiYSm+/N/9GtXDFAUVMQ==lVJj0yyAl1mDyW9x'; 
    
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/quotes?category=life", {
            method: 'GET',
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`Eroare la API: ${response.statusText}`);
        }

        const data = await response.json();
        const quote = data[0]; 

        document.getElementById("quote").innerHTML = `
            <p>"${quote.quote}"</p>
            <p><strong>- ${quote.author}</strong></p>
        `;
    } catch (error) {
        console.error("Eroare la încărcarea citatului:", error);
        document.getElementById("quote").innerHTML = "<p>Unable to load quote at the moment.</p>";
    }
}
