import { HttpError, apiRequest } from '../services/httpClient';
import { readStorage, writeStorage } from '../services/storage';

type AdminMethod = 'POST' | 'PUT' | 'DELETE';

interface SaveResult {
  ok: boolean;
  message: string;
}

interface AdminPanelStore<TRecord> {
  getLocal(): TRecord[];
  setLocal(records: TRecord[]): void;
  addLocal(record: TRecord): TRecord[];
  updateLocal(index: number, record: TRecord): TRecord[];
  deleteLocal(index: number): TRecord[];
  send(path: string, method: AdminMethod, body?: BodyInit | null, headers?: HeadersInit): Promise<SaveResult>;
}

class AdminPanelState<TRecord> implements AdminPanelStore<TRecord> {
  constructor(private readonly storageKey: string) {}

  getLocal(): TRecord[] {
    return readStorage<TRecord[]>(this.storageKey, []);
  }

  setLocal(records: TRecord[]): void {
    writeStorage(this.storageKey, records);
  }

  addLocal(record: TRecord): TRecord[] {
    const next = [...this.getLocal(), record];
    this.setLocal(next);
    return next;
  }

  updateLocal(index: number, record: TRecord): TRecord[] {
    const current = this.getLocal();
    if (!current[index]) return current;
    current[index] = record;
    this.setLocal(current);
    return current;
  }

  deleteLocal(index: number): TRecord[] {
    const current = this.getLocal();
    current.splice(index, 1);
    this.setLocal(current);
    return current;
  }

  async send(path: string, method: AdminMethod, body?: BodyInit | null, headers?: HeadersInit): Promise<SaveResult> {
    try {
      await apiRequest(path, { method, body, headers });
      return { ok: true, message: 'Operacion completada' };
    } catch (error) {
      if (error instanceof HttpError) {
        return { ok: false, message: error.message || `Error ${error.status}` };
      }
      return { ok: false, message: 'No se pudo completar la operacion' };
    }
  }
}

export function useAdminPanel<TRecord>(storageKey: string): AdminPanelStore<TRecord> {
  return new AdminPanelState(storageKey);
}
