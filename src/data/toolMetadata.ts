import type { FaqItem } from '@/components/FaqSection';

export interface ToolMetadata {
  metaTitle: string;
  metaDescription: string;
  howTo: string[];
  features: { title: string; description: string }[];
  faqs: FaqItem[];
}

const PRIVACY_ANSWER =
  'For many tools, files can be processed locally in your browser. Your files should not be uploaded unless a specific tool requires server-side processing.';

export const toolMetadata: Record<string, ToolMetadata> = {
  'pdf-compressor': {
    metaTitle: 'PDF Compressor — Reduce PDF File Size Online Free',
    metaDescription:
      'Compress PDF files online for free. Reduce PDF file size while maintaining good quality. No upload, no signup — process files right in your browser.',
    howTo: [
      'Click the upload area or drag and drop your PDF file.',
      'Select a compression level (light, medium, or strong).',
      'Click the "Compress PDF" button.',
      'Download your compressed PDF file.',
    ],
    features: [
      { title: 'Three compression levels', description: 'Choose between light, medium, and strong compression to balance quality and file size.' },
      { title: 'Local processing', description: 'Your PDF is processed in your browser — no file uploads to a server.' },
      { title: 'Instant results', description: 'Get your compressed PDF in seconds with no waiting in queues.' },
      { title: 'No watermarks', description: 'Your compressed PDF stays clean — we never add watermarks or branding.' },
    ],
    faqs: [
      { question: 'Is the PDF Compressor free to use?', answer: 'Yes, the PDF Compressor is completely free with no signup required.' },
      { question: 'Does the PDF Compressor upload my files?', answer: PRIVACY_ANSWER },
      { question: 'Will compression reduce the quality of my PDF?', answer: 'Light and medium compression preserve good visual quality. Strong compression reduces file size more aggressively but may slightly reduce image quality.' },
      { question: 'Is there a file size limit?', answer: 'Since processing happens in your browser, the limit depends on your device memory. Most modern browsers can handle files up to several hundred MB.' },
    ],
  },

  'pdf-merger': {
    metaTitle: 'PDF Merger — Combine Multiple PDFs Online Free',
    metaDescription:
      'Merge multiple PDF files into one document for free. Reorder pages, combine PDFs in any order. No upload, no signup — browser-based merging.',
    howTo: [
      'Upload two or more PDF files by clicking or dragging them into the upload area.',
      'Reorder the files by dragging them into your desired sequence.',
      'Click the "Merge PDFs" button.',
      'Download the combined PDF file.',
    ],
    features: [
      { title: 'Unlimited files', description: 'Merge as many PDF files as you need into a single document.' },
      { title: 'Drag to reorder', description: 'Easily rearrange the order of files before merging with a simple drag interface.' },
      { title: 'Local processing', description: 'Files are combined in your browser — nothing is uploaded to a server.' },
      { title: 'Fast and free', description: 'No queues, no waiting, no signups. Just upload, reorder, and merge.' },
    ],
    faqs: [
      { question: 'Is the PDF Merger free to use?', answer: 'Yes, the PDF Merger is completely free with no signup required.' },
      { question: 'Does the PDF Merger upload my files?', answer: PRIVACY_ANSWER },
      { question: 'How many PDFs can I merge at once?', answer: 'You can merge as many PDF files as your browser memory allows. For best performance, we recommend merging fewer than 20 files at a time.' },
      { question: 'Can I reorder files before merging?', answer: 'Yes, simply drag any file in the list to reorder it before clicking the merge button.' },
    ],
  },

  'pdf-splitter': {
    metaTitle: 'PDF Splitter — Split PDF into Pages Online Free',
    metaDescription:
      'Split a PDF into individual pages or custom page ranges for free. Extract specific pages from PDF documents. No upload, no signup required.',
    howTo: [
      'Upload your PDF file by clicking or dragging it into the upload area.',
      'Enter the page range you want to extract (e.g., 1-5, 3, 7-10).',
      'Click the "Split PDF" button.',
      'Download the extracted page range as a new PDF.',
    ],
    features: [
      { title: 'Flexible page ranges', description: 'Extract single pages, ranges, or multiple ranges like "1-3, 7, 10-12".' },
      { title: 'Local processing', description: 'Your PDF is split in your browser — no file uploads to a server.' },
      { title: 'Preserves quality', description: 'Extracted pages maintain the original quality and formatting of your PDF.' },
      { title: 'No watermarks', description: 'Your split PDFs are clean and free of any added branding.' },
    ],
    faqs: [
      { question: 'Is the PDF Splitter free to use?', answer: 'Yes, the PDF Splitter is completely free with no signup required.' },
      { question: 'Does the PDF Splitter upload my files?', answer: PRIVACY_ANSWER },
      { question: 'How do I specify which pages to extract?', answer: 'Use the page range input with formats like "1-5" for a range, "3" for a single page, or "1-3, 7, 10-12" for multiple selections.' },
      { question: 'Can I split a PDF into individual pages?', answer: 'Yes, use the "all pages" option to split every page into a separate PDF file.' },
    ],
  },

  'image-compressor': {
    metaTitle: 'Image Compressor — Compress JPG & PNG Online Free',
    metaDescription:
      'Compress JPG and PNG images online for free. Reduce image file size without visible quality loss. Adjust quality and output format. No upload needed.',
    howTo: [
      'Upload your image by clicking or dragging it into the upload area.',
      'Adjust the quality slider to your desired compression level.',
      'Select an output format (JPG, PNG, or WebP).',
      'Click "Compress Image" and download the result.',
    ],
    features: [
      { title: 'Quality control', description: 'Fine-tune the compression level with a simple slider from 1 to 100.' },
      { title: 'Format conversion', description: 'Compress and convert to JPG, PNG, or WebP in one step.' },
      { title: 'Live size estimate', description: 'See the estimated output file size before you compress.' },
      { title: 'Local processing', description: 'Images are compressed in your browser — nothing is uploaded.' },
    ],
    faqs: [
      { question: 'Is the Image Compressor free to use?', answer: 'Yes, the Image Compressor is completely free with no signup required.' },
      { question: 'Does the Image Compressor upload my images?', answer: PRIVACY_ANSWER },
      { question: 'What is the best quality setting?', answer: 'For most use cases, a quality of 70-80 provides a good balance between file size and visual quality. For web images, 60 is often sufficient.' },
      { question: 'Which format should I choose?', answer: 'Use JPG for photos, PNG for images with transparency, and WebP for the best compression on modern browsers.' },
    ],
  },

  'image-converter': {
    metaTitle: 'Image Converter — Convert JPG, PNG, WebP Online Free',
    metaDescription:
      'Convert images between JPG, PNG, WebP and more formats for free. Change image format without losing quality. No upload, no signup required.',
    howTo: [
      'Upload your image by clicking or dragging it into the upload area.',
      'Review the detected input format.',
      'Select your desired output format.',
      'Choose a quality level if applicable.',
      'Click "Convert Image" and download the result.',
    ],
    features: [
      { title: 'Multiple formats', description: 'Convert between JPG, PNG, WebP, and more popular image formats.' },
      { title: 'Quality control', description: 'Adjust output quality for lossy formats like JPG and WebP.' },
      { title: 'Transparency support', description: 'PNG and WebP outputs preserve alpha channel transparency.' },
      { title: 'Local processing', description: 'Conversion happens in your browser — no uploads to any server.' },
    ],
    faqs: [
      { question: 'Is the Image Converter free to use?', answer: 'Yes, the Image Converter is completely free with no signup required.' },
      { question: 'Does the Image Converter upload my images?', answer: PRIVACY_ANSWER },
      { question: 'Can I convert to WebP?', answer: 'Yes, WebP is supported as both an input and output format for modern web optimization.' },
      { question: 'Will conversion reduce image quality?', answer: 'Converting between lossless formats (PNG to PNG) preserves quality. Converting to a lossy format (JPG) may reduce quality slightly depending on the quality setting.' },
    ],
  },

  'json-formatter': {
    metaTitle: 'JSON Formatter — Beautify JSON Online Free',
    metaDescription:
      'Format and beautify JSON with proper indentation. Minify, copy, and download formatted JSON. Free online JSON formatter — no signup required.',
    howTo: [
      'Paste your JSON into the input editor.',
      'Click "Format" to beautify with proper indentation.',
      'Or click "Minify" to compress JSON to a single line.',
      'Use "Copy" or "Download" to save the result.',
    ],
    features: [
      { title: 'Beautify & minify', description: 'Format JSON with 2 or 4 space indentation, or minify it to a single line.' },
      { title: 'Copy & download', description: 'One-click copy to clipboard or download as a .json file.' },
      { title: 'Syntax validation', description: 'Invalid JSON is highlighted with an error message showing the position.' },
      { title: 'Large file support', description: 'Handle large JSON documents with a responsive, scrolling editor.' },
    ],
    faqs: [
      { question: 'Is the JSON Formatter free to use?', answer: 'Yes, the JSON Formatter is completely free with no signup required.' },
      { question: 'Does the JSON Formatter send my data anywhere?', answer: 'No. All formatting happens locally in your browser. Your JSON never leaves your device.' },
      { question: 'What indentation options are available?', answer: 'You can format with 2 spaces, 4 spaces, or tabs. Minify removes all unnecessary whitespace.' },
      { question: 'Can I format large JSON files?', answer: 'Yes, the editor can handle large JSON documents. Performance depends on your device capabilities.' },
    ],
  },

  'json-validator': {
    metaTitle: 'JSON Validator — Check JSON Syntax Online Free',
    metaDescription:
      'Validate JSON syntax and find errors instantly. Free online JSON validator with detailed error messages. No upload, no signup required.',
    howTo: [
      'Paste your JSON into the input editor.',
      'Click "Validate JSON".',
      'Review the result — valid JSON shows a success message, invalid JSON shows the error details.',
      'Fix any errors and re-validate as needed.',
    ],
    features: [
      { title: 'Instant validation', description: 'Get immediate feedback on whether your JSON is valid.' },
      { title: 'Detailed errors', description: 'See the exact error type and position when JSON is invalid.' },
      { title: 'Local processing', description: 'Validation happens entirely in your browser — no data is sent anywhere.' },
      { title: 'No limits', description: 'Validate JSON of any size, as many times as you need, completely free.' },
    ],
    faqs: [
      { question: 'Is the JSON Validator free to use?', answer: 'Yes, the JSON Validator is completely free with no signup required.' },
      { question: 'Does the JSON Validator send my data anywhere?', answer: 'No. All validation happens locally in your browser. Your JSON never leaves your device.' },
      { question: 'What kinds of errors can it detect?', answer: 'The validator detects syntax errors like missing commas, unclosed brackets, trailing commas, and invalid value types, with line and position details.' },
      { question: 'Can I validate large JSON files?', answer: 'Yes, the validator can handle large JSON documents. Performance depends on your device capabilities.' },
    ],
  },

  'base64-encoder-decoder': {
    metaTitle: 'Base64 Encoder/Decoder — Convert Text Online Free',
    metaDescription:
      'Encode text to Base64 or decode Base64 back to text. Free online Base64 converter with copy button. No upload, no signup required.',
    howTo: [
      'Type or paste your text into the input area.',
      'Click "Encode" to convert text to Base64, or "Decode" to convert Base64 to text.',
      'Use "Copy" to copy the result to your clipboard.',
      'Click "Clear" to reset both fields.',
    ],
    features: [
      { title: 'Bidirectional', description: 'Encode text to Base64 and decode Base64 back to text in one tool.' },
      { title: 'Instant results', description: 'Conversion happens instantly as you click — no waiting.' },
      { title: 'Copy to clipboard', description: 'One-click copy of the encoded or decoded result.' },
      { title: 'Local processing', description: 'All encoding and decoding happens in your browser — no data sent anywhere.' },
    ],
    faqs: [
      { question: 'Is the Base64 Encoder/Decoder free to use?', answer: 'Yes, the Base64 Encoder/Decoder is completely free with no signup required.' },
      { question: 'Does this tool send my data anywhere?', answer: 'No. All encoding and decoding happens locally in your browser. Your text never leaves your device.' },
      { question: 'What is Base64 used for?', answer: 'Base64 is commonly used to encode binary data in text-based formats like JSON, URLs, email attachments, and data URIs for images.' },
      { question: 'Can I decode Base64 images?', answer: 'This tool decodes Base64 text to plain text. For Base64 image data, use the output as a data URI in your application.' },
    ],
  },

  'url-encoder-decoder': {
    metaTitle: 'URL Encoder/Decoder — Encode URLs Online Free',
    metaDescription:
      'Encode or decode URLs and query parameters for free. Percent-encoding converter with copy button. No upload, no signup required.',
    howTo: [
      'Type or paste your URL or text into the input area.',
      'Click "Encode" to percent-encode the text, or "Decode" to decode percent-encoded text.',
      'Use "Copy" to copy the result to your clipboard.',
      'Click "Clear" to reset both fields.',
    ],
    features: [
      { title: 'Bidirectional', description: 'Encode URLs with percent-encoding and decode them back in one tool.' },
      { title: 'Query parameter safe', description: 'Handles special characters in URLs, query strings, and fragments correctly.' },
      { title: 'Copy to clipboard', description: 'One-click copy of the encoded or decoded result.' },
      { title: 'Local processing', description: 'All encoding and decoding happens in your browser — no data sent anywhere.' },
    ],
    faqs: [
      { question: 'Is the URL Encoder/Decoder free to use?', answer: 'Yes, the URL Encoder/Decoder is completely free with no signup required.' },
      { question: 'Does this tool send my data anywhere?', answer: 'No. All encoding and decoding happens locally in your browser. Your data never leaves your device.' },
      { question: 'What is URL encoding?', answer: 'URL encoding (percent-encoding) converts special characters in URLs to a % followed by hex digits, so they can be safely transmitted in web addresses.' },
      { question: 'When should I use URL encoding?', answer: 'Use URL encoding when constructing query parameters, passing special characters in URLs, or working with API endpoints that require encoded values.' },
    ],
  },

  'jwt-decoder': {
    metaTitle: 'JWT Decoder — Decode JSON Web Tokens Online Free',
    metaDescription:
      'Decode JSON Web Tokens (JWT) and inspect the header and payload. Free online JWT decoder with copy buttons. No upload, no signup required.',
    howTo: [
      'Paste your JWT token into the input field.',
      'Click "Decode Token".',
      'Review the decoded header and payload sections.',
      'Check the token information for algorithm, issuer, and expiry details.',
    ],
    features: [
      { title: 'Header & payload', description: 'View the decoded header and payload as formatted JSON.' },
      { title: 'Token information', description: 'See the algorithm, token type, issuer, subject, and expiry at a glance.' },
      { title: 'Expiry check', description: 'See whether the token is expired based on the exp claim.' },
      { title: 'Local processing', description: 'Decoding happens in your browser — your token is never sent anywhere.' },
    ],
    faqs: [
      { question: 'Is the JWT Decoder free to use?', answer: 'Yes, the JWT Decoder is completely free with no signup required.' },
      { question: 'Does the JWT Decoder send my token anywhere?', answer: 'No. All decoding happens locally in your browser. Your token never leaves your device.' },
      { question: 'Does this tool verify the JWT signature?', answer: 'No, this tool only decodes the token header and payload. Signature verification requires the secret or public key and is not performed.' },
      { question: 'Is it safe to paste my JWT here?', answer: 'Since processing is local, your token stays in your browser. However, avoid sharing JWTs in public or untrusted environments.' },
    ],
  },

  'uuid-generator': {
    metaTitle: 'UUID Generator — Generate UUIDs Online Free',
    metaDescription:
      'Generate random UUIDs (v4) in bulk for free. Create unique identifiers with copy and download options. No upload, no signup required.',
    howTo: [
      'Select the UUID version (v4 random or v1 timestamp-based).',
      'Choose the quantity of UUIDs to generate (1-100).',
      'Click "Generate UUIDs".',
      'Copy individual UUIDs or download all as a text file.',
    ],
    features: [
      { title: 'Bulk generation', description: 'Generate up to 100 UUIDs at once with a single click.' },
      { title: 'Multiple versions', description: 'Support for UUID v4 (random) and v1 (timestamp-based) formats.' },
      { title: 'Copy & download', description: 'Copy individual UUIDs or download the full list as a text file.' },
      { title: 'Local generation', description: 'All UUIDs are generated in your browser using the crypto API.' },
    ],
    faqs: [
      { question: 'Is the UUID Generator free to use?', answer: 'Yes, the UUID Generator is completely free with no signup required.' },
      { question: 'Does this tool send my data anywhere?', answer: 'No. All UUID generation happens locally in your browser. Nothing is uploaded.' },
      { question: 'What is a UUID?', answer: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is virtually guaranteed to be unique. UUIDs are commonly used as database primary keys and distributed system identifiers.' },
      { question: 'Which UUID version should I use?', answer: 'UUID v4 (random) is the most common choice for general use. UUID v1 (timestamp-based) is useful when you need chronological ordering.' },
    ],
  },

  'hash-generator': {
    metaTitle: 'Hash Generator — MD5, SHA-1, SHA-256 Online Free',
    metaDescription:
      'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text. Free online hash generator with copy button. No upload, no signup required.',
    howTo: [
      'Type or paste your text into the input area.',
      'Select one or more hash algorithms (MD5, SHA-1, SHA-256, SHA-512).',
      'Click "Generate Hash".',
      'Copy the hash output to your clipboard.',
    ],
    features: [
      { title: 'Multiple algorithms', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from the same input.' },
      { title: 'Instant results', description: 'Hashes are computed immediately using the browser Web Crypto API.' },
      { title: 'Copy to clipboard', description: 'One-click copy of any hash output.' },
      { title: 'Local processing', description: 'All hashing happens in your browser — your text is never sent anywhere.' },
    ],
    faqs: [
      { question: 'Is the Hash Generator free to use?', answer: 'Yes, the Hash Generator is completely free with no signup required.' },
      { question: 'Does the Hash Generator send my data anywhere?', answer: 'No. All hashing happens locally in your browser using the Web Crypto API. Your text never leaves your device.' },
      { question: 'Which hash algorithm should I use?', answer: 'For security purposes, use SHA-256 or SHA-512. MD5 and SHA-1 are provided for compatibility but are not recommended for security-sensitive applications.' },
      { question: 'Can I hash files?', answer: 'This tool hashes text input. For file hashing, a dedicated file hashing tool may be added in the future.' },
    ],
  },

  'invoice-generator': {
    metaTitle: 'Invoice Generator — Create Professional Invoices Free',
    metaDescription:
      'Create professional invoices online for free. Add business details, line items, tax, and discounts. Preview and print invoices. No signup required.',
    howTo: [
      'Enter your business details (name, address, contact).',
      'Enter your customer details.',
      'Set the invoice number, date, and due date.',
      'Add line items with description, quantity, and unit price.',
      'Apply discount and tax rates if needed.',
      'Preview the invoice and click "Print" or "Download".',
    ],
    features: [
      { title: 'Professional layout', description: 'Clean, professional invoice design suitable for worldwide business use.' },
      { title: 'Line items', description: 'Add unlimited line items with description, quantity, unit price, and per-item discounts.' },
      { title: 'Tax & discount', description: 'Apply percentage or fixed discounts and configurable tax rates.' },
      { title: 'Multi-currency', description: 'Support for major world currencies with proper symbol formatting.' },
      { title: 'Print & download', description: 'Print directly or download as PDF using your browser print dialog.' },
    ],
    faqs: [
      { question: 'Is the Invoice Generator free to use?', answer: 'Yes, the Invoice Generator is completely free with no signup required.' },
      { question: 'Does the Invoice Generator store my data?', answer: 'No. All invoice data stays in your browser. Nothing is uploaded or stored on a server.' },
      { question: 'Can I download the invoice as PDF?', answer: 'Yes, use the "Download / Print" button to open your browser print dialog, where you can save the invoice as a PDF.' },
      { question: 'Which currencies are supported?', answer: 'We support all major world currencies including USD, EUR, GBP, JPY, CAD, AUD, INR, and more.' },
    ],
  },

  'percentage-calculator': {
    metaTitle: 'Percentage Calculator — Calculate Percentages Online Free',
    metaDescription:
      'Calculate percentages, discounts, and increases quickly. Multiple modes: X% of Y, X is what % of Y, percentage increase/decrease. Free, no signup.',
    howTo: [
      'Select a calculation mode from the tabs.',
      'Enter the required values in the input fields.',
      'The result is calculated automatically as you type.',
      'Use "Reset" to clear all fields and start over.',
    ],
    features: [
      { title: 'Multiple modes', description: 'Calculate X% of Y, what percentage X is of Y, and percentage increase or decrease.' },
      { title: 'Instant results', description: 'Results update automatically as you type — no button needed.' },
      { title: 'Clear explanations', description: 'Each result includes a plain-English explanation of the calculation.' },
      { title: 'Reset anytime', description: 'One click to clear all inputs and start a new calculation.' },
    ],
    faqs: [
      { question: 'Is the Percentage Calculator free to use?', answer: 'Yes, the Percentage Calculator is completely free with no signup required.' },
      { question: 'Does this tool send my data anywhere?', answer: 'No. All calculations happen locally in your browser. No data is uploaded.' },
      { question: 'What calculation modes are available?', answer: 'Three modes: "X% of Y" calculates a percentage of a value, "X is what % of Y" finds the percentage relationship, and "% increase/decrease" calculates the change between two values.' },
      { question: 'Can I use decimal values?', answer: 'Yes, all input fields accept decimal values for precise calculations.' },
    ],
  },

  'qr-code-generator': {
    metaTitle: 'QR Code Generator — Create QR Codes Online Free',
    metaDescription:
      'Generate QR codes for URLs, text, WiFi and more. Free online QR code generator with size and error correction options. No signup required.',
    howTo: [
      'Enter the text or URL you want to encode.',
      'Select the QR code size (small, medium, or large).',
      'Choose an error correction level (L, M, Q, or H).',
      'Click "Generate QR Code".',
      'Download the QR code as an image.',
    ],
    features: [
      { title: 'Universal encoding', description: 'Encode URLs, plain text, email addresses, phone numbers, WiFi credentials, and more.' },
      { title: 'Size options', description: 'Choose from small (256px), medium (512px), or large (1024px) QR codes.' },
      { title: 'Error correction', description: 'Select from four error correction levels (L, M, Q, H) for different durability needs.' },
      { title: 'Download as image', description: 'Download your QR code as a PNG image for use in print or digital media.' },
    ],
    faqs: [
      { question: 'Is the QR Code Generator free to use?', answer: 'Yes, the QR Code Generator is completely free with no signup required.' },
      { question: 'Does this tool send my data anywhere?', answer: 'No. QR codes are generated locally in your browser. Your data is not uploaded to any server.' },
      { question: 'What error correction level should I use?', answer: 'Level L (7%) is fine for clean digital use. Level M (15%) is good for general use. Level Q (25%) and H (30%) are recommended for printed materials that may get damaged.' },
      { question: 'Can I generate QR codes for WiFi?', answer: 'Yes, enter your WiFi credentials in the text field using the format "WIFI:S:network;T:WPA;P:password;;" to create a scannable WiFi QR code.' },
    ],
  },
};

export function getToolMetadata(slug: string): ToolMetadata | undefined {
  return toolMetadata[slug];
}
