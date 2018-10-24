import React, { Fragment } from 'react'
import View from '../ui/basic/components/View'
import Cat from './Cat'
import { compose, equals } from 'ramda'
import { lifecycle, withProps } from 'recompose'
import { withCss } from '../ui/style'
import { centerContent, exceptLast } from '../ui/style/mixins'
import { withAsyncOp } from '../ui/basic/components/withAsyncOp'
import { withAppContext } from '../app-context/AppContext'
import { Loader } from 'semantic-ui-react'

let lastPair

const Voting = ({a, b, onSelect, classes, next, isLoaded}) =>
  <View horizontal className={classes.root}>
    {isLoaded ?
      <Fragment>
        <Cat {...a} size={400}
             onClick={() => onSelect(a)}/>
        <Cat {...b} size={400}
             onClick={() => onSelect(b)}/>
      </Fragment> : <Loader active={true}/>}
  </View>

export default compose(
  withCss(t => ({
    root: {
      ...centerContent(),
      flexGrow: 1,
      ...exceptLast({
        marginRight: t.spacing
      })
    }
  })),
  withAppContext(({catApi, sessionManager}) => ({
    getNextPair: vote => catApi.nextPair(
      {
        session: sessionManager.currentSession(),
        vote
      })
  })),
  withAsyncOp(),
  lifecycle({
    componentDidMount () {
      const {runAsync, getNextPair} = this.props
      runAsync(() => getNextPair())
    }
  }),
  withProps(({getPair, result, error, opStarted, runAsync, getNextPair}) => {

    const pair = error ? null : result
    return {
      ...(pair || {}),
      isLoaded: !!pair,
      onSelect: pick => {

        // Cheap repeated submit guard
        if (equals(lastPair, pair)) {
          console.warn('Duplicate submit')
          return
        }

        lastPair = pair
        const vote = {pair, pick}
        runAsync(() => getNextPair(vote))
      }
    }
  })
)(Voting)
