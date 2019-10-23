import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import dayjs from 'dayjs'

import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Header from '../../components/Header'
import Events from '../../components/Events';

import fetchOrders from './fetch-orders'
import filterColumns from './filter-columns'
import createSheet from './create-sheet'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  section: {
    padding: '1rem 0',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  main: {
    paddingTop: '3rem'
  },
  getOrders: {
    marginLeft: '1rem'
  },
  progress: {
    width: '100%'
  },
  hidden: {
    display: 'none'
  }
}))

const IndexPage = ({ jsTickets, cssTickets }) => {
  const classes = useStyles();
  const [ errorNotification, setErrorNotification ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ completed, setCompleted ] = useState(0);
  const [ event, setEvent ] = useState('');
  const [ xls, setXls ] = useState(null);
  const [ hasXls, setHasXls ] = useState(false);

	const closeErrorNotification = () => {
		setErrorNotification(false)
  }

  const eventList = {
    'reinforce-conf-2019': "Reinforce Conference 2019",
    'jsconf-budapest-2019': "JSConf Budapest 2019",
    'jsconf-budapest-2020': "JSConf Budapest 2020",
  };

	useEffect(() => {
		const rawToken = (new URL(window.location.href)).searchParams.get('token')

		if (rawToken) {
			setToken(rawToken)
		}

		return () => {}
  })

  const getOrders = () => {
    setLoading(true)
    fetchOrders(event, setCompleted, (data) => {
      const sheetData = filterColumns(data)

      console.log(
        sheetData.reduce((obj, row) => {
          console.log(row);

          if (!obj[row.Country]) {
            obj[row.Country] = 0
          }

console.log(row.quantities);


          obj[row.Country] += 1; // (add tickets number)


          return arr
        },{})
      );

      setXls(createSheet(sheetData))
      setHasXls(true)
      setLoading(false)
    })
  }


  const downloadOrders = () => {
    const fileName = `${event}_tito-export_${dayjs().format('YYYY-MM-DD')}.xlsx`
    const blob = new Blob([xls], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;'
    });

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  const reset = () => {
    setErrorNotification(false);
    setLoading(false);
    setCompleted(0);
    setEvent('');
    setXls(null);
    setHasXls(false);
  }

  return (
    <>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="md" className={ classes.main }>

        <div className={ classes.section }>
          <Events
            disabled={ loading }
            event={ event }
            setEvent={ e => setEvent(e) }
            events={ eventList }
          />
          <Button
            className={ classes.getOrders }
            variant={ !(loading || xls) ? "contained" : 'text'}
            onClick={ () => getOrders() }
            disabled={ !event || loading || xls }
          >
            { loading ? 'Getting orders...' : 'Get orders'}
          </Button>
        </div>

        <div className={ classes.section }>
          {loading ? (
            <LinearProgress className={classes.progress} variant="buffer" value={completed} valueBuffer={ completed + 2 } />
          ) : (
            <LinearProgress className={classes.progress} variant="determinate" value={0} />
          )}
        </div>

        <div className={ classnames(classes.section, !hasXls && classes.hidden) }>
          <Button
            color="primary"
            variant="contained"
            onClick={ () => downloadOrders() }
            disabled={ !hasXls }
          >
            Download XLS
          </Button>

          <Button
            variant="text"
            onClick={ () => reset() }
          >
            or select another event
          </Button>
        </div>

      </Container>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={ errorNotification }
        autoHideDuration={5000}
        onClose={closeErrorNotification}
      >
		<SnackbarContent
			aria-describedby="client-snackbar"
			message={
          <span id="client-snackbar">
            <ErrorIcon />
            Could not save check in!
          </span>
        }
    	/>
	  </Snackbar>
    </>
  )
}

IndexPage.getInitialProps = async ({req, res}) => {

  return {

  }
}

export default IndexPage
