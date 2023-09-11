// Date Formatting Helper
const formatDateTime = (dateTimeString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    
    const dateObj = new Date(dateTimeString);
    return dateObj.toLocaleDateString('en-GB', options);
};

// New function to format only month and day
const formatMonthDay = (dateTimeString) => {
    const options = {
        month: 'short',
        day: 'numeric'
    };

    const dateObj = new Date(dateTimeString);
    return dateObj.toLocaleDateString('en-GB', options);
};

export { formatDateTime, formatMonthDay };
