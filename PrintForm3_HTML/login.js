document.addEventListener('DOMContentLoaded', () => {
    const pinForm = document.getElementById('pinForm');
    const pinInputs = document.querySelectorAll('.pin-input');
    const errorMessage = document.getElementById('errorMessage');
    const correctPin = '123456'; // This should be replaced with proper backend validation

    // Auto-focus first input on page load
    pinInputs[0].focus();

    // Handle input in PIN fields
    pinInputs.forEach((input, index) => {
        // Handle numeric input and auto-advance
        input.addEventListener('input', (e) => {
            // Remove any non-numeric characters
            input.value = input.value.replace(/[^0-9]/g, '');

            if (input.value.length === 1) {
                // Move to next input if available
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
            }
        });

        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '') {
                // Move to previous input if available
                if (index > 0) {
                    pinInputs[index - 1].focus();
                }
            }
        });

        // Handle paste event
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            
            // Distribute pasted numbers across inputs
            for (let i = 0; i < pinInputs.length && i < pastedData.length; i++) {
                pinInputs[i].value = pastedData[i];
                if (i < pinInputs.length - 1) {
                    pinInputs[i + 1].focus();
                }
            }
        });
    });

    // Handle form submission
    pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect PIN digits
        const enteredPin = Array.from(pinInputs)
            .map(input => input.value)
            .join('');

        // Validate PIN length
        if (enteredPin.length !== 6) {
            showError('Please enter all 6 digits');
            return;
        }

        // In a real application, this should be a secure API call
        if (enteredPin === correctPin) {
            // Success animation
            pinInputs.forEach(input => {
                input.style.borderColor = 'var(--success-color)';
            });
            errorMessage.style.color = 'var(--success-color)';
            errorMessage.textContent = 'Access granted! Redirecting...';

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Error animation
            showError('Invalid PIN. Please try again.');
            pinInputs.forEach(input => {
                input.value = '';
                input.classList.add('error');
            });
            pinInputs[0].focus();

            // Remove error class after animation
            setTimeout(() => {
                pinInputs.forEach(input => input.classList.remove('error'));
            }, 500);
        }
    });

    function showError(message) {
        errorMessage.style.color = 'var(--danger-color)';
        errorMessage.textContent = message;
    }
}); 