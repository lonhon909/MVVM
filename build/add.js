export default function add() {
  return [...arguments].reduce((total, item) => total + item, 0);
}