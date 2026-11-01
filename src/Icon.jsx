const icons = {
  home: '🏠',
  box: '📦',
  plus: '➕',
  people: '👥',
  store: '🏪',
};

export default function Icon({ name }) {
  return <span className="icon" aria-hidden="true">{icons[name]}</span>;
}
