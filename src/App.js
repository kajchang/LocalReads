import React, {Component} from 'react';
import { Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert, Table } from 'reactstrap';

import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookTitle: '',
            bookAuthor: '',
            createMessage: '',
            books: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.create = this.create.bind(this);

        this.read();
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    create() {
        axios.post('/create', {
            title: this.state.bookTitle,
            author: this.state.bookAuthor
        })
            .then(response => {
                this.setState({
                   createMessage: response.data.result
                });
                this.read();
            })
            .catch(err => {
                this.setState({
                    createMessage: err.response.data.result
                });
            });

        this.setState({
            bookTitle: '',
            bookAuthor: ''
        });
    }

    read() {
        axios.get('/read')
            .then(response => {
                this.setState({
                  books: response.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Create handleChange={ this.handleChange } create={ this.create } createMessage={ this.state.createMessage } bookTitle={ this.state.bookTitle } bookAuthor={ this.state.bookAuthor }/>
                    </Col>
                    <Col>
                        <Read books={ this.state.books }/>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}

class Create extends Component {
    render() {
        return (
            <Form>
                <FormGroup>
                    <Label>Book Title</Label>
                    <Input name="bookTitle" placeholder="Book Title" value={ this.props.bookTitle } onChange={ this.props.handleChange }/>
                </FormGroup>
                <FormGroup>
                    <Label>Book Author</Label>
                    <Input name="bookAuthor" placeholder="Book Author" value={ this.props.bookAuthor } onChange={ this.props.handleChange }/>
                </FormGroup>
                <Button onClick={this.props.create}>Create</Button>
                {this.props.createMessage === '' ? (
                    <div></div>
                ) : (
                    <Alert color="secondary">
                        { this.props.createMessage }
                    </Alert>
                )}
            </Form>
        );
    }
}

class Read extends Component {
    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Book Author</th>
                    </tr>
                </thead>
                <tbody>
                    { this.props.books.map(book => <tr key={ this.props.books.indexOf(book) }>
                        <td>{ book.title }</td>
                        <td>{ book.author }</td>
                    </tr>) }
                </tbody>
            </Table>
        )
    }
}

export default App;
