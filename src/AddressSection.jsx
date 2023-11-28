import React, { useState } from 'react';

function AddressSection({ addressData, setAddressData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressData({
            ...addressData,
            [name]: value,
        });
    };

    return (
        <div className={"section-container"}>
            <h2>Adresa de domiciliu</h2>
            <label>Judet:
                <input
                    type="text"
                    name="judet"
                    value={addressData.judet}
                    onChange={handleChange}
                />
            </label>
            <br />

            <label>Oras:
                <input
                    type="text"
                    name="oras"
                    value={addressData.oras}
                    onChange={handleChange}
                />
            </label>
            <br />

            <label>Strada:
                <input
                    type="text"
                    name="strada"
                    value={addressData.strada}
                    onChange={handleChange}
                />
            </label>
            <br />

            <label>Cod postal:
                <input
                    type="number"
                    name="codPostal"
                    value={addressData.codPostal}
                    onChange={handleChange}
                />
            </label>
            <br />
        </div>
    );
}

export default AddressSection;
