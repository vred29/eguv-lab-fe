// FormPage.js
import React, { useState } from 'react';
import AddressSection from './AddressSection.jsx';
import PersonalDataSection from "./PersonalDataSection.jsx";
import CourseSection from "./CourseSection.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {createReservation} from "./reservation.js";
import ReportsList from "./ReportsList.jsx";
function FormPage() {
    const [personalData, setPersonalData] = useState({
        cnp: '',
        serieSiNumar: '',
        nume: '',
        prenume: '',
        email: '',
        telefon: '',
    });

    const [addressData, setAddressData] = useState({
        judet: '',
        oras: '',
        strada: '',
        codPostal: '',
    });

    const [productData, setProductData] = useState({
        domain: '',
        course: '',
        category: '',
        discount: '',
        startingDate: '',
        endingDate: '',
        price: '',
        nrPersoane: '',
        duration: ''
    })
    const [userType, setUserType] = useState('persoana_fizica'); // State to store the selected user type
    const [observatii, setObservatii] = useState(''); // State to store the selected user type

    const handleValidation = () => {
        return !(!userType || !productData.domain || !productData.course || !productData.startingDate || !productData.category
            || !personalData.nume || !personalData.prenume || !personalData.cnp || !personalData.serieSiNumar);
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleObservatiiChange = (e) => {
        setObservatii(e.target.value);
    };

    // TERMS AND CONDITIONS
    const [agreeToTerms, setAgreeToTerms] = useState(false); // Checkbox state

    function validate13Digits(inputString) {
        const pattern = /^\d{13}$/; // Regular expression pattern
        return pattern.test(inputString);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!agreeToTerms){
            toast.error('Trebuie sa fii de acord cu termenii si conditiile!', {
                position: 'bottom-right',
                autoClose: 5000, // Time in milliseconds for the toast to automatically close
            });
            return
        }

        if(handleValidation()){
            if(validate13Digits(personalData.cnp)){
                createReservation(productData, personalData, addressData, observatii)
                    .then((data) => {
                        if (data.success) {
                            toast.success('Reservation created successfully.', {
                                position: 'top-right',
                                autoClose: 5000,
                            });
                        } else {
                            // Handle errors or non-PDF responses here
                            toast.error('Error saving PDF or creating a reservation.', {
                                position: 'top-right',
                                autoClose: 5000,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error creating reservation:', error);
                        toast.error('An error occurred while creating a reservation.', {
                            position: 'top-right',
                            autoClose: 5000,
                        });
                    });
            } else {
                toast.error('CNP-ul nu este valid!', {
                    position: 'bottom-right',
                    autoClose: 5000, // Time in milliseconds for the toast to automatically close
                });
            }

        } else {
            toast.error('Toate campurile cu * trebuie completate!', {
                position: 'bottom-right',
                autoClose: 5000, // Time in milliseconds for the toast to automatically close
            });
        }

    };

    return (
        <div className={"main-container"}>
            <h1>Rezervari cursuri</h1>

            <form onSubmit={handleSubmit}>

                {/* User Type selection */}
                <div className={"user-type-container"}>
                    <label>
                        <input
                            className={"normal-input"}
                            type="radio"
                            name="userType"
                            value="persoana_fizica"
                            checked={userType === 'persoana_fizica'}
                            onChange={handleUserTypeChange}
                        />
                        Persoana Fizica
                    </label>
                    <label>
                        <input
                            className={"normal-input"}
                            type="radio"
                            name="userType"
                            value="persoana_juridica"
                            checked={userType === 'persoana_juridica'}
                            onChange={handleUserTypeChange}
                        />
                        Persoana Juridica
                    </label>
                </div>

                <CourseSection productData={productData} setProductData={setProductData} userType={userType}/>
                <PersonalDataSection personalData={personalData} setPersonalData={setPersonalData} userType={userType}/>
                <AddressSection addressData={addressData} setAddressData={setAddressData} />


                <h2>Optional:</h2>
                <label>Alte observatii:
                    <input
                        type="text"
                        name="observatii"
                        value={observatii}
                        onChange={handleObservatiiChange}
                    />
                </label>

                <label>
                    <input
                        className={"normal-input"}
                        type="checkbox"
                        name="agreeToTerms"
                        id={"termsCheckbox"}
                        checked={agreeToTerms}
                        onChange={() => setAgreeToTerms(!agreeToTerms)}
                    />
                    Sunt de acord cu termenii si conditiile*.
                </label>

                <button type="submit">Submit</button>
            </form>

            <ReportsList/>
            <ToastContainer />
        </div>
    );
}

export default FormPage;
