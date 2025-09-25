# Pixotope Icons

This directory contains custom Pixotope icons for the FossFLOW application.

## Adding New Icons

1. **Add your icon files** to this directory (`packages/fossflow-app/public/icons/pixotope/`)
   - Supported formats: PNG, JPG, JPEG, SVG
   - Recommended: Use descriptive filenames (e.g., `led_wall.png`, `video_camera.svg`)

2. **Regenerate the icon registry** by running:
   ```bash
   npm run generate:pixotope-icons
   ```

3. **Restart your development server** to see the new icons in the application

## Icon Naming Convention

- **Filename**: Use lowercase with underscores or hyphens (e.g., `led_wall.png`, `video-camera.svg`)
- **Generated ID**: Will be `pixotope-{filename}` (e.g., `pixotope-led-wall`)
- **Generated Name**: Will be title case (e.g., "Led Wall", "Video Camera")

## Current Icons

The following icons are automatically registered:

- Clock (`pixotope-clock`)
- Greenscreen (`pixotope-greenscreen`) 
- Led Floor (`pixotope-led-floor`)
- Led Wall (`pixotope-led-wall`)
- Light (`pixotope-light`)
- Mixer (`pixotope-mixer`)
- Video (`pixotope-video`)

## Configuration

All icons are configured with these default settings:
- `collection`: "PIXOTOPE"
- `isIsometric`: true (renders as 3D isometric)
- `scale`: 1.0

To customize these settings, you can edit the `scripts/generate-pixotope-icons.js` file.
