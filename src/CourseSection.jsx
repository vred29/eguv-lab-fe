import React, {useEffect, useState} from 'react';

function CourseSection({ productData, setProductData, userType }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };
    const [domainsList, setDomainsList] = useState([]);
    const [coursesList, setCoursesList] = useState([]); // State for courses

    const [discountsList, setDiscountsList] = useState([]);

    useEffect(() => {
        // Make a GET request to get domains from the API
        fetch('http://localhost:8080/domains')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update the state with the received data
                setDomainsList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        // Make a GET request to fetch the discounts from the API
        fetch('http://localhost:8080/discounts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update the state with the received data
                setDiscountsList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Event handler when a domain is selected
    const handleDomainSelect = (e) => {
        const selectedDomainId = e.target.value;

        if (selectedDomainId) {
            // Make a GET request to /courses with the selected domainId as a query parameter
            fetch(`http://localhost:8080/courses/byName?domainName=${selectedDomainId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    // Update the coursesList state with the received data
                    setCoursesList(data);
                })
                .catch((error) => {
                    console.error('Error fetching courses:', error);
                });
        } else {
            // Reset coursesList if no domain is selected
            setCoursesList([]);
        }
        handleChange(e)
    };

    const handleCourseSelect = (e) => {
        const { name, value } = e.target;
        const selectedCourse = coursesList.find((course) => course.name === value);
        if (selectedCourse) {
            setProductData({
                ...productData,
                [name]: value,
                price: selectedCourse.price, // Assuming 'price' is the key in productData for the course price.
                nrPersoane: selectedCourse.numberOfPersons,
                duration: selectedCourse.duration,
            });
        } else {
            setProductData({
                ...productData,
                [name]: value,
                price: null, // Set a default value when the selected course is not found.
            });
        }
    };

    const handleDiscountSelect = (e) => {
        const { name, value } = e.target;
        const selectedCategory = discountsList.find((discount) => discount.name === value);
        if (selectedCategory && (productData.price !== null)) {
            // const discountedPrice = productData.price - productData.price * selectedCategory.percentage / 100
            setProductData({
                ...productData,
                [name]: value,
                'discount': selectedCategory.percentage
            });
        }
    };

    function addDays(date, days) {
        const dateCopy = new Date(date);
        dateCopy.setDate(date.getDate() + days);

        const year = dateCopy.getFullYear();
        const month = String(dateCopy.getMonth() + 1).padStart(2, '0');
        const day = String(dateCopy.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    const handleStartingDate = (e) => {
        const { name, value } = e.target;

        const startingDate = new Date(value)
        const endingDate = addDays(startingDate, productData.duration);

        setProductData({
            ...productData,
            [name]: value,
            endingDate
        });
    };

    return (
        <div className={"section-container"}>
            <h2>Cursuri avizate</h2>
            {/*DOMENIU*/}
            <label>
                *Alegeti un domeniu:
                <select
                    name="domain"
                    value={productData.domain}
                    onChange={handleDomainSelect}
                >
                    <option value="">--Alegeti un domeniu--</option>
                    {domainsList.map((domain) => (
                        <option key={domain.id} value={domain.name}>
                            {domain.name}
                        </option>
                    ))}
                </select>
            </label>

            {/*CURS*/}
            <label>
                *Alegeti un curs:
                <select
                    name="course"
                    value={productData.course}
                    onChange={handleCourseSelect}
                >
                    <option value="">--Alegeti un curs--</option>
                    {coursesList.map((course) => (
                        <option key={course.id} value={course.name} price={course.price}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </label>

            {/*Duration*/}
            <div className={"centered-text"}>
                {`Durata Curs: ${productData.duration} zile`}
            </div>

            {/* Starting Date field */}
            <label>
                *Starting Date:
                <input
                    type="date"
                    name="startingDate"
                    value={productData.startingDate}
                    onChange={handleStartingDate}
                />
            </label>

            {/* Ending Date field */}
            <label>
                Ending Date:
                <input
                    type="date"
                    name="endingDate"
                    disabled={true}
                    value={productData.endingDate}
                />
            </label>

            {/*CATEGORIE DISCOUNT*/}
            {
                userType === 'persoana_fizica' &&
                (
                    <label>
                        *Alegeti o categorie:
                        <select
                            name="category"
                            value={productData.category}
                            onChange={handleDiscountSelect}
                        >
                            <option value="">-- Alegeti o categorie --</option>
                            {discountsList.map((discount) => (
                                <option key={discount.id} value={discount.name}>
                                    {discount.name}
                                    {discount.percentage > 0 ? ` (Reducere ${discount.percentage}%)` : null}
                                </option>
                            ))}
                        </select>
                    </label>
                )
            }

            {/* Price field */}
            {
                userType === 'persoana_fizica'
                ?
                (
                    <label>
                        Pret:
                        <input
                            type="number"
                            disabled={true}
                            name="price"
                            value={productData.price - productData.price * productData.discount / 100}
                            onChange={handleChange}
                        />
                    </label>
                ) :
                (
                    <label>
                        Nr. max. persoane:
                        <input
                            type="number"
                            disabled={true}
                            name="nrPersoane"
                            value={productData.nrPersoane}
                            onChange={handleChange}
                        />
                    </label>
                )
            }

        </div>
    );
}

export default CourseSection;
