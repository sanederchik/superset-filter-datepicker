import React, {useState} from 'react'
import moment from 'moment'

import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const DEFAULT_MIN_DATE = moment("1999-12-31");
const DEFAULT_MAX_DATE = moment("2099-12-31");
const DEFAULT_START_DATE = moment(new Date());

const DatePicker = (props) => {

    const [focusedInput, setFocusedInput] = useState(0)
    const [startDate, setStartDate] = useState(DEFAULT_START_DATE)
    const [endDate, setEndDate] = useState(null)
    const [invisibleMonth, setInvisibleMonth] = useState(DEFAULT_START_DATE);

    function getDatesInDictRange(startDate, endDate){
        var dates = [];

        var currDate = moment(startDate).startOf('day');
        var lastDate = moment(endDate).startOf('day');
    
        while(currDate.add(1, 'days').diff(lastDate) < 0) {
            dates.push(`date'${currDate.clone().toDate()}'`)
        }
    
        return dates;
    }

    function getFormattedDateRange(startDate, endDate){
        return `${startDate.format()} : ${endDate.format()}`
    }

    const handleDatesChange = (e) => {

        if(!e.startDate || !e.endDate){
          return
        }

        setStartDate(e.startDate)
        setEndDate(e.endDate)
        props.onChange(props.filterKey, getFormattedDateRange(e.startDate, e.endDate))
    }

    const returnYears = () => {
        let years = [];
        for (
          let i = parseInt(DEFAULT_MIN_DATE.format("YYYY"));
          i <= parseInt(DEFAULT_MAX_DATE.format("YYYY"));
          i++
        ) {
          years.push(<option value={i}>{i}</option>);
        }
        return years;
      };
    
      const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", className: 'datepicker-month-year' }}>
            <div>
              <select
                value={
                  moment(month).isBefore(DEFAULT_MIN_DATE)
                    ? DEFAULT_MIN_DATE.month()
                    : month.month()
                }
                onChange={e => {
                  if (month.isBefore(DEFAULT_MIN_DATE)) {
                    onMonthSelect(DEFAULT_MIN_DATE, DEFAULT_MIN_DATE.month());
                  } else {
                    onMonthSelect(month, e.target.value);
                  }
                }}
              >
                {moment.months().map((label, value) => (
                  <option value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={month.year()}
                onChange={e => {
                  onYearSelect(month, e.target.value);
                }}
              >
                {returnYears()}
              </select>
            </div>
          </div>
        );
      };

    return (
        <DateRangePicker
            startDatePlaceholderText="Дата начала"
            endDatePlaceholderText="Дата окончания"
            minDate={DEFAULT_MIN_DATE}
            maxDate={DEFAULT_MAX_DATE}
            startDate={startDate} // momentPropTypes.momentObj or null,
            startDateId="start_date_id" // PropTypes.string.isRequired,
            endDate={endDate} // momentPropTypes.momentObj or null,
            endDateId="end_date_id" // PropTypes.string.isRequired,
            onDatesChange={handleDatesChange}
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
            isOutsideRange={d => d.isBefore(DEFAULT_MIN_DATE) || d.isAfter(DEFAULT_MAX_DATE)}
            initialVisibleMonth={() => invisibleMonth}
            appendToBody= {true}
            renderMonthElement={renderMonthElement}

        />
    )
}

export default DatePicker