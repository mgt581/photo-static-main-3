# Copilot Instructions for AI Photo Studio

## Project Overview
AI Photo Studio is a client-side web application for AI-powered photo editing. It provides background removal, background replacement, and person removal features using browser-based AI libraries.

## Technology Stack
- **Frontend**: HTML5, vanilla JavaScript (ES6+), CSS3
- **Backend/Services**: Firebase (Authentication, Firestore, Storage, Functions)
- **AI/ML Libraries**:
  - `@imgly/background-removal` for background removal
  - MediaPipe Selfie Segmentation for fallback
  - OpenCV.js for inpainting
  - Transformers.js for HD+ inpainting
- **Deployment**: Firebase Hosting
- **Payment**: Stripe integration

## Coding Standards

### JavaScript
- Use vanilla JavaScript (no frameworks like React, Vue, or Angular)
- Prefer ES6+ features: `const/let`, arrow functions, async/await, template literals
- Use IIFE (Immediately Invoked Function Expressions) for module pattern when needed
- Always use `async/await` for asynchronous operations instead of `.then()` chains
- Use `const` by default, `let` only when reassignment is needed, never `var`
- Prefer arrow functions for callbacks and event handlers
- Use template literals for string interpolation

### HTML
- Use semantic HTML5 elements
- Include proper meta tags for viewport and charset
- Use inline styles sparingly; prefer CSS classes
- Always include alt text for images
- Use proper form elements and attributes

### CSS
- Use inline styles in `<style>` tags within HTML files for this project
- Prefer CSS custom properties (CSS variables) for theming (e.g., `--grad`)
- Use flexbox and grid for layouts
- Mobile-first responsive design
- Use `rem` and `em` for scalable sizing where appropriate
- Keep CSS class names semantic and lowercase with hyphens (e.g., `photo-card`, `btn-primary`)

### Firebase Integration
- Always initialize Firebase with the existing config object
- Use Firebase compat libraries (e.g., `firebase-auth-compat.js`)
- Store user data in Firestore under `users/{uid}` collection
- Store images in Firebase Storage under `users/{uid}/gallery/` path
- Use server timestamps: `firebase.firestore.FieldValue.serverTimestamp()`
- Always handle auth state changes with `auth.onAuthStateChanged()`
- Use proper error handling for all Firebase operations

### Canvas & Image Processing
- Use 2D canvas context with `willReadFrequently: true` when needed
- Enable image smoothing: `ctx.imageSmoothingEnabled = true` and `ctx.imageSmoothingQuality = 'high'`
- Always downscale large images before processing (max 1400-2048px)
- Use `URL.createObjectURL()` for blob handling and always revoke URLs when done
- Prefer `toBlob()` over `toDataURL()` for better performance

## Architecture Patterns

### State Management
- Use closure-based module pattern (IIFE) for encapsulation (see `Studio` object)
- Store component state in function closures
- Use LocalStorage for client-side persistence
- Use Firestore for server-side persistence

### Event Handling
- Use inline event handlers sparingly; prefer `addEventListener` or `onclick` assignment
- Always prevent defaults for drag-and-drop operations
- Clean up event listeners when appropriate

### UI Updates
- Create toast notifications using the `toast()` helper function
- Use progress indicators for long-running operations (see `showProgress()`)
- Update button states based on application state
- Disable buttons during async operations to prevent double-clicks

## Security Best Practices
- Never log sensitive data (passwords, tokens, API keys)
- Always validate user input before processing
- Use Firebase Security Rules for data access control
- Don't commit Firebase config to public repos (already in code, acceptable for this project)
- Sanitize user-generated content before display

## Performance Guidelines
- Lazy-load heavy libraries (OpenCV, Transformers.js) only when needed
- Show loading indicators for operations > 1 second
- Downscale images before processing to reduce memory usage
- Use Web Workers for heavy computations when possible
- Clean up canvas contexts and revoke blob URLs to prevent memory leaks

## Testing & Validation
- Test all features in both authenticated and unauthenticated states
- Validate image upload/download flows
- Test payment flows with Stripe test mode
- Verify Firebase Storage and Firestore writes
- Test on mobile devices for touch events

## File Organization
- Keep HTML files in root directory
- Use descriptive filenames (e.g., `gallery.html`, `signin.html`)
- CSS is primarily inline within `<style>` tags in HTML files; some pages have separate CSS files with matching names (e.g., `gallery.css` for `gallery.html`)
- JavaScript is primarily inline within `<script>` tags in HTML files; some utility scripts are in separate `.js` files
- Firebase configuration in `firebase.json`

## Common Patterns

### Adding a New Feature Button
```javascript
const btnFeature = document.getElementById('btnFeature');
btnFeature.onclick = async () => {
  setBusy(true);
  try {
    setStatus("Processing...");
    // Feature logic here
    setStatus("Complete!");
  } catch (e) {
    console.error(e);
    alert("Feature failed: " + e.message);
  } finally {
    setBusy(false);
  }
};
```

### Saving to Gallery
```javascript
// Always use saveToGalleryIfSignedIn() helper
stage.toBlob(async (blob) => {
  if (!blob) return;
  await saveToGalleryIfSignedIn(blob, "png");
}, "image/png", 0.95);
```

### Loading Images
```javascript
// Use the loadImage helper
const img = await loadImage(dataUrl);
ctx.drawImage(img, x, y, width, height);
```

## Subscription & Payment Logic
- Owner mode bypasses all restrictions (check for specific email)
- Pro tier removes watermarks
- Free trial gives temporary pro access
- Use `window.proEnabled` flag to check subscription status
- Always call `refreshUserPlan()` after auth changes
- Watermarks only appear for free users (see `stampWatermark()`)

## Important Functions
- `toast(msg)` - Show temporary notification
- `setStatus(text)` - Update status message
- `setBusy(bool)` - Enable/disable UI during operations
- `saveToGalleryIfSignedIn(blob, type)` - Auto-save to Firebase
- `refreshUserPlan()` - Update user subscription state
- `showProgress(text, pct)` - Show progress bar
- `loadImage(src)` - Promise-based image loading
- `readFileURL(file)` - Convert File to data URL

## Code Style
- Use 2-space indentation
- No semicolons are required but use them for consistency
- Use single quotes for strings unless interpolating
- Keep functions small and focused
- Comment complex logic but avoid obvious comments
- Use descriptive variable names (avoid single letters except in loops)

## Deployment
- Deploy to Firebase Hosting
- Run `firebase deploy` to publish changes
- Ensure all assets are in the public directory (root)
- Test locally before deploying

## Don't Do This
- Don't add new frameworks or libraries without good reason
- Don't use jQuery or other DOM manipulation libraries
- Don't use TypeScript (keep it vanilla JS)
- Don't add build tools or transpilers
- Don't remove existing Firebase integration
- Don't change the payment flow or Stripe links without approval
- Don't add server-side code (keep it client-side)
