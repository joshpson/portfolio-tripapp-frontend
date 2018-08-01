import React from "react";
import { Form, Input } from "semantic-ui-react";

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
    fetch(
      "https://cryptic-headland-94862.herokuapp.com/https://api.yelp.com/v3/categories??locale=en_US",
      {
        headers: {
          authorization:
            "Bearer B0_o-WOtonclsraT47gpBMjFd_jGrcgkYkl6O74pf4ETwW_GBcfXgSdCbXjffWEsF2gYeFA54QnyG3sKi48covsP2qsu5wrBivNEHNqdUaS1rGcScv0Es8a8OXY_W3Yx"
        }
      }
    )
      .then(res => res.json())
      .then(json => this.formatCategories(json));
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
              {/*    <datalist id="categories">
                {this.state.categories.map(option => (
                  <option value={option.text} key={option.value} />
                ))}
              </datalist>*/}
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
