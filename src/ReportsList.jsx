import React, {useEffect, useState} from 'react';

function ReportsList(props) {
    const [rezervari, setRezervari] = useState([]);

    useEffect(() => {
        // Funcție pentru a obține lista de rezervări
        const getRezervari = async () => {
            try {
                const response = await fetch('http://localhost:8080/reports');
                const data = await response.json();
                setRezervari(data);
            } catch (error) {
                console.error('Eroare la obținerea listei de rezervări:', error);
            }
        };

        // Apelarea funcției de obținere a listei de rezervări
        getRezervari();
    }, []); // [] asigură rularea efectului doar o singură dată, la încărcarea componentei

    const handleClick = async (reportId, numeFisier) => {
        try {
            const response = await fetch(`http://localhost:8080/reports/${reportId}/pdf`);
            if (!response.ok) {
                throw new Error('Failed to download PDF');
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.startsWith('application/pdf')) {
                const pdfBlob = await response.blob();
                const filename = numeFisier; // Utilizăm numele furnizat de server

                // Utilizăm saveAs pentru a descărca fișierul
                saveAs(pdfBlob, filename);

                return { success: true };
            } else {
                throw new Error('Response is not a PDF');
            }
        } catch (error) {
            console.error('Eroare la descărcarea PDF-ului:', error.message);
        }
    };

    return (
        <div>
            <h2>Listă de Rezervări</h2>
            <ul>
                {rezervari.map((rezervare) => (
                    <li
                        key={rezervare.id}
                        className={"report-list-item"}
                        onClick={() => handleClick(rezervare.id, rezervare.name)}
                    >
                        {rezervare.name} {/* Sau cum este definit în DTO-ul tău */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReportsList;