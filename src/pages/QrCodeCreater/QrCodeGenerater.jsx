import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';



import logo from '../../assets/banners/logo.jpg';
// import logo from '../../assets/banners/Pasted imageshaarif.png';



const QrCodeGenerater = () => {
  const [url, setUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [logoBase64, setLogoBase64] = useState('');
  const qrRef = useRef();

  // Convert logo to base64 when component mounts
  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL('image/png'));
    };
    img.src = logo;
  }, []);

  const handleGenerate = () => {
    if (url.trim()) {
      setGeneratedUrl(url);
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    if (svg) {
      // Clone the SVG to modify it
      const svgClone = svg.cloneNode(true);
      
      // Find the image element and ensure it has the base64 data
      const imgElement = svgClone.querySelector('image');
      if (imgElement && logoBase64) {
        imgElement.setAttribute('href', logoBase64);
      }
      
      // Set high resolution dimensions
      svgClone.setAttribute('width', '2048');
      svgClone.setAttribute('height', '2048');
      
      // Get SVG string
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Download
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'letstry-qrcode.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };

  const handleClear = () => {
    setUrl('');
    setGeneratedUrl('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            QR Code Generator
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Create custom QR codes with LetsTry logo in the center
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Enter Website URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://letstryfoods.com/products/..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={!url.trim()}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Generate
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Enter any page URL from your website to create a QR code
          </p>
        </div>

        {/* QR Code Display */}
        {generatedUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div 
                ref={qrRef} 
                className="bg-white p-6 rounded-xl shadow-md border-4 border-gray-100 mb-6"
              >
                <QRCodeSVG
                  value={generatedUrl}
                  size={280}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: logoBase64 || logo,
                    x: undefined,
                    y: undefined,
                    height: 60,
                    width: 60,
                    excavate: true,
                  }}
                />
              </div>

              {/* URL Display */}
              <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Generated for:</p>
                <p className="text-sm sm:text-base text-gray-900 break-all">{generatedUrl}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!generatedUrl && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
              How to use:
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-blue-800">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">1.</span>
                <span>Enter the URL of any page from your website (products, categories, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">2.</span>
                <span>Click "Generate" to create your custom QR code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">3.</span>
                <span>The QR code will include your LetsTry logo in the center</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">4.</span>
                <span>Download the QR code as SVG image for scalable, high-quality printing</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeGenerater;