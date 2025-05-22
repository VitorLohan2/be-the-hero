// src/utils/storage.js

export function setStorageItem(key, value) {
  try {
    const isObject = typeof value === 'object';
    const stringValue = isObject ? JSON.stringify(value) : value;
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Erro ao salvar "${key}" no localStorage:`, error);
  }
}

export function getStorageItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    // Tenta fazer parse se for um JSON válido
    if (raw.startsWith('{') || raw.startsWith('[')) {
      return JSON.parse(raw);
    }

    return raw; // Retorna como string simples
  } catch (error) {
    console.error(`Erro ao ler "${key}" do localStorage:`, error);
    return fallback;
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover "${key}" do localStorage:`, error);
  }
}

export function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Erro ao limpar o localStorage:', error);
  }
}
