// Function to display a toast notification using Semantic UI
const showToast = (message, className, displayTime = 4000, position = 'top left') => {
    $('body').toast({
        message: message,
        class: className,
        position: position,
        displayTime: displayTime 
    });
};

$(document).ready(function() {
    // 1. Check for a Success Message (passed via server-side rendering)
    // The server must render the message into a hidden element or a global JS variable.
    const successMsg = $('#flash-success-message').text().trim();
    if (successMsg.length > 0) {
        showToast(successMsg, 'green');
    }

    // 2. Check for an Error Message (passed via server-side rendering)
    const errorMsg = $('#flash-error-message').text().trim();
    if (errorMsg.length > 0) {
        // Errors often stay visible longer (displayTime: 0)
        showToast(errorMsg, 'red', 0); 
    }
    
});