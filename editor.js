// Editor functionality
let currentMode = 'remove';
let originalImage = null;
let processedImage = null;

// Set active mode
function setMode(mode, event) {
  currentMode = mode;
  
  // Update active button
  if (event && event.target) {
    document.querySelectorAll('.mode-switcher button').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }
  
  // Update label
  const labels = {
    'remove': 'Remove Background',
    'change': 'Change Background',
    'choose': 'Choose Background',
    'eraser': 'Magic Eraser',
    'person': 'Remove Person'
  };
  
  document.getElementById('activeToolLabel').textContent = labels[mode] || 'Select a tool';
  
  // Update tool controls based on mode
  updateToolControls(mode);
}

// Update tool controls UI
function updateToolControls(mode) {
  const controlsDiv = document.getElementById('toolControls');
  controlsDiv.innerHTML = '';
  
  if (mode === 'change') {
    controlsDiv.innerHTML = `
      <label>Background Color: <input type="color" id="bgColorPicker" value="#ffffff"></label>
      <button onclick="applyColorBackground()">Apply Color</button>
    `;
    controlsDiv.classList.add('active');
  } else if (mode === 'choose') {
    controlsDiv.innerHTML = `
      <label>Upload Background: <input type="file" id="bgImageInput" accept="image/*"></label>
    `;
    controlsDiv.classList.add('active');
    
    document.getElementById('bgImageInput').addEventListener('change', handleBackgroundImageUpload);
  } else {
    controlsDiv.classList.remove('active');
  }
}

// Handle image upload
document.getElementById('imageInput').addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    originalImage = event.target.result;
    
    const img = document.getElementById('editorImage');
    img.src = originalImage;
    
    document.querySelector('.image-preview').classList.add('active');
    document.querySelector('.download-btn').classList.add('active');
    
    // Process image based on current mode
    if (currentMode === 'remove') {
      removeBackgroundFromImage();
    }
  };
  reader.readAsDataURL(file);
});

// Remove background using background-removal library
async function removeBackgroundFromImage() {
  if (!originalImage) return;
  
  showLoading(true);
  
  try {
    // Using the imgly background removal library loaded in HTML
    if (typeof window.removeBackground !== 'undefined') {
      const blob = await fetch(originalImage).then(r => r.blob());
      const result = await window.removeBackground(blob);
      
      const url = URL.createObjectURL(result);
      processedImage = url;
      
      document.getElementById('editorImage').src = url;
    } else {
      console.warn('Background removal library not loaded');
    }
  } catch (error) {
    console.error('Error removing background:', error);
    alert('Failed to remove background. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Apply color background
function applyColorBackground() {
  const color = document.getElementById('bgColorPicker').value;
  
  // Create canvas to composite image with color background
  const img = document.getElementById('editorImage');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  // Fill background color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw image on top
  const imgElement = new Image();
  imgElement.onload = function() {
    ctx.drawImage(imgElement, 0, 0);
    processedImage = canvas.toDataURL('image/png');
    img.src = processedImage;
  };
  imgElement.src = processedImage || originalImage;
}

// Handle background image upload
function handleBackgroundImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const bgImage = event.target.result;
    compositeWithBackground(bgImage);
  };
  reader.readAsDataURL(file);
}

// Composite image with custom background
function compositeWithBackground(bgImageSrc) {
  const img = document.getElementById('editorImage');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const bgImg = new Image();
  bgImg.onload = function() {
    canvas.width = bgImg.naturalWidth;
    canvas.height = bgImg.naturalHeight;
    
    // Draw background
    ctx.drawImage(bgImg, 0, 0);
    
    // Draw foreground (processed image)
    const fgImg = new Image();
    fgImg.onload = function() {
      // Center and scale foreground
      const scale = Math.min(canvas.width / fgImg.naturalWidth, canvas.height / fgImg.naturalHeight);
      const x = (canvas.width - fgImg.naturalWidth * scale) / 2;
      const y = (canvas.height - fgImg.naturalHeight * scale) / 2;
      
      ctx.drawImage(fgImg, x, y, fgImg.naturalWidth * scale, fgImg.naturalHeight * scale);
      
      processedImage = canvas.toDataURL('image/png');
      img.src = processedImage;
    };
    fgImg.src = processedImage || originalImage;
  };
  bgImg.src = bgImageSrc;
}

// Download final image
function downloadFinalImage() {
  const img = processedImage || originalImage;
  if (!img) {
    alert('No image to download');
    return;
  }
  
  const link = document.createElement('a');
  link.download = 'ai-photo-studio-edited-' + Date.now() + '.png';
  link.href = img;
  link.click();
}

// Show/hide loading overlay
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  overlay.style.display = show ? 'flex' : 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set initial mode without event since page is loading
  currentMode = 'remove';
  document.getElementById('activeToolLabel').textContent = 'Remove Background';
});
