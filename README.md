# OrderFlow-Site

Premium landing for OrderFlow, published with GitHub Pages.

## Development

```powershell
npm install
npm run dev
```

## Static build

```powershell
npm run validate:assets
npm run build
```

The exported site is generated into `out/`.

## APK release contract

The APK publishing scripts stay in the OrderFlow app repository:

```powershell
.\tools\build_and_publish_release.ps1
.\tools\publish_release_apk.ps1
.\tools\publish_release_apk.ps1 -WhatIf
```

This site reads the latest GitHub Release from `svdimonshop-gif/OrderFlow-Site` and downloads the stable asset `OrderFlow.apk`.
