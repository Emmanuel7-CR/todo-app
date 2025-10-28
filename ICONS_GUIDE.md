# Icon Generation Guide for TODO PWA

The PWA requires icons in 8 different sizes. This guide shows you multiple methods to generate them.

## Required Icon Sizes

- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px

## Method 1: Online Tool (Easiest)

### Using PWA Builder

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 source image (PNG recommended)
3. Click "Generate"
4. Download the ZIP file
5. Extract and copy icons to `/icons/` folder

### Using RealFaviconGenerator

1. Go to https://realfavicongenerator.net/
2. Upload your source image
3. Select "PWA" options
4. Generate and download
5. Extract icons to `/icons/` folder

## Method 2: ImageMagick (Command Line)

### Install ImageMagick

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows
# Download from https://imagemagick.org/script/download.php
```

### Generate All Sizes

```bash
# Navigate to your project directory
cd /path/to/todo-pwa

# Create icons directory
mkdir -p icons

# Generate all sizes from a 512x512 source image
convert source-icon-512.png -resize 72x72 icons/icon-72.png
convert source-icon-512.png -resize 96x96 icons/icon-96.png
convert source-icon-512.png -resize 128x128 icons/icon-128.png
convert source-icon-512.png -resize 144x144 icons/icon-144.png
convert source-icon-512.png -resize 152x152 icons/icon-152.png
convert source-icon-512.png -resize 192x192 icons/icon-192.png
convert source-icon-512.png -resize 384x384 icons/icon-384.png
cp source-icon-512.png icons/icon-512.png
```

### Automated Script

Create a file `generate-icons.sh`:

```bash
#!/bin/bash

SOURCE="source-icon-512.png"
SIZES=(72 96 128 144 152 192 384 512)

mkdir -p icons

for size in "${SIZES[@]}"; do
  echo "Generating ${size}x${size}..."
  convert "$SOURCE" -resize "${size}x${size}" "icons/icon-${size}.png"
done

echo "✅ All icons generated!"
```

Run it:
```bash
chmod +x generate-icons.sh
./generate-icons.sh
```

## Method 3: Node.js Script (Sharp Library)

### Install Sharp

```bash
npm install sharp
```

### Create Generation Script

Create `generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceImage = 'source-icon-512.png';
const outputDir = 'icons';

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate all icon sizes
async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    
    await sharp(sourceImage)
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 59, g: 130, b: 246, alpha: 1 } // Blue background
      })
      .png({ quality: 100 })
      .toFile(outputPath);
    
    console.log(`✅ Generated: ${outputPath}`);
  }
  
  console.log('🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
```

### Run the Script

```bash
node generate-icons.js
```

## Method 4: Photoshop/GIMP (Manual)

### Photoshop

1. Open your source image (512x512)
2. For each size:
   - Image → Image Size
   - Set width and height to target size
   - Resampling: Bicubic Sharper
   - File → Export → Export As
   - Format: PNG
   - Save as `icon-{size}.png`

### GIMP

1. Open source image
2. Image → Scale Image
3. Set dimensions to target size
4. Interpolation: Cubic
5. Scale
6. File → Export As
7. Save as PNG with filename `icon-{size}.png`

## Method 5: Quick Placeholder Icons (Testing Only)

For quick testing, you can use online placeholder services:

### Via URL (Not recommended for production)

```html
<!-- In index.html, temporarily replace icon links -->
<link rel="icon" href="https://via.placeholder.com/96/3B82F6/FFFFFF?text=TODO">
```

### Download Placeholders

```bash
# Download placeholder images using curl
for size in 72 96 128 144 152 192 384 512; do
  curl "https://via.placeholder.com/${size}/3B82F6/FFFFFF?text=TODO" \
    -o "icons/icon-${size}.png"
done
```

⚠️ **Warning**: These are low-quality and should only be used for testing!

## Design Recommendations

### Source Image Requirements

- **Size**: 512x512px minimum (1024x1024 recommended)
- **Format**: PNG with transparency
- **Content**: Simple, recognizable design
- **Safe area**: Keep important content in center 80% (avoid edges)
- **Colors**: High contrast, works on light and dark backgrounds

### Design Tips

1. **Simple is better**: Icons are displayed small, avoid details
2. **Bold shapes**: Thick lines and clear shapes work best
3. **Centered content**: Leave margin around edges (maskable safe area)
4. **Recognizable**: Should be identifiable at 48x48px
5. **Brand colors**: Use your app's primary color scheme

### Maskable Icons

For Android adaptive icons, ensure:
- Important content within center 80% circle
- Background extends to edges (no transparency needed)
- Icons at 192px and 512px marked as "maskable" in manifest

## Creating a Simple Icon (Figma/Design Tool)

### Design Specifications

```
Canvas: 512x512px
Safe zone: 410x410px (centered circle)
Content: Checkmark or list icon
Background: #3B82F6 (blue)
Foreground: #FFFFFF (white)
Corner radius: 115px (rounded square)
```

### Simple SVG Template

Create `icon-source.svg`:

```svg
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="115" fill="#3B82F6"/>
  
  <!-- Checkmark -->
  <path d="M 170 260 L 220 310 L 350 180" 
        stroke="#FFFFFF" 
        stroke-width="32" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"/>
</svg>
```

Convert SVG to PNG:
```bash
# Using ImageMagick
convert -density 300 -background none icon-source.svg icon-source-512.png

# Using Inkscape
inkscape icon-source.svg --export-png=icon-source-512.png --export-width=512
```

## Validation

After generating icons, verify:

1. **All sizes exist**:
   ```bash
   ls -lh icons/
   # Should show 8 PNG files
   ```

2. **Correct dimensions**:
   ```bash
   file icons/*.png
   # Check dimensions in output
   ```

3. **File sizes reasonable**:
   - 72x72: ~2-5 KB
   - 512x512: ~15-40 KB

4. **Visual quality**:
   - Open each icon
   - Check for blur or artifacts
   - Verify transparency (if applicable)

5. **Manifest links**:
   - Ensure manifest.json paths match
   - Test PWA install prompt shows correct icon

## Troubleshooting

### Icons Not Showing in PWA

1. Check file paths in `manifest.json`
2. Verify files are in `/icons/` directory
3. Clear browser cache and reinstall PWA
4. Check DevTools → Application → Manifest

### Blurry Icons

- Use higher quality source image
- Ensure bicubic/lanczos interpolation
- Don't upscale from small images

### Wrong Colors

- Check source image color profile
- Convert to sRGB color space
- Verify PNG has correct bit depth (24-bit or 32-bit with alpha)

### Transparent Background Issues

- Some platforms don't support transparency
- Provide fallback background color
- Test on multiple devices/platforms

## Pre-made Icon Sets

If you prefer ready-made icons:

1. **Material Icons**: https://fonts.google.com/icons
2. **Font Awesome**: https://fontawesome.com/
3. **Flaticon**: https://www.flaticon.com/
4. **Icons8**: https://icons8.com/

Download as PNG, resize as needed.

## Quick Start: Using Free Icon

```bash
# 1. Download a free checkmark icon (512x512) from Icons8 or Flaticon
# 2. Save as source-icon-512.png
# 3. Run ImageMagick commands above
# OR
# 3. Use PWA Builder to generate all sizes
```

---

**Recommended Workflow**: Use PWA Builder online tool for quickest results, or ImageMagick script for automation and best quality.