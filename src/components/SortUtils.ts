import { Trend } from '../models';
import { TableType } from './Table.config';

export const descendingComparator = (a: TableType, b: TableType, orderBy: keyof TableType) => {
  if (
    typeof a[orderBy] === 'object' &&
    'power' in (a as any)[orderBy] &&
    typeof b[orderBy] === 'object' &&
    'power' in (b as any)[orderBy]
  ) {
    if ((b[orderBy] as Trend).power < (a[orderBy] as Trend).power) {
      return -1;
    }
    if ((b[orderBy] as Trend).power > (a[orderBy] as Trend).power) {
      return 1;
    }
    return 0;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
};

export type Order = 'asc' | 'desc';

export const getComparator = (
  order: Order,
  orderBy: keyof TableType,
): ((a: TableType, b: TableType) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};
