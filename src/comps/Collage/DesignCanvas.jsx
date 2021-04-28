import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import "./styles.css";
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

function handleSave(canv){
  let url=canv.toDataURL({ format: 'png', multiplier: 4 });
  console.log(url)
}
class DesignCanvas extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }

  static defaultProps = {
    width: 600,
    height: 400,
  }

  state = {
    canvas: null
  }

  componentDidMount() {
    const canvas = new fabric.Canvas(this.c)
    this.setState({ canvas })
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
          }}
        >
          Clear </Button>
          &nbsp;
          <Button variant="contained" color="secondary"  style={{ marginTop:"5%"}}
          onClick={(e) => {
            handleSave(this.state.canvas)
          }}>Save</Button>
          &nbsp;
          <Button variant="contained" color="secondary" style={{ marginTop:"5%"}}
          onClick={(e) => {
            handleChange(this.state.canvas)
          }}
        >
          Download
        </Button>
        {/* { Save && <ProgressBar message={SelectImg} name={SelectedImg} />} */}
      </Fragment>
    )
  }
}

export default DesignCanvas
