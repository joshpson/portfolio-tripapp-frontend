import React from "react";
import { Form, Input } from "semantic-ui-react";
import RailsApi from "../RailsApi";
import YelpDistanceFilter from "./YelpDistanceFilter";

class YelpCategoryFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], loading: false, value: "" };
  }

  componentDidMount() {
    this.setState({ loading: true }, this.getCategories);
  }

  getCategories = () => {
    RailsApi.yelpCategories()
      .then(res => res.json())
      .then(json => {
        this.formatCategories(json);
      });
  };

  formatCategories = ({ categories }) => {
    const categoriesToSet = [];
    const filteredCategories = categories.filter(category =>
      category.parent_aliases.includes("restaurants")
    );
    filteredCategories.forEach(category =>
      categoriesToSet.push({
        key: category.alias,
        text: category.title,
        value: category.alias
      })
    );
    this.setState({ categories: categoriesToSet, loading: false });
  };

  handleChange = (e, data) => {
    this.setState({ value: data.value });
  };

  handleSubmit = () => {
    this.props.getYelpResults(this.state.value);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Field>
            <div>
              <Input
                list="categories"
                placeholder="Search for a type of food..."
                onChange={this.handleChange}
                value={this.state.value}
              />
              <datalist id="categories">
                {this.state.categories.map(option => (
                  <option value={option.text} key={option.value} />
                ))}
              </datalist>
            </div>
          </Form.Field>
          <Form.Field>
            <YelpDistanceFilter filterDistance={this.props.filterDistance} />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default YelpCategoryFilter;
