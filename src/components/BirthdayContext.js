import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const BirthdayContext = createContext({
    birthdays: [],
    addBirthday: () => {},
    updateBirthday: () => {},
    deleteBirthday: () => {},
});

const BirthdayProvider = ({ children }) => {
    const [birthdays, setBirthdays] = useState(() => {
        // Load birthdays from localStorage if available
        const storedBirthdays = localStorage.getItem('birthdays');
        return storedBirthdays ? JSON.parse(storedBirthdays) : [];
    });

    // Persist birthdays to local storage on changes
    useEffect(() => {
        localStorage.setItem('birthdays', JSON.stringify(birthdays));
    }, [birthdays]);

    const addBirthday = (birthday) => {
        const newBirthday = {
            id: uuidv4(),
            ...birthday,
            dateOfBirth: new Date(birthday.dateOfBirth).toISOString()
        };
        setBirthdays((prevBirthdays) => [...prevBirthdays, newBirthday]);
    };

    const updateBirthday = (id, updatedData) => {
        const updatedBirthdays = birthdays.map((birthday) =>
            birthday.id === id ? { ...birthday, ...updatedData } : birthday
        );
        setBirthdays(updatedBirthdays);
    };

    const deleteBirthday = (id) => {
        setBirthdays((prevBirthdays) => prevBirthdays.filter((birthday) => birthday.id !== id));
    };

    return (
        <BirthdayContext.Provider value={{ birthdays, addBirthday, updateBirthday, deleteBirthday }}>
            {children}
        </BirthdayContext.Provider>
    );
};

export default BirthdayProvider;