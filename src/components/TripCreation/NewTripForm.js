import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Segment, Header, Icon } from "semantic-ui-react";
import Error from "../Error";

class NewTripForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      error: null
    };
  }

  handleStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleEndDate = date => {
    this.setState({
      endDate: date
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let formData = {
      start_date: this.state.startDate,
      end_date: this.state.endDate
    };
    if (
      this.state.startDate &&
      this.state.endDate &&
      this.state.startDate < this.state.endDate &&
      this.state.startDate > Date.now()
    ) {
      this.props.postTrip(formData);
    } else {
      this.setState({
        error: "Please enter future dates."
      });
    }
  };

  render() {
    return (
      <Segment>
        {this.state.error ? <Error message={this.state.error} /> : null}
        <Header as="h1">
          <Icon name="plane" />
          <Header.Content>
            {this.props.location.name}
            <Header.Subheader>Enter your trip dates</Header.Subheader>
          </Header.Content>
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Field
              label="Start Date"
              control={DatePicker}
              placeholderText="Start Date"
              selected={this.state.startDate}
              onChange={this.handleStartDate}
            />
            <Form.Field
              label="End Date"
              control={DatePicker}
              placeholderText="End Date"
              selected={this.state.endDate}
              onChange={this.handleEndDate}
            />
          </Form.Group>
          <Form.Group widths="equal" />
          <Form.Button type="submit">Save</Form.Button>
        </Form>
      </Segment>
    );
  }
}

export default NewTripForm;
