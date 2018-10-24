import React from 'react'
import View from '../ui/basic/components/View'
import { withRouter } from 'react-router'
import { lifecycle, withProps, withStateHandlers } from 'recompose'
import { compose } from 'ramda'
import { parse, stringify } from 'query-string'
import { withAppContext } from '../app-context/AppContext'
import Cat from '../voting/Cat'
import { Col, Grid, Row } from 'react-flexbox-grid/lib/index'
import 'react-flexbox-grid/dist/react-flexbox-grid.css'
import { Button, Icon } from 'semantic-ui-react'
import { withCss } from '../ui/style'
import { centerContent } from '../ui/style/mixins'

const SortButton = withCss({
  root: {
    color: p => p.by === p.sortedBy ? 'black' : 'gray',
    cursor: 'pointer'
  }
})(({iconName, onClick, classes}) =>
  <View horizontal className={classes.root} onClick={onClick}>
    <Icon name="sort numeric down"/>
    <Icon name={iconName}/>
  </View>)

const Pagination = withCss(t => ({
  root: {
    position: 'relative',
    marginTop: t.spacing,
    marginBottom: t.spacing,
    width: '100%',
    ...centerContent()
  },
  button: {
    width: 120
  },
  sort: {
    color: 'gray',
    fontSize: 20,
    '& >i,*': {
      marginRight: t.spacing,
    },
    left: 0
  },
  selected: {
    color: 'black',
  }
}))(({classes, next, previous, previousAllowed = true, nextAlllowed = true, sortedBy, onSort}) =>
  <View horizontal className={classes.root}>
    <View horizontal className={classes.sort}>
      <SortButton iconName="favorite"
                  onClick={() => onSort('voteCount')}
                  sortedBy={sortedBy}
                  by={'voteCount'}/>
      <SortButton iconName="clock outline"
                  sortedBy={sortedBy}
                  onClick={() => onSort('date')}
                  by={'date'}/>
    </View>
    <Button onClick={previous}
            disabled={!previousAllowed}
            className={classes.button}>

      <Icon name="angle left"/>
      Previous
    </Button>
    <Button onClick={next}
            disabled={!nextAlllowed}
            className={classes.button}>
      Next
      <Icon name="angle right"/>
    </Button>
  </View>)

const Cats = withCss(t => ({
  col: {
    marginBottom: t.spacing
  }
}))(({items, classes}) =>
  items.map(c =>
    <Col key={c.id} xs={6} md={4} lg={3} className={classes.col}>
      <Cat {...c}
           showVoteInfo={true}
           size={300}/>
    </Col>))

const TopCats = ({offset, next, sort, sortBy, previous, cats, previousAllowed, nextAllowed}) =>
  <View>
    <Grid>
      <Row>
        <Pagination next={next} previous={previous}
                    nextAlllowed={nextAllowed}
                    onSort={sort}
                    sortedBy={sortBy}
                    previousAllowed={previousAllowed}/>
      </Row>
      <Row>
        <Cats items={cats}/>
      </Row>
    </Grid>
  </View>

const pageSize = 12

export default compose(
  withRouter,
  withProps(({history, location}) => {
      const q = parse(location.search)
      const offset = parseInt(q.offset) || 0
      const sortBy = q.sort === 'date' ? 'date' : 'voteCount'

      const goTo = ({offset, sort = sortBy}) =>
        history.push({
          ...location,
          search: stringify({offset, sort})
        })

      const changeOffset = diff => {
        let newOffset = offset + diff
        if (newOffset < 0)
          newOffset = 0
        goTo({offset: newOffset})
      }

      return {
        next: () => changeOffset(pageSize),
        sort: by => goTo({offset: 0, sort: by}),
        previous: () => changeOffset(-pageSize),
        previousAllowed: offset > 0,
        offset,
        sortBy
      }
    }
  ),
  withStateHandlers({
    cats: []
  }, {
    setCats: () => cats => ({
      cats,
      nextAllowed: cats.length > 0 && cats.length % pageSize === 0
    })
  }),
  withAppContext(),
  lifecycle({

    fetchData () {
      const {catApi, offset, setCats, sortBy} = this.props
      catApi.getCatList({offset, size: pageSize, sort: sortBy})
        .then(setCats)

    },
    componentDidMount () {
      this.fetchData()
    },
    componentDidUpdate (prevProps) {
      const {location} = this.props
      const {location: prevLocation} = prevProps
      if (location.key !== prevLocation.key &&
        location.search !== prevLocation.search) {
        this.fetchData()
      }
    }
  })
)(TopCats)
