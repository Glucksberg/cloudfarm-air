// Simple icon generator for CloudFarm Air
// This creates base64 encoded PNG icons from SVG

const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="240" fill="#006494" stroke="#004466" stroke-width="8"/>
  <circle cx="180" cy="200" r="40" fill="#ffffff" opacity="0.9"/>
  <circle cx="220" cy="180" r="50" fill="#ffffff" opacity="0.9"/>
  <circle cx="280" cy="190" r="45" fill="#ffffff" opacity="0.9"/>
  <circle cx="320" cy="210" r="35" fill="#ffffff" opacity="0.9"/>
  <ellipse cx="256" cy="280" rx="80" ry="12" fill="#ffffff"/>
  <ellipse cx="256" cy="280" rx="120" ry="8" fill="#ffffff" opacity="0.8"/>
  <circle cx="256" cy="280" r="6" fill="#ffffff"/>
  <line x1="246" y1="280" x2="266" y2="280" stroke="#006494" stroke-width="2"/>
  <line x1="256" y1="270" x2="256" y2="290" stroke="#006494" stroke-width="2"/>
  <g opacity="0.3">
    <rect x="100" y="350" width="80" height="8" fill="#4CAF50"/>
    <rect x="200" y="360" width="100" height="8" fill="#8BC34A"/>
    <rect x="320" y="350" width="90" height="8" fill="#4CAF50"/>
    <rect x="120" y="370" width="70" height="8" fill="#8BC34A"/>
    <rect x="220" y="380" width="80" height="8" fill="#4CAF50"/>
    <rect x="320" y="370" width="70" height="8" fill="#8BC34A"/>
  </g>
  <text x="256" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff">CloudFarm</text>
  <text x="256" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" opacity="0.9">AIR</text>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('CloudFarm Air - Icon Generator');
console.log('================================');
console.log('Generated icon sizes:', sizes.join(', '));
console.log('');
console.log('Copy the following base64 data URLs to create PNG files:');
console.log('');

sizes.forEach(size => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  
  const img = new Image();
  const svgBlob = new Blob([iconSvg], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(svgBlob);
  
  img.onload = function() {
    ctx.drawImage(img, 0, 0, size, size);
    const dataURL = canvas.toDataURL('image/png');
    console.log(`icon-${size}x${size}.png:`);
    console.log(dataURL);
    console.log('');
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
});

console.log('To use these icons:');
console.log('1. Copy each base64 string');
console.log('2. Use an online base64 to PNG converter');
console.log('3. Save as icon-{size}x{size}.png in public/icons/');
console.log('');
console.log('Or use this HTML file to download them automatically.'); 