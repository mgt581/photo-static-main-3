// Choose background functionality
function chooseBackground(foregroundImage, backgroundImage) {
  if (!foregroundImage || !backgroundImage) return null;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to background image dimensions
  canvas.width = backgroundImage.naturalWidth;
  canvas.height = backgroundImage.naturalHeight;
  
  // Draw background
  ctx.drawImage(backgroundImage, 0, 0);
  
  // Draw foreground (centered and scaled)
  const scale = Math.min(
    canvas.width / foregroundImage.naturalWidth,
    canvas.height / foregroundImage.naturalHeight
  ) * 0.8; // 80% to leave margin
  
  const x = (canvas.width - foregroundImage.naturalWidth * scale) / 2;
  const y = (canvas.height - foregroundImage.naturalHeight * scale) / 2;
  
  ctx.drawImage(
    foregroundImage,
    x, y,
    foregroundImage.naturalWidth * scale,
    foregroundImage.naturalHeight * scale
  );
  
  return canvas.toDataURL('image/png');
}