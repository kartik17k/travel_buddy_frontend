import * as React from 'react';

export interface CityAutocompleteProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onValid: (isValid: boolean) => void;
  name: string;
  required?: boolean;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps>;
export default CityAutocomplete;