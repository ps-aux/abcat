import React from 'react'
import { withCss } from '../../style'
import c from 'classnames'

class CenteredImage extends React.Component {

  state = {img: null}

  componentDidUpdate (prevProps) {
    if (this.props.src !== prevProps.src)
      this.setState({img: null})
  }

  onImgLoad = () => {
    // this.el.style.backgroundImage = `url(${this.props.src})`
    this.setState({img: this.props.src})
  }

  render () {
    const {className, src, loadingImg} = this.props
    const {img} = this.state
    return <>
      <div className={className}
           style={{
             backgroundImage: `url(${img || loadingImg})`,
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'left',
             backgroundSize: 'cover'
           }}/>
      <img src={src}
           alt=""
           style={{height: 0}}
           onLoad={this.onImgLoad}/>
    </>
  }
}

const Image = ({children, classes, centered, className, ...props}) =>
  centered ? <CenteredImage
      className={c(classes.root, className)}
      {...props}
    /> :
    <img {...props} className={c(classes.root, className)}>{children}</img>

export default withCss({
  root: ps => ({
    height: ps.height,
    width: ps.width

  }),

})(Image)