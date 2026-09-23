export interface PinterestStyle {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  aspectRatio: number;
  sourceUrl: string;
}

// Generate random aspect ratio between 1.0 (square) and 1.5 (tall) to simulate Pinterest masonry
const getRandomAspectRatio = () => 1.0 + Math.random() * 0.5;

export const fallbackFashionData: PinterestStyle[] = [
  // Men's Native (m-collection)
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `m-fallback-${i + 1}`,
    title: `Men's Native Style ${i + 1}`,
    imageUrl: `/images/m-collection ${i + 1}.jpg`,
    category: 'm-collection',
    aspectRatio: getRandomAspectRatio(),
    sourceUrl: 'https://kingjoebridd.com',
  })),

  // Women's Couture (w-collection)
  ...Array.from({ length: 11 }).map((_, i) => ({
    id: `w-fallback-${i + 1}`,
    title: `Women's Couture Style ${i + 1}`,
    imageUrl: `/images/w-collection ${i + 1}.jpg`,
    category: 'w-collection',
    aspectRatio: getRandomAspectRatio(),
    sourceUrl: 'https://kingjoebridd.com',
  })),

  // Traditional (t-collection)
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `t-fallback-${i + 1}`,
    title: `Traditional Asoebi Style ${i + 1}`,
    imageUrl: `/images/t-collection ${i + 1}.jpg`,
    category: 't-collection',
    aspectRatio: getRandomAspectRatio(),
    sourceUrl: 'https://kingjoebridd.com',
  })),
];
