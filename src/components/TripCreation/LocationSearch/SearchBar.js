import React from "react";
import debounce from "lodash/debounce";
import { Form, Input, Segment, List } from "semantic-ui-react";

import SearchResults from "./SearchResults";
import RailsApi from "../../RailsApi";

import Error from "../../Error";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      results: [],
      error: false
    };
  }

  searchforLocation = debounce(() => {
    RailsApi.searchMapBox(this.state.search.split(" ").join("_"))
      .then(res => res.json())
      .then(json => {
        if (json.features) {
          this.setState({ results: json.features });
        }
      });
  }, 200);

  locationError = () => {
    this.setState({ error: true }, this.props.history.push("/home"));
  };

  handleError = () => {
    this.setState(
      {
        search: "",
        results: []
      },
      this.locationError()
    );
  };

  handleChange = event => {
    this.setState({ search: event.target.value }, this.searchforLocation());
  };

  getLocationFromList = element => {
    this.props.saveLocation(element.result);
  };

  render() {
    return (
      <Segment basic>
        {this.state.error ? (
          <Error
            message={"Location could not be found, search again"}
            color={"red"}
          />
        ) : null}
        <Form>
          <Form.Field>
            {this.state.loading === true ? (
              <Input loading placeholder="Search..." />
            ) : (
              <Input
                icon
                placeholder="Search..."
                onChange={this.handleChange}
                value={this.state.search}
              />
            )}
          </Form.Field>
        </Form>
        {this.state.results.map(result => (
          <List selection key={result.id}>
            <SearchResults result={result} select={this.getLocationFromList} />
          </List>
        ))}
      </Segment>
    );
  }
}

export default SearchBar;
