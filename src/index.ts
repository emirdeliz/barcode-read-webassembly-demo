import { createCanvas, ImageData, loadImage } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import {
	getDefaultScanner,
	scanImageData,
	Symbol,
} from 'https://deno.land/x/zbar_wasm@v2.1.3/mod.ts';

const getImageData = async (src: string): Promise<ImageData> => {
	const img = await loadImage(src);
	const canvas = createCanvas(img.width(), img.height());
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	return ctx.getImageData(0, 0, img.width(), img.height());
};

const getFilename = (url: string) => {
	const filename = url.split('/').pop();
	return (filename || '').split('.')[0];
};

const checkIsPixCopyAndPaste = (barcode: string): boolean => {
	const isPixCopyAndPaste = barcode.length > 44;
	return isPixCopyAndPaste ? true : false;
}

const printResult = (res: Array<Symbol>, url: string): void => {
	const filename = getFilename(url);
	const hasBarcode = res && res.length > 0;

	if (hasBarcode) {
		res.forEach((symbol: Symbol) => {
			const barcode = symbol.decode();
			!checkIsPixCopyAndPaste(barcode) &&
				console.log(`🤙🤙🤙 Barcode found for ${filename}: ${barcode}`);
		});
	} else {
		console.log(`👎👎👎 Barcode not found for: ${filename}`);
	}
	console.log('\n');
};

const getScanner = async () => {
	const scanner = await getDefaultScanner();
	return scanner;
}

const process = async (url: string): Promise<void> => {
	const img = await getImageData(url);
	const res = await scanImageData(img, await getScanner());
	printResult(res, url);
};

const URL_BASE = './assets';

const main = async (): Promise<void> => {
	console.log('\n');
	await process(`${URL_BASE}/campelo.png`);
	await process(`${URL_BASE}/celesc.png`);
	await process(`${URL_BASE}/gps.png`);
	await process(`${URL_BASE}/nubank.png`);
};

main();
