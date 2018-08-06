import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Nav from "./Nav";
import RailsApi from "./RailsApi";
import UserTrips from "./Trips/UserTrips";
import Trip from "./Trips/Trip";
import UserContainer from "./User/UserContainer";
import NewTripContainer from "./TripCreation/NewTripContainer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      trips: []
    };
  }

  setUser = user => {
    this.setState(
      {
        user: user
      },
      () => {
        this.updateTrips();
        this.props.history.push("/create-trip");
      }
    );
  };

  updateTrips = () => {
    RailsApi.getTrips()
      .then(res => res.json())
      .then(trips => {
        this.setState({ trips: trips });
      });
  };

  render() {
    return (
      <div className="ui container">
        <Nav user={this.state.user} />
        {this.state.user ? (
          <div>
            <Switch>
              <Route
                exact
                path="/"
                render={props => {
                  return (
                    <UserTrips
                      trips={this.state.trips}
                      updateTrips={this.updateTrips}
                      image={this.state.image}
                    />
                  );
                }}
              />
              <Route
                path="/create-trip"
                render={props => {
                  return (
                    <NewTripContainer
                      location={this.state.newTripLocation}
                      Trip={this.postTrip}
                      history={props.history}
                      updateTrips={this.updateTrips}
                      user={this.state.user}
                    />
                  );
                }}
              />
              <Route
                path="/trips/:tripId"
                render={props => {
                  return (
                    <Trip
                      trips={this.state.trips}
                      {...props}
                      updateTrips={this.updateTrips}
                    />
                  );
                }}
              />
            </Switch>
          </div>
        ) : (
          <UserContainer setUser={this.setUser} />
        )}
      </div>
    );
  }
}
export default withRouter(App);
