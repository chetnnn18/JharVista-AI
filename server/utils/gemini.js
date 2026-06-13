const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateTripPlan = async ({ budget, days, interests, startingDistrict }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildFallbackPlan({ budget, days, interests, startingDistrict });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert Jharkhand tourism planner. Create a ${days}-day eco-cultural tourism itinerary.

Starting District: ${startingDistrict}
Budget: ${budget}
Interests: ${interests.join(', ')}

Include real places in Jharkhand (Hundru Falls, Netarhat, Patratu Valley, Deoghar, Betla National Park, Tagore Hill, Rock Garden, Dassam Falls, Jonha Falls, etc.).

Return ONLY valid JSON in this exact format:
{
  "summary": "brief trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "places": ["Place 1", "Place 2"],
      "activities": ["activity 1", "activity 2"],
      "estimatedCost": "₹ amount"
    }
  ],
  "tips": ["tip1", "tip2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return buildFallbackPlan({ budget, days, interests, startingDistrict });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return buildFallbackPlan({ budget, days, interests, startingDistrict });
  }
};

const buildFallbackPlan = ({ budget, days, interests, startingDistrict }) => {
  const allDays = [
    {
      day: 1,
      title: 'Waterfalls & City Heritage',
      places: ['Hundru Falls', 'Tagore Hill', 'Rock Garden'],
      activities: ['Morning trek to Hundru Falls', 'Sunset at Tagore Hill', 'Evening at Rock Garden'],
      estimatedCost: budget === 'Budget' ? '₹1,500' : budget === 'Luxury' ? '₹5,000' : '₹3,000',
    },
    {
      day: 2,
      title: 'Valleys & Scenic Drives',
      places: ['Patratu Valley', 'Jonha Falls', 'Dassam Falls'],
      activities: ['Patratu Valley drive', 'Photography at Jonha Falls', 'Picnic near Dassam Falls'],
      estimatedCost: budget === 'Budget' ? '₹1,200' : budget === 'Luxury' ? '₹4,500' : '₹2,500',
    },
    {
      day: 3,
      title: 'Hills & Tribal Culture',
      places: ['Netarhat', 'Betla National Park'],
      activities: ['Sunrise at Netarhat', 'Wildlife safari at Betla', 'Tribal village visit'],
      estimatedCost: budget === 'Budget' ? '₹2,000' : budget === 'Luxury' ? '₹6,000' : '₹3,500',
    },
    {
      day: 4,
      title: 'Spiritual & Heritage',
      places: ['Deoghar (Baidyanath Temple)', 'Basukinath'],
      activities: ['Temple darshan', 'Local cuisine exploration'],
      estimatedCost: budget === 'Budget' ? '₹1,800' : '₹4,000',
    },
    {
      day: 5,
      title: 'Adventure & Sports Tourism',
      places: ['Ranchi Cricket Stadium', 'Dhoni Legacy Trail', 'Hundru Falls'],
      activities: ['Stadium tour', 'Sports heritage walk', 'Adventure activities'],
      estimatedCost: budget === 'Budget' ? '₹1,500' : '₹3,500',
    },
  ];

  return {
    summary: `A ${days}-day eco-cultural journey through Jharkhand starting from ${startingDistrict}, tailored for ${interests.join(', ')} enthusiasts on a ${budget} budget.`,
    days: allDays.slice(0, days),
    tips: [
      'Best time to visit: October to March',
      'Carry comfortable trekking shoes for waterfalls',
      'Respect tribal customs when visiting villages',
      'Book safari at Betla National Park in advance',
    ],
    source: 'fallback',
  };
};

module.exports = { generateTripPlan };
