let cachedFontCSS: string | null = null;

export const getCachedFontCSS = () => cachedFontCSS;

export const prefetchExportFont = async (fontUrl: string) => {
  if (cachedFontCSS) return;

  const response = await fetch(fontUrl);
  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  cachedFontCSS = `
    @font-face {
      font-family: 'Space Grotesk Variable';
      font-style: normal;
      font-weight: 300 700;
      src: url(${base64}) format('woff2-variations');
    }
  `;
};
