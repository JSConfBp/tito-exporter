import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  events: {
    width: '16rem'
  },
}))

const Events = ({
	event = '',
	setEvent,
	events = {},
	disabled = false
}) => {
  const classes = useStyles()

  return (
    <Select
		className={ classes.events }
		value={ event }
		onChange={ (data) => setEvent(data.target.value) }
		displayEmpty
		disabled={ disabled }
		inputProps={{
			name: 'event',
			id: 'select-event',
		}}
	>
		<MenuItem value="" disabled>
			Select event
		</MenuItem>
		{ Object.entries(events).map(([event, label]) => (
			<MenuItem value={ event }>{ label }</MenuItem>
		)) }
	</Select>
  )
}

export default Events
