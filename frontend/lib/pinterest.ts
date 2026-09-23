import { PinterestStyle, fallbackFashionData } from './fashion-data';

export const fetchPinterestStyles = async (category?: string, query?: string): Promise<PinterestStyle[]> => {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST || 'pinterest-api1.p.rapidapi.com';

  // Determine fallback data based on category
  let localData = fallbackFashionData;
  if (category && category !== 'all') {
    localData = localData.filter(item => item.category === category);
  }
  if (query) {
    const lowerQuery = query.toLowerCase();
    localData = localData.filter(item => item.title.toLowerCase().includes(lowerQuery));
  }

  // If no API key is set, use local fallback
  if (!apiKey || apiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
    console.warn('No RapidAPI Key found or it is invalid. Using local fallback data.');
    return localData;
  }

  try {
    // Pinterest API integration goes here.
    // NOTE: This assumes a specific endpoint structure for a Pinterest RapidAPI wrapper.
    // Replace the URL and response mapping logic depending on the exact API chosen.
    const searchQuery = query || (category ? `${category} nigerian fashion` : 'nigerian fashion');
    
    const response = await fetch(`https://${apiHost}/search/pins?q=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour as requested
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Map external API response to our standard PinterestStyle interface
    if (data && data.data && data.data.pins) {
       return data.data.pins.map((pin: any) => ({
         id: `pin-${pin.id}`,
         title: pin.title || pin.description || 'Pinterest Style',
         imageUrl: pin.images?.orig?.url || pin.images?.[0]?.url,
         category: category || 'all',
         aspectRatio: (pin.images?.orig?.height && pin.images?.orig?.width) 
           ? pin.images.orig.height / pin.images.orig.width 
           : 1.5,
         sourceUrl: pin.link || 'https://pinterest.com',
       })).filter((pin: PinterestStyle) => pin.imageUrl); // Ensure it has an image
    }

    return localData;
  } catch (error) {
    console.error('Pinterest API fetch failed, falling back to local data:', error);
    return localData;
  }
};
