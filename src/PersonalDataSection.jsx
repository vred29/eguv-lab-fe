// PersonalSection.js
import React, { useState } from 'react';

function PersonalSection({ personalData, setPersonalData, userType }) {
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalData({
            ...personalData,
            [name]: value,
        });
    };

    return (
        <div className={"section-container"}>
            <h2>{userType === 'persoana_fizica' ? "Date Personale" : "Date de Contact"}</h2>
            <label>*Nume:
                <input
                    type="text"
                    name="nume"
                    value={personalData.nume}
                    onChange={handlePersonalChange}
                />
            </label>
            <br />

            <label>*Prenume:
                <input
                    type="text"
                    name="prenume"
                    value={personalData.prenume}
                    onChange={handlePersonalChange}
                />
            </label>
            <br />

            <label>
                {userType === 'persoana_fizica' ? "*CNP:" : "*CUI:"}
                <input
                    type="text"
                    name="cnp"
                    value={personalData.cnp}
                    onChange={handlePersonalChange}
                />
            </label>
            <br />

            <label>*Serie si numar:
                <input
                    type="text"
                    name="serieSiNumar"
                    value={personalData.serieSiNumar}
                    onChange={handlePersonalChange}
                />
            </label>
            <br />

            <label>Email:
                <input
                    type="email"
                    name="email"
                    value={personalData.email}
                    onChange={handlePersonalChange}
                />
            </label>
            <br />

            <label>Telefon:
                <input
                    type="tel"
                    name="telefon"
                    value={personalData.telefon}
                    onChange={handlePersonalChange}
                />
            </label>
            <br />
        </div>
    );
}

export default PersonalSection;
