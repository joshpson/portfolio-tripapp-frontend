import React from "react";
import {
  Grid,
  Loader,
  Item,
  Header,
  Button,
  Icon,
  Divider
} from "semantic-ui-react";
import distance from "@turf/distance";
import YelpSearchCard from "./YelpSearchCard";
import YelpCategoryFilter from "./YelpCategoryFilter";
import Error from "../Error";
import Map from "../Map/Map";
import MapDirections from "../Map/MapDirections";
import MapDirectionsFilter from "../Map/MapDirectionsFilter";
import RailsApi from "../RailsApi";

class YelpSearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      loading: false,
      complete: false,
      filteredResults: [],
      searchDistance: "",
      destination: "",
      directionsType: "driving"
    };
  }

  setResults = results => {
    const sortedResults = results.slice();
    sortedResults.forEach(result => {
      const to = [result.coordinates.longitude, result.coordinates.latitude];
      const from = [this.props.longitude, this.props.latitude];
      const options = { units: "miles" };
      const userDistance = distance(from, to, options);
      result.distance = userDistance;
    });
    sortedResults.sort((a, b) => b.rating - a.rating);
    const initialResults = sortedResults
      .filter(result => result.distance <= 1)
      .slice(0, 5);
    this.setState({
      results: sortedResults,
      loading: false,
      complete: true,
      error: false,
      filteredResults: initialResults,
      searchDistance: "The best within a mile",
      destination: ""
    });
  };

  getYelpResults = category => {
    this.setState({
      loading: true
    });
    RailsApi.searchYelp({
      query: category,
      latitude: this.props.latitude,
      longitude: this.props.longitude
    })
      .catch(this.handleError)
      .then(res => res.json())
      .then(json => this.setResults(json.businesses));
  };

  handleError = () => {
    this.setState({ error: true });
  };

  filterDistance = data => {
    let filteredResults = this.state.results.slice();
    let searchDistance;
    if (data === 1 || typeof data === "undefined") {
      filteredResults = this.state.results
        .filter(result => result.distance <= 1)
        .slice(0, 5);
      searchDistance = "The best within a mile";
    } else if (data === 2) {
      filteredResults = this.state.results
        .filter(result => result.distance <= 3)
        .slice(0, 5);
      searchDistance = "The best within three miles";
    } else if (data === 3) {
      filteredResults = this.state.results.slice(0, 5);
      searchDistance = "The best in the area";
    }
    this.setState({
      filteredResults: filteredResults,
      searchDistance: searchDistance,
      destination: ""
    });
  };

  showDirections = target => {
    this.setState({ destination: target });
  };

  removeDestination = () => {
    this.setState({ destination: "" });
  };

  setDirectionType = (event, data) => {
    let directionsType;
    if (data.value === 1 || typeof data.value === "undefined") {
      directionsType = "driving";
    } else if (data.value === 2) {
      directionsType = "walking";
    } else if (data.value === 3) {
      directionsType = "cycling";
    }
    this.setState({ directionsType: directionsType });
  };

  render() {
    return (
      <Grid columns={1}>
        <Grid.Column>
          {this.state.error === true ||
            (typeof this.state.results === "undefined" && (
              <Error
                message={"Location not found. Please select a trip"}
                color={"red"}
              />
            ))}
          {this.state.complete === true &&
            this.state.filteredResults.length === 0 && (
              <Error
                message={
                  "No results found, please adjust your distance filter or search again."
                }
                color={"brown"}
              />
            )}
          {this.state.loading === false && (
            <YelpCategoryFilter
              getYelpResults={this.getYelpResults}
              filterDistance={this.filterDistance}
            />
          )}
          {this.state.filteredResults.length > 0 &&
            this.state.loading === false && (
              <Header as="h2" block>
                {this.state.searchDistance}
              </Header>
            )}
        </Grid.Column>
        {this.state.loading === true && (
          <div>
            <Loader active inline="centered" />
            <Divider hidden />
          </div>
        )}
        {this.state.filteredResults.length > 0 &&
          this.state.loading === false && (
            <Grid columns={2}>
              <Grid.Column>
                <Item.Group divided>
                  {this.state.filteredResults.map(result => (
                    <YelpSearchCard
                      key={result.id}
                      result={result}
                      bookmark={this.props.bookmark}
                      showDirections={this.showDirections}
                    />
                  ))}
                </Item.Group>
              </Grid.Column>
              <Grid.Column>
                {this.state.destination === "" ? (
                  <Map
                    points={this.state.filteredResults}
                    userLocation={[this.props.longitude, this.props.latitude]}
                  />
                ) : (
                  <div>
                    <Button basic as="a" onClick={this.removeDestination}>
                      <Icon name="arrow left" />
                      Map overview
                    </Button>
                    <Header as="h2">
                      Directions to {this.state.destination.name}
                      <Header.Subheader>
                        {this.state.directionsType}
                      </Header.Subheader>
                    </Header>
                    <MapDirectionsFilter
                      setDirectionType={this.setDirectionType}
                    />
                    <MapDirections
                      userLocation={[this.props.longitude, this.props.latitude]}
                      destination={this.state.destination}
                      removeDestination={this.removeDestination}
                      directionsType={this.state.directionsType}
                    />
                  </div>
                )}
              </Grid.Column>
            </Grid>
          )}
      </Grid>
    );
  }
}

export default YelpSearchContainer;
