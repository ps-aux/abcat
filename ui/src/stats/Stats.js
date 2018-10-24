import React from 'react'
import View from '../ui/basic/components/View'
import { withCss } from '../ui/style/index'
import { Divider, Loader, Statistic } from 'semantic-ui-react'
import { compose } from 'ramda'
import { centerContent } from '../ui/style/mixins'
import { connect } from 'react-redux'

const Stat = ({label, value, size}) =>
  <Statistic size={size}>
    <Statistic.Value>{value}</Statistic.Value>
    <Statistic.Label>{label}</Statistic.Label>
  </Statistic>

const Votes = withCss({
  root: {
    ...centerContent()
  }
})(({classes, count, repeatedVotes}) =>
  <View horizontal className={classes.root}>
    <Stat size={'huge'} label={'Vote'} value={count}/>
    <View>
      <Stat label={'Repeated votes'} value={repeatedVotes.count}/>
      <View horizontal>
        <Stat label={'Same cat picks'} size={'tiny'} value={repeatedVotes.samePickCount}/>
        <Stat label={'Other cat picks'} size={'tiny'} value={repeatedVotes.otherPickCount}/>
      </View>
    </View>
  </View>)

const Stats = ({classes, catCount, voteCount, stats}) =>
  <View className={classes.root}>
    {!stats ? <Loader active={true}/> : <>
      <Stat size={'huge'} label={'Cats'} value={stats.catCount}/>
      <Divider/>
      <Votes {...stats.votes}/>
      <Divider/>
      <View horizontal>
        <Stat label={'Sessions'} value={stats.session.count}/>
        <Stat label={'Average votes per session'}
              value={Math.round(stats.session.averageVoteCount)}/>
      </View>
    </>}
  </View>

export default compose(
  withCss({
    root: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }),
  connect(s => ({
    stats: s.stats
  })),
)(Stats)
