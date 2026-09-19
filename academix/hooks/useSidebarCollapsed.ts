import { useSyncExternalStore } from "react";

const STORAGE_KEY = "academix.sidebar.collapsed";
const listeners = new Set<() => void>();

const read = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const setCollapsed = (collapsed: boolean) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {}
  listeners.forEach((listener) => listener());
};

// Server snapshot is always "expanded" so hydration matches; the stored value applies right after.
export const useSidebarCollapsed = () => {
  const collapsed = useSyncExternalStore(subscribe, read, () => false);
  return { collapsed, toggleCollapsed: () => setCollapsed(!collapsed) };
};
