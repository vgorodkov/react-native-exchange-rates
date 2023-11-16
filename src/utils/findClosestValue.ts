export function findClosestValue(
  input: number,
  array: number[],
): number | null {
  'worklet';
  if (array.length === 0) {
    return null; // Handle the case when the array is empty.
  }

  let closestValue = array[0];
  let minDifference = Math.abs(input - closestValue);

  for (let i = 1; i < array.length; i++) {
    const currentDifference = Math.abs(input - array[i]);
    if (currentDifference < minDifference) {
      closestValue = array[i];
      minDifference = currentDifference;
    }
  }

  return closestValue;
}
