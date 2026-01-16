export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function calculatePrice(distance, weightKg) {
  // Base price calculation
  let price = 45 + (0.5 * distance);

  // Determine weight multiplier
  let weightMultiplier;
  if (weightKg <= 0.1) { // less than or equal to 100 gm
    weightMultiplier = 1;
  } else if (weightKg > 0.1 && weightKg <= 2) { // 101 gm to 2 kg
    weightMultiplier = 1.5;
  } else if (weightKg > 2 && weightKg <= 5) { // 2 kg to 5 kg
    weightMultiplier = 2;
  } else { // Assuming weights over 5kg also get 2x as per the last specified tier
    weightMultiplier = 2;
  }
  
  const finalPrice = price * weightMultiplier;
  
  return Math.round(finalPrice);
}
