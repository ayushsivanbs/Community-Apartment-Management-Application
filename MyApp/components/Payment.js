import { Linking, Alert } from 'react-native';

// Replace with actual UPI ID
const UPI_ID = "";

const openGooglePay = async (amount) => {
    const url = `upi://pay?pa=${UPI_ID}&pn=Your Name&mc=0000&tid=1234567890&tr=1234&tn=Test Payment&am=${amount}&cu=INR&url=yourapp://upiresponse`;

    try {
        await Linking.openURL(url);
    } catch (err) {
        Alert.alert("Error", "Could not open UPI app");
        console.error("Error opening UPI app:", err);
    }
};

// Listen for UPI Response
const handleDeepLink = (event) => {
    console.log("Deep link received:", event);

    if (!event.url) {
        Alert.alert("Error", "No response from UPI app");
        return;
    }

    console.log("Full Response URL:", event.url);

    try {
        const params = new URLSearchParams(event.url.split('?')[1]);
        const status = params.get('Status');
        const txnId = params.get('txnId');

        if (status === "SUCCESS") {
            Alert.alert("Payment Successful", `Transaction ID: ${txnId}`);
            console.log("✅ Payment Successful! Transaction ID:", txnId);
        } else if (status === "FAILURE" || status === "FAILED") {
            Alert.alert("Payment Failed", "Transaction was unsuccessful");
            console.log("❌ Payment Failed!");
        } else if (status === "PENDING") {
            Alert.alert("Payment Pending", "Transaction is still processing");
            console.log("⏳ Payment Pending!");
        } else {
            Alert.alert("Error", "Unknown response from UPI app");
            console.log("⚠️ Unknown UPI Response:", event.url);
        }
    } catch (error) {
        console.error("Error parsing UPI response:", error);
    }
};

// Attach Deep Linking Listener
Linking.addEventListener('url', handleDeepLink);

// Manually get the initial URL when app opens
Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
});

export { openGooglePay };
