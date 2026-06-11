export const skins = [
  { id: 'orange', name: 'Orange', body: '#E8B86D', spots: '#D97757', face: '#111111' },
  { id: 'black', name: 'Black', body: '#171313', spots: '#2d2525', face: '#F5F5F5' },
  { id: 'siamese', name: 'Siamese', body: '#F6E8C3', spots: '#6f5848', face: '#111111' },
  { id: 'mackerel', name: 'Mackerel', body: '#b7aa92', spots: '#4d473c', face: '#111111' },
  { id: 'white', name: 'White', body: '#F5F5F5', spots: '#d9d2c2', face: '#111111' }
];

export const accessories = [
  { id: 'hat', name: 'Hat', symbol: '^' },
  { id: 'scarf', name: 'Scarf', symbol: '=' },
  { id: 'glasses', name: 'Glasses', symbol: 'oo' },
  { id: 'backpack', name: 'Backpack', symbol: '[]' }
];

export function getSkin(id) {
  return skins.find((skin) => skin.id === id) || skins[0];
}
