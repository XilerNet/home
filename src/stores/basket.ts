// src/stores/content.js
import { writable } from 'svelte/store'

type storedItem = string[];
const key = 'basket';

const stored = localStorage.getItem(key);
export const basket = writable<storedItem>(stored ? JSON.parse(stored) : []);
export const addToBasket = (item: string) => basket.update((items: storedItem) => [...items, item]);
export const removeFromBasket = (item: string) => basket.update((items: storedItem) => items.filter((i: string) => i !== item));

export const clearBasket = () => basket.set([]);
basket.subscribe((value: storedItem) => localStorage.setItem(key, JSON.stringify(value)));