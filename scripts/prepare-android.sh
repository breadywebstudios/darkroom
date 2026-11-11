#!/usr/bin/env bash
# Generates the Android project (android/) from web/ and applies Darkroom's icons, splash,
# version and storage permission. Run from the repo root after `npm ci`.
set -euo pipefail
BUILD="${1:-1}"   # version code: must grow with every release so phones accept the update

rm -rf android
npx cap add android
RES=android/app/src/main/res

# launcher icons + adaptive icon background
cp -r android-res/mipmap-* "$RES"/
cp android-res/values/ic_launcher_background.xml "$RES/values/ic_launcher_background.xml"
# dark splash everywhere the template has one
find "$RES" -name splash.png -exec cp android-res/drawable/splash.png {} \;

# version
sed -i "s/versionCode 1$/versionCode ${BUILD}/; s/versionName \"1.0\"/versionName \"1.0.${BUILD}\"/" android/app/build.gradle

# saving to Documents on Android 9-10 needs the old storage permission (newer Android doesn't)
MAN=android/app/src/main/AndroidManifest.xml
sed -i 's#<uses-permission android:name="android.permission.INTERNET" />#<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />\n    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />#' "$MAN"
sed -i 's#<application#<application android:requestLegacyExternalStorage="true"#' "$MAN"

npx cap sync android
