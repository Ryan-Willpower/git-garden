import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {compose, lifecycle} from 'recompose'

import {fetchGarden, select} from '../ducks/app'

function getTile(count) {
  if (count === 0) {
    return require('../assets/0.svg')
  } else if (count >= 1 && count < 5) {
    return require('../assets/1.svg')
  } else if (count >= 5 && count < 10) {
    return require('../assets/2.svg')
  } else if (count >= 10 && count < 20) {
    return require('../assets/3.svg')
  } else if (count >= 20 && count < 30) {
    return require('../assets/4.svg')
  } else if (count >= 30 && count < 40) {
    return require('../assets/5.svg')
  } else if (count >= 40) {
    return require('../assets/6.svg')
  }
}

const SIZE = 10
const SPACING = 3.3

function getRow(row) {
  if (row === 0) {
    // Ignore
  } else if (row % 2 === 0) {
    // 0
    return `translate(${row * 4}em, -${row * SPACING}em)`
  } else {
    // 4
    return `translate(${row * 4}em, -${row * SPACING}em)`
  }
}

const Scene = styled.div`
  position: relative;

  @media screen and (max-width: 480px) {
    transform: scale(0.4);
  }

  @media screen and (max-width: 800px) {
    transform: scale(0.8);
  }
`

const Week = styled.div`
  position: relative;
  z-index: ${props => props.row};

  transform: ${props => getRow(props.row)};
`

function getPos(x, y) {
  const tX = x * 8
  const tY = y * 6

  return `translate(${tX}em, ${tY}em)`
}

const Tile = styled.img`
  position: absolute;
  z-index: ${props => 7 - props.x};

  width: ${SIZE}em;
  height: ${SIZE}em;

  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transform: ${props => getPos(props.x, props.y)};

  &:hover {
    filter: drop-shadow(rgb(130, 231, 60) 0px 0px 12px);
    transform: ${props => getPos(props.x, props.y - 0.4)} scale(1.3);
  }
`

const Garden = ({garden, select}) => (
  <Scene>
    {garden.map((week, row) => (
      <Week key={row} row={row}>
        {week.map((day, col) => (
          <Tile
            key={day.date}
            onMouseOver={() => select(row, col)}
            src={getTile(day.count)}
            x={col}
            y={row}
          />
        ))}
      </Week>
    ))}
  </Scene>
)

const mapStateToProps = state => ({
  garden: state.app.garden,
})

const enhance = compose(
  connect(mapStateToProps, {fetchGarden, select}),
  lifecycle({
    async componentWillMount() {
      const id = this.props.username

      await this.props.fetchGarden(id)
    },
  }),
)

export default enhance(Garden)
