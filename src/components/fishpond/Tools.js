import React, { useState, useRef } from 'react';
import '../../styles/Tools.css';

const Tools = () => {
  const [svgContent, setSvgContent] = useState('');
  const [pngUrl, setPngUrl] = useState('');
  const [fileName, setFileName] = useState('converted-image');
  const [inputMethod, setInputMethod] = useState('file'); // 'file' or 'code'
  const svgRef = useRef(null);

  const handleSvgInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSvgCodeChange = (e) => {
    setSvgContent(e.target.value);
  };

  const convertSvgToPng = async () => {
    if (!svgContent) return;

    try {
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        setPngUrl(pngUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('转换失败:', error);
    }
  };

  const downloadPng = () => {
    if (!pngUrl) return;
    
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tools-container">
      <h2>SVG 转 PNG 工具</h2>
      
      <div className="tool-section">
        <div className="input-section">
          <h3>输入 SVG</h3>
          <div className="input-method-selector">
            <button
              className={`method-button ${inputMethod === 'file' ? 'active' : ''}`}
              onClick={() => setInputMethod('file')}
            >
              上传文件
            </button>
            <button
              className={`method-button ${inputMethod === 'code' ? 'active' : ''}`}
              onClick={() => setInputMethod('code')}
            >
              输入代码
            </button>
          </div>

          {inputMethod === 'file' ? (
            <input
              type="file"
              accept=".svg"
              onChange={handleSvgInput}
              className="file-input"
            />
          ) : (
            <textarea
              value={svgContent}
              onChange={handleSvgCodeChange}
              placeholder="在此输入 SVG 代码..."
              className="code-input"
              rows="10"
            />
          )}

          {svgContent && (
            <div className="preview-container">
              <h4>SVG 预览</h4>
              <div 
                ref={svgRef}
                className="svg-preview"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          )}
        </div>

        <div className="output-section">
          <h3>输出 PNG</h3>
          <div className="controls">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="文件名"
              className="filename-input"
            />
            <button 
              onClick={convertSvgToPng}
              disabled={!svgContent}
              className="convert-button"
            >
              转换
            </button>
          </div>
          
          {pngUrl && (
            <div className="preview-container">
              <h4>PNG 预览</h4>
              <img src={pngUrl} alt="PNG preview" className="png-preview" />
              <button 
                onClick={downloadPng}
                className="download-button"
              >
                下载 PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools; 