import React from 'react';
import { DropdownButton, Dropdown, ListGroup, Button, Form } from 'react-bootstrap'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'

import './App.css';

export default class App extends React.Component {
  state = {
    jokeInitialValue: 'Add your joke here',
    categories: [],
    categoryJokes: []
  }

  async getCategories() {
    const categories = await axios.get('http://localhost:8080/category')

    return this.setState({
      categories: categories.data
    })
  }

  async loadCategoryJokes (id) {
    await this.setState({ categoryJokes: [] })

    const axiosResponse = await axios.get('http://localhost:8080/joke')

    const jokes = axiosResponse.data

    const categoryJokes = jokes.filter((joke) => joke.categoryId === id)
    
    this.setState({
      categoryJokes: _.uniqWith(_.concat(this.state.categoryJokes, categoryJokes), _.isEqual) 
    })
  }

  deleteJoke(id) {
    return axios.delete(`http://localhost:8080/joke/${id}`)
  }

  handleSubmit(event) {
    return axios.post(`http://localhost:8080/joke`, { title: event.target[0].value, description :  event.target[1].value,categoryId: event.target[2].value })
  }

  componentDidMount() {
    this.getCategories()
  }
  render() {
    return (
      <div className="App">
        <DropdownButton id="dropdown-item-button" title="Categories" style={{float: "left", margin : "70px", display: "flex"}}>
          {this.state.categories.map((category, index) => {
            return (
              <Dropdown.Item key={index} as="button" onClick={() => this.loadCategoryJokes(category._id)}>{category.title}</Dropdown.Item>
            )
          })}
        </DropdownButton>
        
        {this.state.categoryJokes.length > 0 ?
          <ListGroup style={{ marginBottom: '15px', margin: '5%' }}>
            {this.state.categoryJokes.map((joke, index) => {
              return (
                <div key={index}>
                  <ListGroup.Item key={index}>
                    <div style={{ display: 'flex'}}>Joke: {joke.title}</div>
                    <br/>
                    <div style={{ display: 'flex'}}>Creation date : {moment(joke.createdAt).format("MMM Do YY")}</div>
                  <Button variant="danger" style={{ display: 'flex'}} onClick={ () => {
                    return this.deleteJoke(joke._id).then(() => window.location.reload())
                  } }>Delete</Button>

                  </ListGroup.Item>
                </div>
              )
            })}
          </ListGroup>
        : <div style={{ margin: "50px"}}></div>}

            
        <Form onSubmit={this.handleSubmit} style={{width: "30%", display: 'flex', alignContent: "center", flexDirection: 'column', margin: '10px'}}>
          <Form.Group required={true}>
            <Form.Control size="lg" type="textbox" placeholder="Enter your joke" />
            <br />
          </Form.Group>
          <Form.Group required={true}>
            <Form.Control size="lg" type="textbox" placeholder="Enter your joke description" />
            <br />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" required={true}>
            {this.state.categories.map((category, index) => {
                  return (
                    <option key={index} value={category._id}>{category.title}</option>
                  )
                })}
            </Form.Control>
          </Form.Group>
          
          <Button variant="primary" type="submit">Add joke</Button>
          
        </Form>

      </div>
    );
  }
}
