import React, {Component} from 'react';
import { Col, Row, Container, Form, FormGroup, Label, Input, Button, Table, Navbar, NavbarBrand } from 'reactstrap';

import axios from 'axios';

class LocalReads extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookTitle: '',
            bookAuthor: '',
            books: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBookChange = this.handleBookChange.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);

        this.read();
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleBookChange(event) {
        const updatedBooks = this.state.books;

        updatedBooks[updatedBooks.findIndex(book => book._id === event.target.id)][event.target.name] = event.target.value;

        this.setState({
            books: updatedBooks
        });
    }

    async create() {
        await axios.post('/create', {
            title: this.state.bookTitle,
            author: this.state.bookAuthor
        });

        this.read();

        this.setState({
            bookTitle: '',
            bookAuthor: ''
        });
    }

    async read() {
        const response = await axios.get('/read');

        this.setState({
            books: response.data
        });
    }

    async update(event) {
        await axios.put('/update', {
            _id: event.target.id,
            newAuthor: this.state.books[this.state.books.findIndex(book => book._id === event.target.id)].author,
            newTitle: this.state.books[this.state.books.findIndex(book => book._id === event.target.id)].title
        });

        this.read();
    }

    async delete(event) {
        await axios.delete('/delete', {
            data : {
                _id: event.target.id
            }
        });

        this.read();
    }

    render() {
        return (
            <Container>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>LocalReads</NavbarBrand>
                </Navbar>
                <Row>
                    <Col>
                        <Create handleChange={ this.handleChange } create={ this.create } bookTitle={ this.state.bookTitle } bookAuthor={ this.state.bookAuthor }/>
                    </Col>
                    <Col>
                        <Read books={ this.state.books } delete={ this.delete } update={ this.update } handleBookChange={ this.handleBookChange }/>
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
                        <th/>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    { this.props.books.map(book => <tr key={ this.props.books.indexOf(book) }>
                        <td>
                            <Input name='title' id={ book._id } value={ book.title } onChange={ this.props.handleBookChange }/>
                        </td>
                        <td>
                            <Input name='author' id={ book._id } value={ book.author } onChange={ this.props.handleBookChange }/>
                        </td>
                        <td>
                            <Button id={ book._id } onClick={ this.props.delete }>Delete</Button>
                        </td>
                        <td>
                            <Button id={ book._id } onClick={ this.props.update }>Update</Button>
                        </td>
                    </tr>) }
                </tbody>
            </Table>
        )
    }
}

export default LocalReads;
