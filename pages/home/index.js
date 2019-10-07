import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import Header from '../../components/Header'

import fetchOrders from './fetch-orders'
import filterColumns from './filter-columns'
import createSheet from './create-sheet'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  main: {
    paddingTop: '3rem'
  }
}))

const IndexPage = ({ jsTickets, cssTickets }) => {
  const [ errorNotification, setErrorNotification ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [completed, setCompleted] = React.useState(0);

	const closeErrorNotification = () => {
		setErrorNotification(false)
	}

	useEffect(() => {
		const rawToken = (new URL(window.location.href)).searchParams.get('token')

		if (rawToken) {
			setToken(rawToken)
		}

		return () => {}
  })

  return (
    <>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="md">

        <Button
          onClick={ () => {
            setLoading(true)
            fetchOrders(setCompleted, (data) => {

              createSheet(filterColumns(data))

              setLoading(false)
            })}
           }
          disabled={ loading }
        >
          { loading ? 'Getting orders...' : 'Get orders'}
        </Button>
        {loading ? (
          <LinearProgress variant="buffer" value={completed} valueBuffer={ completed + 2 } />
        ) : (<LinearProgress variant="determinate" value={0} />)}

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
