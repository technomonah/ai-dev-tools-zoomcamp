interface Props {
  size?: number;
  className?: string;
}

export default function LeprecoinLogo({ size = 32, className = '' }: Props) {
  const pixelSize = size / 16;

  // 16x16 pixel art leprechaun
  const pixels: { x: number; y: number; color: string }[] = [
    // Hat top (green)
    { x: 5, y: 0, color: '#15803d' },
    { x: 6, y: 0, color: '#15803d' },
    { x: 7, y: 0, color: '#15803d' },
    { x: 8, y: 0, color: '#15803d' },
    { x: 9, y: 0, color: '#15803d' },
    { x: 10, y: 0, color: '#15803d' },

    // Hat body
    { x: 4, y: 1, color: '#15803d' },
    { x: 5, y: 1, color: '#22c55e' },
    { x: 6, y: 1, color: '#22c55e' },
    { x: 7, y: 1, color: '#22c55e' },
    { x: 8, y: 1, color: '#22c55e' },
    { x: 9, y: 1, color: '#22c55e' },
    { x: 10, y: 1, color: '#22c55e' },
    { x: 11, y: 1, color: '#15803d' },

    { x: 4, y: 2, color: '#15803d' },
    { x: 5, y: 2, color: '#22c55e' },
    { x: 6, y: 2, color: '#22c55e' },
    { x: 7, y: 2, color: '#22c55e' },
    { x: 8, y: 2, color: '#22c55e' },
    { x: 9, y: 2, color: '#22c55e' },
    { x: 10, y: 2, color: '#22c55e' },
    { x: 11, y: 2, color: '#15803d' },

    // Hat band (gold buckle)
    { x: 3, y: 3, color: '#166534' },
    { x: 4, y: 3, color: '#166534' },
    { x: 5, y: 3, color: '#166534' },
    { x: 6, y: 3, color: '#ca8a04' },
    { x: 7, y: 3, color: '#eab308' },
    { x: 8, y: 3, color: '#eab308' },
    { x: 9, y: 3, color: '#ca8a04' },
    { x: 10, y: 3, color: '#166534' },
    { x: 11, y: 3, color: '#166534' },
    { x: 12, y: 3, color: '#166534' },

    // Hat brim
    { x: 2, y: 4, color: '#15803d' },
    { x: 3, y: 4, color: '#22c55e' },
    { x: 4, y: 4, color: '#22c55e' },
    { x: 5, y: 4, color: '#22c55e' },
    { x: 6, y: 4, color: '#22c55e' },
    { x: 7, y: 4, color: '#22c55e' },
    { x: 8, y: 4, color: '#22c55e' },
    { x: 9, y: 4, color: '#22c55e' },
    { x: 10, y: 4, color: '#22c55e' },
    { x: 11, y: 4, color: '#22c55e' },
    { x: 12, y: 4, color: '#22c55e' },
    { x: 13, y: 4, color: '#15803d' },

    // Face
    { x: 5, y: 5, color: '#fcd5b4' },
    { x: 6, y: 5, color: '#fcd5b4' },
    { x: 7, y: 5, color: '#fcd5b4' },
    { x: 8, y: 5, color: '#fcd5b4' },
    { x: 9, y: 5, color: '#fcd5b4' },
    { x: 10, y: 5, color: '#fcd5b4' },

    { x: 4, y: 6, color: '#fcd5b4' },
    { x: 5, y: 6, color: '#fcd5b4' },
    { x: 6, y: 6, color: '#1a1a1a' }, // eye
    { x: 7, y: 6, color: '#fcd5b4' },
    { x: 8, y: 6, color: '#fcd5b4' },
    { x: 9, y: 6, color: '#1a1a1a' }, // eye
    { x: 10, y: 6, color: '#fcd5b4' },
    { x: 11, y: 6, color: '#fcd5b4' },

    { x: 4, y: 7, color: '#fcd5b4' },
    { x: 5, y: 7, color: '#fcd5b4' },
    { x: 6, y: 7, color: '#fcd5b4' },
    { x: 7, y: 7, color: '#dc7c5c' }, // nose
    { x: 8, y: 7, color: '#dc7c5c' }, // nose
    { x: 9, y: 7, color: '#fcd5b4' },
    { x: 10, y: 7, color: '#fcd5b4' },
    { x: 11, y: 7, color: '#fcd5b4' },

    // Beard (orange/ginger)
    { x: 3, y: 8, color: '#c2410c' },
    { x: 4, y: 8, color: '#ea580c' },
    { x: 5, y: 8, color: '#ea580c' },
    { x: 6, y: 8, color: '#ea580c' },
    { x: 7, y: 8, color: '#ea580c' },
    { x: 8, y: 8, color: '#ea580c' },
    { x: 9, y: 8, color: '#ea580c' },
    { x: 10, y: 8, color: '#ea580c' },
    { x: 11, y: 8, color: '#ea580c' },
    { x: 12, y: 8, color: '#c2410c' },

    { x: 3, y: 9, color: '#c2410c' },
    { x: 4, y: 9, color: '#ea580c' },
    { x: 5, y: 9, color: '#f97316' },
    { x: 6, y: 9, color: '#f97316' },
    { x: 7, y: 9, color: '#f97316' },
    { x: 8, y: 9, color: '#f97316' },
    { x: 9, y: 9, color: '#f97316' },
    { x: 10, y: 9, color: '#f97316' },
    { x: 11, y: 9, color: '#ea580c' },
    { x: 12, y: 9, color: '#c2410c' },

    { x: 4, y: 10, color: '#c2410c' },
    { x: 5, y: 10, color: '#ea580c' },
    { x: 6, y: 10, color: '#ea580c' },
    { x: 7, y: 10, color: '#ea580c' },
    { x: 8, y: 10, color: '#ea580c' },
    { x: 9, y: 10, color: '#ea580c' },
    { x: 10, y: 10, color: '#ea580c' },
    { x: 11, y: 10, color: '#c2410c' },

    { x: 5, y: 11, color: '#c2410c' },
    { x: 6, y: 11, color: '#c2410c' },
    { x: 7, y: 11, color: '#c2410c' },
    { x: 8, y: 11, color: '#c2410c' },
    { x: 9, y: 11, color: '#c2410c' },
    { x: 10, y: 11, color: '#c2410c' },

    // Gold coins
    { x: 0, y: 12, color: '#ca8a04' },
    { x: 1, y: 12, color: '#eab308' },
    { x: 2, y: 12, color: '#ca8a04' },

    { x: 0, y: 13, color: '#eab308' },
    { x: 1, y: 13, color: '#fde047' },
    { x: 2, y: 13, color: '#eab308' },
    { x: 13, y: 13, color: '#ca8a04' },
    { x: 14, y: 13, color: '#eab308' },
    { x: 15, y: 13, color: '#ca8a04' },

    { x: 0, y: 14, color: '#ca8a04' },
    { x: 1, y: 14, color: '#eab308' },
    { x: 2, y: 14, color: '#ca8a04' },
    { x: 13, y: 14, color: '#eab308' },
    { x: 14, y: 14, color: '#fde047' },
    { x: 15, y: 14, color: '#eab308' },

    { x: 13, y: 15, color: '#ca8a04' },
    { x: 14, y: 15, color: '#eab308' },
    { x: 15, y: 15, color: '#ca8a04' },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {pixels.map((pixel, i) => (
        <rect
          key={i}
          x={pixel.x}
          y={pixel.y}
          width={1}
          height={1}
          fill={pixel.color}
        />
      ))}
    </svg>
  );
}
