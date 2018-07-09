import React from 'react'
import { Button, Grid, Icon } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const overlayStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  padding: '2.5em 0',
  background: 'rgba(0,0,0,0.5)',
  textAlign: 'center',
  color: '#fff'
};
export default class Explorer extends React.Component {

  constructor() {
    super()
    this.state = {
      dropzoneActive: false,
    }
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }
  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    this.props.handleUpload(files)
    this.setState({
      dropzoneActive: false
    });
  }

  render() {
    const { handleFolderClick, struct, handleDelete, handleDownload, handleShow } = this.props
    const { dropzoneActive } = this.state
    return (
      <Dropzone
        disableClick
        style={{ position: "relative", "height": "80%" }}
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}>
        
        {dropzoneActive && <div style={overlayStyle}>Drop files...</div>}
        <Grid container columns={3}>
          {struct && struct.map((item, index) => {
            if (item.type === "file") {
              return (
                <Grid.Column key={item.name}>
                  <ContextMenuTrigger id={item + index}>
                    <Button>{item.name}</Button>
                  </ContextMenuTrigger>
                  <ContextMenu id={item + index}>
                    <br />
                    <br />
                    <MenuItem>
                      <Button.Group vertical>
                        <Button basic color='black' onClick={handleShow} path={item.path}>Show</Button>
                        <Button basic color='teal' onClick={handleDownload} path={item.path}>Download</Button>
                        <Button basic color='red' onClick={handleDelete} path={item.path}>Delete</Button>
                      </Button.Group>
                    </MenuItem>
                  </ContextMenu>
                </Grid.Column>
              )
            } else {
              return (
                <Grid.Column key={item.name}>
                  <ContextMenuTrigger id={item + index}>
                    <Button icon labelPosition='right' index={index} onClick={handleFolderClick}>
                      <Icon name='folder' />
                      {item.name}
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenu id={item + index}>
                    <br />
                    <br />
                    <MenuItem>
                      <Button.Group vertical>
                        <Button basic color='teal' onClick={handleDownload} path={item.path}>Download</Button>
                        <Button basic color='red' onClick={handleDelete} path={item.path}>Delete</Button>
                      </Button.Group>
                    </MenuItem>
                  </ContextMenu>
                </Grid.Column>
              )
            }

          })}
        </Grid>
      </Dropzone>

    )
  }
}