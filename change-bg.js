// Change background functionality
function changeBackground(imageElement, backgroundColor) {
  if (!imageElement) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  
  // Fill with background color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw image on top
  ctx.drawImage(imageElement, 0, 0);
  
  return canvas.toDataURL('image/png');
}