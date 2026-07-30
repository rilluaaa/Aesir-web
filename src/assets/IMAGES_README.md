Place the four provided images into the `public/assets/images` folder with these exact filenames:

- `photo-1.jpg`  — portrait/business leader image
- `photo-2.jpg`  — handshake image
- `photo-3.jpg`  — team discussion image
- `photo-4.jpg`  — group planning image

These images are referenced by `src/components/VisualGrid.jsx` and should be sized roughly 1200x800 for best results.

If you don't add the images, the grid will fall back gracefully and hide missing images.

To copy them on macOS from your Downloads, for example:

```bash
mkdir -p public/assets/images
cp ~/Downloads/photo-1.jpg public/assets/images/photo-1.jpg
cp ~/Downloads/photo-2.jpg public/assets/images/photo-2.jpg
cp ~/Downloads/photo-3.jpg public/assets/images/photo-3.jpg
cp ~/Downloads/photo-4.jpg public/assets/images/photo-4.jpg
```

After placing the files, refresh the dev server page to see the images.
