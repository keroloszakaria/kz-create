export function generateDarkerShades(baseColor, shadeCount = 5) {
  function hexToHsl(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map(char => char + char).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const x = chroma * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - chroma / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) [r, g, b] = [chroma, x, 0];
    else if (h < 120) [r, g, b] = [x, chroma, 0];
    else if (h < 180) [r, g, b] = [0, chroma, x];
    else if (h < 240) [r, g, b] = [0, x, chroma];
    else if (h < 300) [r, g, b] = [x, 0, chroma];
    else [r, g, b] = [chroma, 0, x];

    r = Math.round((r + m) * 255).toString(16).padStart(2, "0");
    g = Math.round((g + m) * 255).toString(16).padStart(2, "0");
    b = Math.round((b + m) * 255).toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
  }

  const [h, s, l] = hexToHsl(baseColor);
  const shades = [];
  for (let i = 1; i <= shadeCount; i++) {
    const darkerLightness = Math.max(0, l - i * 10);
    shades.push(hslToHex(h, s, darkerLightness));
  }

  return shades;
}
