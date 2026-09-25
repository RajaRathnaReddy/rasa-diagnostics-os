import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { Patient, Appointment } from '../data/demoData';

export const COLLECTIONS = {
  PATIENTS: 'diagnostic_patients',
  APPOINTMENTS: 'diagnostic_appointments',
  LAB_ORDERS: 'diagnostic_lab_orders',
  BRANCHES: 'diagnostic_branches',
  ACTIVITY_LOGS: 'diagnostic_audit_logs',
};

/**
 * Sync a newly registered patient to Cloud Firestore
 */
export async function syncPatientToFirestore(patient: Patient): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const ref = doc(db, COLLECTIONS.PATIENTS, patient.id);
    await setDoc(ref, {
      ...patient,
      syncedAt: serverTimestamp(),
      cloudSyncStatus: 'SYNCED',
    }, { merge: true });
    return true;
  } catch (err) {
    console.info('Firestore offline/fallback for patient sync:', err);
    return false;
  }
}

/**
 * Sync an appointment or queue token to Cloud Firestore
 */
export async function syncAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const ref = doc(db, COLLECTIONS.APPOINTMENTS, appointment.id);
    await setDoc(ref, {
      ...appointment,
      syncedAt: serverTimestamp(),
      cloudSyncStatus: 'SYNCED',
    }, { merge: true });
    return true;
  } catch (err) {
    console.info('Firestore offline/fallback for appointment sync:', err);
    return false;
  }
}

/**
 * Sync lab requisition order to Cloud Firestore
 */
export async function syncLabOrderToFirestore(order: any): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const ref = doc(db, COLLECTIONS.LAB_ORDERS, order.id || `order-${Date.now()}`);
    await setDoc(ref, {
      ...order,
      syncedAt: serverTimestamp(),
      cloudSyncStatus: 'SYNCED',
    }, { merge: true });
    return true;
  } catch (err) {
    console.info('Firestore offline/fallback for lab order sync:', err);
    return false;
  }
}

/**
 * Fetch remote patients from Cloud Firestore if available
 */
export async function fetchRemotePatients(): Promise<Patient[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const colRef = collection(db, COLLECTIONS.PATIENTS);
    const snap = await getDocs(colRef);
    const results: Patient[] = [];
    snap.forEach((d) => {
      results.push(d.data() as Patient);
    });
    return results;
  } catch {
    return [];
  }
}

/**
 * Realtime listener for live sync
 */
export function subscribeToFirestorePatients(onUpdate: (patients: Patient[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const colRef = collection(db, COLLECTIONS.PATIENTS);
    const unsubscribe = onSnapshot(colRef, (snap) => {
      const items: Patient[] = [];
      snap.forEach((d) => items.push(d.data() as Patient));
      if (items.length > 0) {
        onUpdate(items);
      }
    }, (err) => {
      console.info('Live snapshot listener offline:', err?.message);
    });
    return unsubscribe;
  } catch {
    return () => {};
  }
}
