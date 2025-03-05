import { pdfjs } from 'react-pdf';

// Ensure we're using the correct version
const pdfjsVersion = pdfjs.version;

// Set up the worker
const pdfjsWorker = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default pdfjs; 