const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Picks a readable letter colour for a custom avatar background: dark ink on
 * light backgrounds, near-white on dark ones. Returns undefined when the user
 * has not chosen a colour, so the theme's own default applies.
 */
export function readableInk(background: string | null | undefined): string | undefined {
  if (!background || !HEX.test(background)) {
    return undefined;
  }

  const value = background.slice(1);
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];

  return luminance > 0.22 ? "#04121A" : "#F2FBFF";
}
