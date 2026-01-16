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
  let price = 0;
  const isHeavy = weightKg > 5;
  
  if (distance <= 200) {
      const rate = isHeavy ? 7 : 4;
      price = distance * rate;
  } else {
      // First 200km
      const first200Rate = isHeavy ? 7 : 4;
      price += 200 * first200Rate;
      
      // Remaining distance (> 200km)
      // "after that make 4 km for both" -> 4 rs/km
      const remainingDist = distance - 200;
      price += remainingDist * 4;
  }
  
  return Math.round(price);
}
