# Android Build Tools Troubleshooting

The error `Could not locate aapt` usually happens when Flutter tries to use a version of the Android Build Tools that is either corrupted, incomplete, or missing specific binaries, even if the folder exists.

## The Issue
Your system seems to be looking for Build Tools version **36.1.0**, but `aapt` is missing from it.

## Solutions

### Option 1: Install Missing Build Tools (Recommended)
1. Open **Android Studio**.
2. Go to **Settings/Preferences** > **Languages & Frameworks** > **Android SDK**.
3. Click on the **SDK Tools** tab.
4. Check **Show Package Details** (bottom right).
5. Expand **Android SDK Build-Tools**.
6. Check **36.1.0** (and **35.0.0** if not checked).
7. Click **Apply** to install.

### Option 2: Remove Corrupted Version
If `36.1.0` is installed but broken, forcing Flutter to use an older version can work.
1. Open your terminal.
2. Run:
   ```bash
   rm -rf ~/Library/Android/sdk/build-tools/36.1.0
   ```
   *Flutter should then fall back to the next available version (e.g., 36.0.0-rc1 or 35.0.0).*

### Option 3: Force Version in Gradle
We have already updated `android/app/build.gradle.kts` to use `35.0.0`, but sometimes `flutter run` checks the global environment first. ensure the file looks like:
```kotlin
android {
    // ...
    compileSdk = flutter.compileSdkVersion
    buildToolsVersion = "35.0.0" 
    // ...
}
```
*Note: This specific fix is already applied in your project, so try Option 1 or 2 first.*
