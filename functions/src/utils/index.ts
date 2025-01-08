export function isValidEmail(email: string) {
    // Define the email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the pattern
    return emailRegex.test(email);
}