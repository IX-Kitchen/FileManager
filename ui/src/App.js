import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import NavBar from './components/NavBar';
import Explorer from './components/Explorer';
import FolderForm from './components/FolderForm';
import { BACK_ROOT } from './api-config'
import { Divider, Portal, Button, Segment, Header } from 'semantic-ui-react'

export default class AppList extends React.Component {

  constructor() {
    super()
    this.state = {
      struct: [],
      currentIndex: [],
      nav: ["/"]
    }
    this.getData = this.getData.bind(this)
    this.handleFolderClick = this.handleFolderClick.bind(this)
    this.handleNavClick = this.handleNavClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleAddFolder = this.handleAddFolder.bind(this)
  }

  componentDidMount() {
    this.getData().then(struct => {
      this.setState({
        struct: struct
      })
    })
  }

  handleFolderClick(event, { index }) {
    const { currentIndex, struct, nav } = this.state
    const currentFolder = struct[index]
    // When folder is empty children is not an array
    const temp = Array.isArray(currentFolder.children) ? currentFolder.children : [currentFolder.children]
    this.setState({
      currentIndex: [...currentIndex, index],
      struct: temp,
      nav: [...nav, currentFolder.name]
    })
  }

  handleAddFolder(name) {
    const path = this.state.nav.slice(1).join('')
    const opts = {
      method: 'post',
      body: `name=${name}&path=${path}`,
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }
    fetch(`${BACK_ROOT}/createFolder`, opts).then(() => {
      this.getData().then(struct => {
        this.state.currentIndex.forEach(i => {
          struct = struct[i].children
        });
        this.setState({ struct: struct })
      })
    })
  }

  handleNavClick(event, { index }) {
    this.getData().then(struct => {
      const currentIndex = this.state.currentIndex.slice(0, index)
      let nav = ["/"]
      currentIndex.forEach(i => {
        nav.push(struct[i].name)
        struct = struct[i].children
      });
      this.setState({
        struct: struct,
        currentIndex: currentIndex,
        nav: nav
      })
    })
  }

  async getData() {
    try {
      let response = await fetch(`${BACK_ROOT}/checkContent`);
      let temp = await response.json()
      return temp
    } catch (error) {
      console.error(error)
    }
  }

  handleUpload(files) {
    var formData = new FormData();
    files.forEach(element => {
      formData.append('uploader', element);
    });
    const path = this.state.nav.slice(1).join('')
    formData.append('path', path)
    const opts = {
      method: 'post',
      body: formData,
    }
    fetch(`${BACK_ROOT}/upload`, opts).then(() => {
      this.getData().then(struct => {
        this.state.currentIndex.forEach(i => {
          struct = struct[i].children
        });
        this.setState({ struct: struct })
      })
    })
  }

  handleDelete(event, { path }) {
    const opts = {
      method: 'post',
      body: `path=${path}`,
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }
    fetch(`${BACK_ROOT}/delete`, opts).then(() => {
      this.getData().then(struct => {
        this.state.currentIndex.forEach(i => {
          struct = struct[i].children
        });
        this.setState({ struct: struct })
      })
    })
  }

  handleDownload(event, { path }) {
    window.open(`${BACK_ROOT}/download?path=${encodeURIComponent(path)}`, '_blank');
  }
  handleShow(event, { path }) {
    window.open(`${BACK_ROOT}/show?path=${encodeURIComponent(path)}`, '_blank');
  }

  render() {
    console.log(this.state)
    let { struct, nav } = this.state
    return (
      <div className="App">
        <Divider />
        <NavBar nav={nav} handleNavClick={this.handleNavClick} />
        <Divider />
        <Portal closeOnPortalMouseLeave trigger={
          <Button size='mini' color='green'>
            New folder
          </Button>}>
          <Segment style={{ left: '40%', position: 'fixed', top: '40%', zIndex: 1000 }}>
            <Header>New folder's name</Header>
            <FolderForm handleAddFolder={this.handleAddFolder} />
          </Segment>
        </Portal>
        <Divider hidden/>
        <Explorer struct={struct} handleFolderClick={this.handleFolderClick}
          handleDelete={this.handleDelete} handleDownload={this.handleDownload}
          handleShow={this.handleShow} handleUpload={this.handleUpload} />
      </div>
    )
  }
}

