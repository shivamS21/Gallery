import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import "./styles.css";
import ProgressBar from "../ProgressBarBase"

const fabric = window.fabric
function handleChange(canv) {
  let url=canv.toDataURL({ format: 'png', multiplier: 4 });
  const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
  // console.log(canv.toDataURL({ format: 'png', multiplier: 4 }))
}


class DesignCanvas extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    setImages:PropTypes.func.isRequired
  }

  static defaultProps = {
    width: 600,
    height: 400,
  }

  state = {
    canvas: null,
    Save:null,
    warning:false
  }

  componentDidMount() {
    const canvas = new fabric.Canvas(this.c)
    this.setState({ canvas })
  }

  handleSave(canv){
    this.setState({warning:false})
    let url=canv.toDataURL({ format: 'jpeg', multiplier: 4 });
    if(url.length<1048487)
    this.setState({Save:url})
    else this.setState({warning:true})
    // console.log(url.length)
    // 1048487
    // console.log(url)
    
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        canvas: this.state.canvas,
      })
    })
    const { width, height } = this.props
    return (
      <Fragment>
        <canvas ref={(c) => (this.c = c)} width={width} height={height} className="canvas"/>
        {this.state.canvas && children}
        
        <Button variant="contained" color="secondary" style={{ marginTop:"5%"}}
          onClick={(e) => {
            e.preventDefault()
            this.state.canvas.clear()
            this.props.setImages([])
          }}
        >
          Clear </Button>
          &nbsp;
          <Button variant="contained" color="secondary"  style={{ marginTop:"5%"}}
          onClick={(e) => {
            this.handleSave(this.state.canvas)
          }}>Save</Button>
          &nbsp;
          <Button variant="contained" color="secondary" style={{ marginTop:"5%"}}
          onClick={(e) => {
            handleChange(this.state.canvas)
          }}
        >
          Download
        </Button>
        {this.state.warning && <div style={{color:"red"}}>The collage exceeds limit of 1MB. Try with lesser size images.</div>}
        { this.state.Save && <ProgressBar message={this.state.Save} name={"collage.png"} />}
      </Fragment>
    )
  }
}

export default DesignCanvas
