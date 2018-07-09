import React from 'react'
import { Button, Form } from 'semantic-ui-react'

export default class FolderForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        const { name } = this.state

        this.props.handleAddFolder(name)
    }
    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Folder Name</label>
                        <input required placeholder='App Name' onChange={this.handleNameChange} />
                    </Form.Field>
                    <Button type='submit' color='green'>Submit</Button>
                </Form>
            </div>
        )
    }
}