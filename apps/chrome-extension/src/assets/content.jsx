// import React from 'react';
// import Overlay from './Overlay';
// import { createRoot } from 'react-dom/client';

// Create a container div for the React component
const overlayContainer = document.createElement('div');
overlayContainer.id = 'react-overlay-container';
overlayContainer.body = document.createTextNode('Hello World!');
document.body.appendChild(overlayContainer);

// Render the React component into the container
// const root = createRoot(overlayContainer);
// root.render(<Overlay />);