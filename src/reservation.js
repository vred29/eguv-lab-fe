import saveAs from 'file-saver';
export const createReservation = (productData, personalData, addressData, observatii) => {

    const reservationData = {
        startingDate: productData.startingDate,
        cost: productData.price,
        discountCategory: productData.discount,

        nume: personalData.nume,
        surname: personalData.nume,
        cnp: personalData.cnp,
        seriesAndNumber: personalData.serieSiNumar,
        email: personalData.email,
        phone: personalData.telefon,

        judet: addressData.judet,
        oras: addressData.oras,
        street: addressData.strada,
        codPostal: addressData.codPostal,

        course: productData.course,
        observatii: observatii
    };
    console.log(reservationData)

    return fetch('http://localhost:8080/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
    })
        .then((response) => {
            if (response.ok) {
                // Check the content type of the response
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.startsWith('application/pdf')) {
                    // It's a PDF response, save it using FileSaver
                    return response.blob().then((pdfBlob) => {
                        const filename = 'reservation.pdf'; // Specify the desired filename
                        saveAs(pdfBlob, filename);
                        return { success: true };
                    });
                } else {
                    // Not a PDF response, return an error
                    throw new Error('Response is not a PDF');
                }
            } else {
                throw new Error('Failed to create a reservation.');
            }
        });
};
