# Building the NEXUS APK

## Requirements

- Node.js 18+
- Java 17 or 21 (JDK)
- Android Studio (recommended) **or** Android SDK command-line tools
  - `compileSdkVersion` 36, `minSdkVersion` 24

---

## Quick steps

### 1. Install dependencies & build web layer

```bash
npm install
npm run build          # builds dist/ (web assets)
```

### 2. Sync web assets into the Android project

```bash
npx cap sync android   # copies dist/ into android/app/src/main/assets/public/
```

### 3. Set your local Android SDK path

```bash
cp android/local.properties.template android/local.properties
# Edit android/local.properties — set sdk.dir to your Android SDK path
```

### 4. Build the debug APK

```bash
cd android
./gradlew assembleDebug
```

The APK will be at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. (Optional) Install directly to a connected device

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Using Android Studio (easier)

1. Open Android Studio
2. **File → Open** → select the `android/` folder
3. Wait for Gradle sync to complete
4. **Build → Build Bundle(s)/APK(s) → Build APK(s)**

---

## Release APK (for distribution)

To build a signed release APK, generate a keystore first:

```bash
keytool -genkey -v -keystore nexus-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias nexus
```

Then build:

```bash
cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=../nexus-release.jks \
  -Pandroid.injected.signing.store.password=YOUR_STORE_PASS \
  -Pandroid.injected.signing.key.alias=nexus \
  -Pandroid.injected.signing.key.password=YOUR_KEY_PASS
```

---

## How the web-to-APK wrapping works

NEXUS is built with **Capacitor** (Ionic's web-to-native bridge):

- The React web app compiles to `dist/`
- `npx cap sync` copies it into `android/app/src/main/assets/public/`
- The Android app loads the web assets in a full-screen WebView
- `capacitor.config.ts` sets the app ID, name, and web root
- Offline-first by design — no network requests needed at runtime

