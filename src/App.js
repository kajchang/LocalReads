import React, {Component} from 'react';
import { Col, Row, Container, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';

import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookTitle: '',
            bookAuthor: '',
            books: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);

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
                console.log(response);
                this.read();
            })
            .catch(err => {
                console.log(err);
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

    delete(event) {
        axios.delete('/delete', {
            data : {
                _id: event.target.id
            }
        })
            .then(response => {
                console.log(response);
                this.read();
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
                        <Create handleChange={ this.handleChange } create={ this.create } bookTitle={ this.state.bookTitle } bookAuthor={ this.state.bookAuthor }/>
                    </Col>
                    <Col>
                        <Read books={ this.state.books } delete={ this.delete }/>
                    </Col>
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
                <Button onClick={ this.props.create }>Create</Button>
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { this.props.books.map(book => <tr key={ this.props.books.indexOf(book) }>
                        <td>{ book.title }</td>
                        <td>{ book.author }</td>
                        <td>
                            <Button id={ book._id } onClick={ this.props.delete }>Delete</Button>
                        </td>
                    </tr>) }
                </tbody>
            </Table>
        )
    }
}

export default App;
