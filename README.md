# Mobile App v1

A React Native mobile application built with [Expo](https://expo.dev/) and [Expo Router](https://docs.expo.dev/router/introduction/). This app supports creating and managing user profiles, with async data storage, navigation, and testing included.

---

## 📦 Features

- ✅ Login & Registration with phone number
- ✅ Custom Profile creation and viewing
- ✅ AsyncStorage-based persistence
- ✅ API integration for user management
- ✅ Fully typed with TypeScript
- ✅ Jest unit tests with snapshot support
- ✅ Expo Router and Native Stack navigation

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9 or yarn
- Xcode (for iOS Simulator)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

Install it if not already:

```bash
npm install -g expo-cli
```

---

### Install Dependencies

```bash
npm install
```

---

### Start the App

To run the app in iOS simulator (requires macOS and Xcode):

```bash
npx expo run:ios
```

For Android or web support:

```bash
npx expo start
```

---

## 🧪 Testing

This project uses **Jest** and **React Native Testing Library**.

### Run All Tests

```bash
npx jest
```

### Update Snapshots

```bash
npx jest --updateSnapshot
```

---

## 🗂️ Project Structure

```
/components         → Reusable UI components (InputField, Buttons, etc.)
/screens            → Core screens (Login, Register, Profile, etc.)
/__tests__          → Unit tests for screens & components
/theme              → Centralized styles/colors/metrics
/constants          → Static constants (like COLORS)
/navigation         → Navigation setup with Expo Router
```

---

## 🧠 Important Notes

- **AsyncStorage** is used for client-side data persistence.
- API requests are made to `http://localhost:8000` by default (adjust for device testing).
- Be sure to handle permissions and environment-specific URLs in production.

---

## License

This project is licensed under a proprietary license. All rights are reserved by NextStep Edge.  
See the [PROPRIETARY_LICENSE.md](./PROPRIETARY_LICENSE.md) file for details.
