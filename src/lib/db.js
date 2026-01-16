import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { parcels: [], notifications: [] };
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (e) {
    return { parcels: [], notifications: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getParcels() {
  const db = readDb();
  return db.parcels;
}

export async function createParcel(parcel) {
  const db = readDb();
  const newParcel = {
    ...parcel,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  db.parcels.push(newParcel);
  writeDb(db);
  return newParcel;
}

export async function updateParcelStatus(id, status, partnerId = null) {
  const db = readDb();
  const index = db.parcels.findIndex(p => p.id === id);
  if (index !== -1) {
    db.parcels[index].status = status;
    if (partnerId) db.parcels[index].partnerId = partnerId;
    
    // Create Notification
    if (status === 'accepted') {
        db.notifications.push({
            id: Math.random().toString(36).substr(2, 9),
            parcelId: id,
            message: `Your parcel to ${db.parcels[index].drop.name} has been accepted by a traveler!`,
            read: false,
            timestamp: new Date().toISOString()
        });
    }
    
    writeDb(db);
    return db.parcels[index];
  }
  return null;
}

export async function getNotifications() {
    const db = readDb();
    return db.notifications;
}
