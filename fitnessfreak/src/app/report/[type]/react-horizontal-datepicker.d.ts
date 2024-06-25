// src/types/react-horizontal-datepicker.d.ts
declare module 'react-horizontal-datepicker' {
    import * as React from 'react';
  
    export interface DatePickerProps {
      getSelectedDay?: (val: any) => void;
      startDate?: Date;
      endDate?: Date;
      selectDate?: (date: Date) => void;
      labelFormat?: string;
      color?: string;
      // Add any other props based on the documentation of the component
    }
  
    const DatePicker: React.FC<DatePickerProps>;
  
    export default DatePicker;
  }
  