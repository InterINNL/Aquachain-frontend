import {
  DataEntry,
  ParsedDataEntry,
  ParsedSensor,
  Sensor,
} from '@services/contract/contract';

export function parseSensor(sensor: Sensor): ParsedSensor | null {
  try {
    let parsed: Record<string, unknown> = {};
    if (typeof sensor.data_str === 'string') {
      parsed = JSON.parse(sensor.data_str) as Record<string, unknown>;
    }
    return {
      ...sensor,
      ...(parsed as object),
      created_at: sensor.created_at
        ? new Date(Number(sensor.created_at) * 1000).toISOString()
        : sensor.created_at,
    } as ParsedSensor;
  } catch {
    return null;
  }
}

export function parseDataEntry(entry: DataEntry): ParsedDataEntry | null {
  try {
    let parsed: Record<string, unknown> = {};
    if (typeof entry.data_str === 'string') {
      parsed = JSON.parse(entry.data_str) as Record<string, unknown>;
    }
    return {
      ...entry,
      ...(parsed as object),
      created_at: entry.created_at
        ? new Date(Number(entry.created_at) * 1000).toISOString()
        : entry.created_at,
      updated_at: entry.updated_at
        ? new Date(Number(entry.updated_at) * 1000).toISOString()
        : entry.updated_at,
    } as ParsedDataEntry;
  } catch {
    return null;
  }
}

export function sensorCoords(
  sensor: ParsedSensor,
): { lat: number; lng: number } | null {
  const lat = Number(sensor.location?.lat);
  const lng = Number(sensor.location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  return { lat, lng };
}

export function statusClass(status: string | undefined): Record<string, boolean> {
  const s = (status ?? '').toLowerCase();
  return {
    'bg-success': s === 'active',
    'bg-secondary': s === 'inactive',
    'bg-warning': s === 'proposed',
  };
}
