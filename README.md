# Midas Retool Project

 A frontfacing Retool project backed by GCP and Firebase structure, designed to let users add account balances with purchases through Braintree API and buy items with said balance. Application can currently only be accessed through Retool sharing.

## Description

### Client Side (Frontend)

- **Retool Application**:
  - Provides the user interface for interacting with the application.
  - Manages user authentication and displays data.
  - Includes the Braintree Drop-in UI for processing payments and adding account balance.
  - Sign-In and Sign-Up possible through Google SSO.
  - Item purchases can be made through dynamic item list linked to Firestore.

### Backend (Firebase)

- **Firebase Authentication**:
  - Manages user sign-in and sign-up processes.
  - Issues authentication tokens for secure communication.

- **Firebase Callable Functions**:
  - Hosts backend logic for processing requests.
  - Validates authentication tokens and handles business logic.
  - Interacts with the Firestore Database to fetch or update data.
  - Communicates with the Braintree API to process payments.

- **Firestore Database**:
  - Stores user, item and transaction data.

### Payment Processing

- **Braintree Drop-in UI**:
  - Provides a user-friendly interface for entering payment details.
  - Integrates directly within the Retool application.

- **Braintree API (via Firebase Functions)**:
  - Processes payments securely.
  - Manages transactions and payment methods.
  - Returns payment status and details to Firebase Functions.

### Communication Flow

1. **User Interaction**:
   - User interacts with the Retool application.
   - Retool handles user authentication and displays relevant data.
   - User initiates a payment through the Braintree Drop-in UI.

2. **Authentication**:
   - Retool obtains an authentication token from Firebase Authentication.
   - The token is used to authenticate requests to Firebase Callable Functions.

3. **Backend Processing**:
   - Retool sends requests to Firebase Callable Functions, including the authentication token.
   - Firebase Callable Functions validate the token and process the request.
   - Callable Functions interact with the Firestore Database to fetch or update data.

4. **Payment Processing**:
   - User submits payment information via the Braintree Drop-in UI.
   - Retool sends the payment details to Firebase Callable Functions.
   - Firebase Callable Functions communicate with the Braintree API to process the payment.
   - Payment status and details are updated in the Firestore Database.

5. **Data Synchronization**:
   - Firestore Database provides data updates to the Callable Functions.
   - Callable Functions send the processed data back to Retool.

6. **Display Data**:
   - Retool receives data from Firebase Callable Functions and displays it to the user.

## Database Model

![midas_dataModel](https://github.com/user-attachments/assets/d171e5df-0978-4a41-a7da-329b3179f747)

## System Architecture

![midas_system_arch](https://github.com/user-attachments/assets/f1a5e363-bdfa-40a7-807c-be2b71bbb52a)

