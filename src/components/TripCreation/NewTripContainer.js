import React from "react";
import { Grid } from "semantic-ui-react";
import SearchContainer from "./LocationSearch/SearchContainer";
import md5 from "js-md5";
import NewTripForm from "./NewTripForm";
import RailsApi from "../RailsApi";

class NewTripContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTripLocation: null,
      image: null
    };
  }

  setTripLocationState = userLocation => {
    this.getWikiDataID(userLocation);
    this.setState({
      newTripLocation: {
        coords: userLocation.center,
        name: userLocation.text,
        error: false
      }
    });
  };

  getWikiDataID = location => {
    let wikiDataId;
    if (
      location.properties.hasOwnProperty("wikidata") &&
      location.properties.landmark !== true
    ) {
      wikiDataId = location.properties.wikidata;
    } else {
      wikiDataId = location.context.find(feature =>
        feature.hasOwnProperty("wikidata")
      ).wikidata;
    }
    RailsApi.wikiPhoto(wikiDataId)
      .then(res => res.json())
      .then(json =>
        this.createImage(json.claims.P18["0"].mainsnak.datavalue.value)
      )
      .catch(this.noImage);
  };

  noImage = () => {
    this.setState({ image: "" });
  };

  createImage = name => {
    const formattedName = name.split(" ").join("_");
    const mdSum = md5(formattedName).slice(0, 2);
    const link = `https://upload.wikimedia.org/wikipedia/commons/${mdSum.slice(
      0,
      1
    )}/${mdSum}/${formattedName}`;
    this.setState({ image: link });
  };

  postTrip = formData => {
    let tripData = {
      ...formData,
      city: this.state.newTripLocation.name,
      address_latitude: this.state.newTripLocation.coords[1],
      address_longitude: this.state.newTripLocation.coords[0],
      image: this.state.image,
      status: true,
      user_id: this.props.user.id
    };
    RailsApi.postTrip(tripData)
      .then(res => res.json())
      .then(json => {
        this.props.updateTrips();
        this.props.history.push(`/trips/${json.id}`);
      });
  };

  render() {
    return (
      <Grid centered columns="equal">
        <Grid.Column width={8}>
          {!this.state.newTripLocation ? (
            <SearchContainer saveLocation={this.setTripLocationState} />
          ) : (
            <NewTripForm
              location={this.state.newTripLocation}
              postTrip={this.postTrip}
            />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

export default NewTripContainer;
