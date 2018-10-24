import React from 'react'
import View from '../ui/basic/components/View'
import Text from '../ui/basic/components/Text'
import Image from '../ui/basic/components/Image'
import { withCss } from '../ui/style'
import logo from '../assets/logo.png'
import c from 'classnames'
import { Icon } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'

const VoteInfo = withCss(t => ({
  root: {
    fontSize: 24,
    marginTop: '0.5em',
    width: '100%',
    color: 'white',
    justifyContent: 'space-between',
  },
  star: {
    marginLeft: `0.3em !important`,
  },
  date: {
    fontSize: 16
  }
}))(({voteCount, lastVoteTime, classes}) =>
  <View horizontal className={classes.root}>
    <View horizontal>
      <Text>{voteCount}</Text>
      <Icon name="favorite"
            className={classes.star}/>
    </View>
    <View horizontal className={classes.date}>
      <Icon name="clock outline"/>
      <TimeAgo date={lastVoteTime}/>
    </View>
  </View>)

const Name = withCss({
  root: {
    padding: '0.7em',
    paddingTop: '2.5em',
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    width: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 30%,rgba(0,0,0,0) 100%)'
  }, name: {
    marginBottom: '0.5em',
  }
})(({className, classes, value, voteCount, lastVoteTime, showVoteInfo}) =>
  <View className={c(classes.root, className)}>
    <Text className={classes.name}>{value}</Text>
    {showVoteInfo &&
    <VoteInfo voteCount={voteCount} lastVoteTime={lastVoteTime}/>}
  </View>)

const Cat = ({
               img, name, onClick,
               showVoteInfo,
               classes, voteCount, lastVoteTime, size
             }) =>
  <View onClick={onClick} className={classes.root}>
    <Image src={img}
           loadingImg={logo}
           className={classes.img}
           centered={true}
           height={size}
           width={size}
    />
    <Name value={name}
          showVoteInfo={showVoteInfo}
          voteCount={voteCount}
          lastVoteTime={lastVoteTime}
          className={classes.name}/>
  </View>

export default withCss(({
  root: ({
    cursor: p => p.onClick && 'pointer',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    position: 'relative',
    transition: 'all 200ms',
    '&:active': ({
      transform: p => p.onClick && 'scale(0.95)',
    }),
  }),
  img: ({
    transition: 'transform 100ms cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    '&:hover': {
      transform: p => p.onClick && 'scale(1.08)',
    }
  })
  ,
  name: {
    position: 'absolute',
    bottom: 0,
    left: 0

  }
}))(Cat)