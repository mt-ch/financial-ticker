export interface Delta {
  price: number;
  change: number;
  chgPercentage: number;
}

export interface DeltaDataSet {
  deltas: Delta[];
  interval: number;
}
