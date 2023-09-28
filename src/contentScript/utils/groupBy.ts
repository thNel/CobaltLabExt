export const groupBy = <T extends Record<string | number, any>>(array: T[], filter: (string | number)) => {
  const filterArray = filter.toString().split('.');
  return array.reduce<Record<string | number, T[]>>((response, elem, currentIndex) => {
    const key = filterArray.reduce<typeof elem[keyof typeof elem]>((acc, item) => acc[item], {...elem} as typeof elem[keyof typeof elem]);
    if (typeof key === 'string' || typeof key === 'number') {
      (response[key] = response[key] ?? []).push(elem);
    } else {
      throw new Error(`array[${currentIndex}]["${filterArray.join('"]["')}"] type is NOT string or number. Can't create group with such name.`);
    }
    return response;
  }, {})
};