    import React from 'react';
    import DatePicker from 'react-datepicker';

    export const DatePickerField = ({ name, value, placeholderText, onChange }) => {
      return (
        <DatePicker
          selected={(value && new Date(value)) || null} // Convert stored value to Date object for DatePicker
          onChange={date => onChange(name, date)} // Update Formik's field value
          dateFormat="MM/dd/yyyy" // Customize date format as needed
          placeholderText={placeholderText}
        />
      );
    };