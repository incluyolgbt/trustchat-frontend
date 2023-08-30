import React from "react";

function useLocalStorage(itemName, initialValue) {
    const [item, setItem] = React.useState(initialValue);
    

    React.useEffect(() => {
        try {
            const localStorageItem = localStorage.getItem(itemName);

            let parsedItem;
            if (!localStorageItem) {
                localStorage.setItem(itemName, JSON.stringify(initialValue));
                parsedItem = initialValue;
            } else {
                parsedItem = JSON.parse(localStorageItem)
                setItem(parsedItem)
            }

        } catch (error) {

        }
    }, []);


    const saveItem = (newItem) => { 
        let temp = JSON.parse(localStorage.getItem('generalMsgs'));
        temp = [newItem, ...temp];
        setItem(temp);
        localStorage.setItem(itemName, JSON.stringify(temp));
    }

    const deleteItems = () => {
        localStorage.removeItem(itemName);
    }

    return {
        item,
        saveItem,
        deleteItems
    };
}

export { useLocalStorage };