    import React from 'react';
    import DatePicker from 'react-datepicker';

    export const DatePickerField = ({ name, value, placeholderText, onChange, timeOnly }) => {
      return timeOnly ? (
        <DatePicker
          selected={(value && new Date(value)) || null} // Convert stored value to Date object for DatePicker
          onChange={date => onChange(name, date)} // Update Formik's field value
          dateFormat="h:mm aa" // Customize date format as needed
          placeholderText={placeholderText}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
        />
      )
      : (
      <DatePicker
          selected={(value && new Date(value)) || null} // Convert stored value to Date object for DatePicker
          onChange={date => onChange(name, date)} // Update Formik's field value
          dateFormat="MM/dd/yyyy" // Customize date format as needed
          placeholderText={placeholderText}
        />
      );
    };