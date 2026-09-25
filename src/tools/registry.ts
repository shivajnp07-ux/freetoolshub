import type { ComponentType } from 'react';
import { PdfCompressor } from './PdfCompressor';
import { PdfMerger } from './PdfMerger';
import { PdfSplitter } from './PdfSplitter';
import { ImageCompressor } from './ImageCompressor';
import { ImageConverter } from './ImageConverter';
import { JsonFormatter } from './JsonFormatter';
import { JsonValidator } from './JsonValidator';
import { Base64EncoderDecoder } from './Base64EncoderDecoder';
import { UrlEncoderDecoder } from './UrlEncoderDecoder';
import { JwtDecoder } from './JwtDecoder';
import { UuidGenerator } from './UuidGenerator';
import { HashGenerator } from './HashGenerator';
import { InvoiceGenerator } from './InvoiceGenerator';
import { PercentageCalculator } from './PercentageCalculator';
import { QrCodeGenerator } from './QrCodeGenerator';

export const toolRegistry: Record<string, ComponentType> = {
  'pdf-compressor': PdfCompressor,
  'pdf-merger': PdfMerger,
  'pdf-splitter': PdfSplitter,
  'image-compressor': ImageCompressor,
  'image-converter': ImageConverter,
  'json-formatter': JsonFormatter,
  'json-validator': JsonValidator,
  'base64-encoder-decoder': Base64EncoderDecoder,
  'url-encoder-decoder': UrlEncoderDecoder,
  'jwt-decoder': JwtDecoder,
  'uuid-generator': UuidGenerator,
  'hash-generator': HashGenerator,
  'invoice-generator': InvoiceGenerator,
  'percentage-calculator': PercentageCalculator,
  'qr-code-generator': QrCodeGenerator,
};
