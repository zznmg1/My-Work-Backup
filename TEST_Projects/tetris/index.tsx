
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// HTML 파일의 'root'라는 id를 가진 태그를 찾아 React를 시작합니다.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("뿌리(root) 엘리먼트를 찾을 수 없습니다.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
